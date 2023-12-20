import { getLeastCommonMultipleForArray } from '../math';

type ModuleType = 'flip-flop' | 'conjunction' | 'broadcast';
type Pulse = 'high' | 'low';

type Module = {
  name: string;
  destinations: string[];
} & (
  | {
      type: 'broadcast';
    }
  | {
      type: 'flip-flop';
      isOn: boolean;
    }
  | {
      type: 'conjunction';
      memory: Map<string, Pulse>;
    }
);

type SentPulse = {
  from: string;
  to: string;
  pulse: Pulse;
};

type Accumulators = {
  lowPulseIterations: Map<string, number>;
  buttonPresses: number;
};

type Modules = Map<string, Module>;

const buildModule = (type: ModuleType, name: string, destinations: string[]): Module => {
  if (type === 'flip-flop') {
    return {
      name,
      type,
      isOn: false,
      destinations,
    };
  }

  if (type === 'conjunction') {
    return {
      name,
      type,
      destinations,
      memory: new Map(),
    };
  }

  return {
    name,
    type,
    destinations,
  };
};

const getModules = (input: string): Modules => {
  const lines = input.split('\n').filter(Boolean);

  // broadcaster -> a, b, c
  // %a -> b
  // %b -> c
  // %c -> inv
  // &inv -> a

  const modules: Map<string, Module> = new Map();
  lines.forEach((line) => {
    const [prefix, suffix] = line.split('->').map((p) => p.trim());
    let moduleType: ModuleType = 'broadcast';
    let moduleName: string;
    if (prefix === 'broadcaster') {
      moduleType = 'broadcast';
      moduleName = prefix;
    } else {
      moduleType = prefix.at(0) === '%' ? 'flip-flop' : 'conjunction';
      moduleName = prefix.slice(1);
    }

    const destinations = suffix.split(',').map((p) => p.trim());
    modules.set(moduleName, buildModule(moduleType, moduleName, destinations));
  });

  // Set initial memory for conjunction modules.
  for (const [name, module] of modules.entries()) {
    for (const destination of module.destinations) {
      const destinationModule = modules.get(destination);
      if (destinationModule?.type === 'conjunction') {
        destinationModule.memory.set(name, 'low');
      }
    }
  }

  return modules;
};

const handlePulse = (
  modules: Modules,
  moduleName: string,
  pulse: Pulse,
  from: string,
  inputsToFinalModule: string[],
  accumulators: Accumulators
): Array<SentPulse> => {
  //console.log(`${from} -${pulse}-> ${moduleName}`);
  const module = modules.get(moduleName);
  if (!module) {
    return [];
  }

  // Final conjunction module has 4 inputs: 'nh', 'dr', 'xm', 'tr'.
  // Remember when they receive their first low input.
  // Assume that is their cycle length.
  if (
    pulse === 'low' &&
    !accumulators.lowPulseIterations.has(moduleName) &&
    inputsToFinalModule.includes(moduleName)
  ) {
    accumulators.lowPulseIterations.set(moduleName, accumulators.buttonPresses);
  }

  const { type, destinations } = module;

  const futurePulsesToSend: Array<SentPulse> = [];
  switch (type) {
    case 'broadcast': {
      // When a broadcast module receives a pulse, it sends the same pulse to all of its destination modules.
      for (const destination of destinations) {
        futurePulsesToSend.push({ to: destination, pulse, from: moduleName });
      }
      break;
    }
    case 'flip-flop': {
      // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
      if (pulse === 'low') {
        for (const destination of destinations) {
          futurePulsesToSend.push({
            to: destination,
            pulse: module.isOn ? 'low' : 'high', // If it was off, it sends a high pulse.
            from: moduleName,
          });
        }

        // It flips between on and off.
        module.isOn = !module.isOn;
      }
      break;
    }
    case 'conjunction': {
      // When a pulse is received, the conjunction module first updates its memory for that input.
      module.memory.set(from, pulse);

      // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
      const allHigh = [...module.memory.values()].every((p) => p === 'high');
      for (const destination of destinations) {
        futurePulsesToSend.push({
          to: destination,
          pulse: allHigh ? 'low' : 'high',
          from: moduleName,
        });
      }
      break;
    }
  }

  return futurePulsesToSend;
};

const pressButton = (
  modules: Modules,
  inputsToFinalModule: string[] = [],
  accumulators: Accumulators = {
    lowPulseIterations: new Map(),
    buttonPresses: 0,
  }
) => {
  let lowIncrement = 0;
  let highIncrement = 0;

  let tempQueue: Array<SentPulse> = [];
  let queue: Array<SentPulse> = [{ from: 'button', to: 'broadcaster', pulse: 'low' }];
  while (queue.length) {
    tempQueue = [];
    while (queue.length) {
      const { from, pulse, to } = queue.shift()!;
      if (pulse === 'low') {
        lowIncrement++;
      } else {
        highIncrement++;
      }

      const futurePulsesToSend = handlePulse(
        modules,
        to,
        pulse,
        from,
        inputsToFinalModule,
        accumulators
      );
      tempQueue.push(...futurePulsesToSend);
    }
    queue = tempQueue;
  }

  return { lowIncrement, highIncrement };
};

export const getPartOneSolution = (input: string): string => {
  const modules = getModules(input);

  let lowPulses = 0;
  let highPulses = 0;
  for (let i = 0; i < 1000; i++) {
    const { lowIncrement, highIncrement } = pressButton(modules);
    lowPulses += lowIncrement;
    highPulses += highIncrement;
  }

  const answer = lowPulses * highPulses;
  return answer.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const modules = getModules(input);
  const accumulators: Accumulators = {
    lowPulseIterations: new Map(),
    buttonPresses: 0,
  };

  const finalModule = [...modules.values()].find(
    (m) => m.type === 'conjunction' && m.destinations.length === 1 && m.destinations[0] === 'rx'
  );

  if (!finalModule) {
    throw new Error('Input is horked');
  }

  const inputsToFinalModule = [...modules.values()]
    .filter((m) => m.destinations.includes(finalModule.name))
    .map((m) => m.name);

  if (!inputsToFinalModule.length) {
    throw new Error('Input is horked');
  }

  while (accumulators.lowPulseIterations.size < inputsToFinalModule.length) {
    accumulators.buttonPresses++;
    pressButton(modules, inputsToFinalModule, accumulators);
  }

  const minButtonPresses = getLeastCommonMultipleForArray([
    ...accumulators.lowPulseIterations.values(),
  ]);

  return minButtonPresses.toString();
};

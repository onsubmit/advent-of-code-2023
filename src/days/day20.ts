type ModuleType = 'flip-flop' | 'conjuction' | 'broadcast';
type Pulse = 'high' | 'low';

// type Module = {
//   type: ModuleType;
//   isOn: boolean;
//   connectedModuleNames: string[];
// };

type Module = {
  connectedModuleNames: string[];
} & (
  | {
      type: 'broadcast';
    }
  | {
      type: 'flip-flop';
      isOn: boolean;
    }
  | {
      type: 'conjuction';
      memory: Map<string, Pulse>;
    }
);

export const getPartOneSolution = (input: string): string => {
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
      switch (prefix.at(0)) {
        case '%':
          moduleType = 'flip-flop';
          break;
        case '&':
          moduleType = 'conjuction';
          break;
      }
      moduleName = prefix.slice(1);
    }

    const connectedModuleNames = suffix.split(',').map((p) => p.trim());
    if (moduleType === 'flip-flop') {
      modules.set(moduleName, {
        type: moduleType,
        isOn: false,
        connectedModuleNames,
      });
    } else if (moduleType === 'conjuction') {
      modules.set(moduleName, {
        type: moduleType,
        connectedModuleNames,
        memory: new Map(),
      });
    } else {
      modules.set(moduleName, {
        type: moduleType,
        connectedModuleNames,
      });
    }
  });

  for (const [name, module] of modules.entries()) {
    for (const connected of module.connectedModuleNames) {
      const connectedModule = modules.get(connected);
      if (connectedModule?.type === 'conjuction') {
        connectedModule.memory.set(name, 'low');
      }
    }
  }

  let lowPulses = 0;
  let highPulses = 0;
  const handlePulse = (
    moduleName: string,
    pulse: Pulse,
    from: string
  ): Array<{ name: string; pulse: Pulse; from: string }> => {
    //console.log(`${from} -${pulse}-> ${moduleName}`);
    if (pulse === 'low') {
      lowPulses++;
    } else {
      highPulses++;
    }

    const module = modules.get(moduleName);
    if (!module) {
      return [];
    }

    const { type, connectedModuleNames } = module;

    const newPulsesToSend: Array<{ name: string; pulse: Pulse; from: string }> = [];
    switch (type) {
      case 'broadcast': {
        for (const connected of connectedModuleNames) {
          newPulsesToSend.push({ name: connected, pulse, from: moduleName });
        }
        break;
      }
      case 'flip-flop': {
        if (pulse === 'low') {
          if (module.isOn) {
            module.isOn = false;
            for (const connected of connectedModuleNames) {
              newPulsesToSend.push({ name: connected, pulse: 'low', from: moduleName });
            }
          } else {
            module.isOn = true;
            for (const connected of connectedModuleNames) {
              newPulsesToSend.push({ name: connected, pulse: 'high', from: moduleName });
            }
          }
        }
        break;
      }
      case 'conjuction': {
        module.memory.set(from, pulse);
        const allHigh = [...module.memory.values()].every((p) => p === 'high');
        for (const connected of connectedModuleNames) {
          newPulsesToSend.push({
            name: connected,
            pulse: allHigh ? 'low' : 'high',
            from: moduleName,
          });
        }
        break;
      }
    }

    return newPulsesToSend;
  };

  for (let i = 0; i < 1000; i++) {
    //console.log(`Button press ${i + 1}`);
    let queue: Array<{ name: string; pulse: Pulse; from: string }> = [
      { name: 'broadcaster', pulse: 'low', from: 'button' },
    ];
    let tempQueue: Array<{ name: string; pulse: Pulse; from: string }> = [];
    while (queue.length) {
      tempQueue = [];
      while (queue.length) {
        const pulse = queue.shift()!;
        const newPulses = handlePulse(pulse.name, pulse.pulse, pulse.from);
        tempQueue.push(...newPulses);
      }
      queue = tempQueue;
    }
  }

  const answer = lowPulses * highPulses;
  return answer.toString();
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split('\n').filter(Boolean);

  return lines.toString();
};

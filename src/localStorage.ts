type Cache = Record<string, string>;

const LOCAL_STORAGE_KEY = 'cache';

const getDayPartKey = (day: number, part: number): string => {
  return [day.toString().padStart(2, '0'), part].join();
};

export const setInput = (day: number, part: number, value: string): void => {
  const cache = getCache();
  cache[getDayPartKey(day, part)] = value;

  const ordered = Object.keys(cache)
    .sort()
    .reduce<Cache>((obj, key) => {
      obj[key] = cache[key];
      return obj;
    }, {});

  try {
    const cacheStr = JSON.stringify(ordered);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
};

export const getInput = (day: number, part: number): string => {
  const cache = getCache();
  return cache[getDayPartKey(day, part)] ?? '';
};

export const getCurrentDayIndex = (): number | undefined => {
  const cache = getCache();
  const currentDay: string | undefined = cache['currentDayIndex'];
  if (currentDay) {
    return parseInt(currentDay, 10);
  }
};

export const setCurrentDayIndex = (dayIndex: number): void => {
  const cache = getCache();
  cache['currentDayIndex'] = dayIndex.toString();

  try {
    const cacheStr = JSON.stringify(cache);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
};

const getCache = (): Cache => {
  const cacheStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!cacheStr) {
    return {};
  }

  try {
    return (JSON.parse(cacheStr) ?? {}) as Cache;
  } catch {
    return {};
  }
};

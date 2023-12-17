type Cache = Record<string, string>;

const LOCAL_STORAGE_KEY = 'cache';

export const setInput = (day: number, part: number, value: string): void => {
  const cache = getCache();

  const key = `${day}-${part}`;
  cache[key] = value;

  try {
    const cacheStr = JSON.stringify(cache);
    localStorage.setItem(LOCAL_STORAGE_KEY, cacheStr);
  } catch (e) {
    console.error(e);
  }
};

export const getInput = (day: number, part: number): string => {
  const cache = getCache();

  const key = `${day}-${part}`;
  return cache[key] ?? '';
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

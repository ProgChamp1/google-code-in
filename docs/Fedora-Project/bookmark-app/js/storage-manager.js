const bindStorage = k => localStorage[k].bind(localStorage);
/**
 * @type {Storage['getItem']}
 */
export const get = bindStorage("getItem");
/**
 * @type {Storage['setItem']}
 */
export const set = bindStorage("setItem");
/**
 * @type {Storage['removeItem']}
 */
export const remove = bindStorage("removeItem");
/**
 * @type {Storage['clear']}
 */
export const clear = bindStorage("clear");

export const getJson = (k, safeReturn) => {
  const ret = get(k);
  if (ret) return JSON.parse(ret);
  return safeReturn || {};
};

export const setJson = (k, v) => set(k, JSON.stringify(v));

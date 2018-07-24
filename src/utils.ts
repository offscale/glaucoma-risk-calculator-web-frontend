export const redirUrlOr = (str: string): string =>
  new URLSearchParams(window.location.search.slice(1)).get('redirectUrl') || str;

export const groupBy = (list: Array<{}>, keyGetter: (s: {}) => string): Map<string, any> => {
  const map = new Map<string, any>();
  list.forEach(item => {
    const key: string = keyGetter(item);
    const collection = map.get(key);
    if (!collection)
      map.set(key, [item]);
    else
      collection.push(item);
  });
  return map;
};

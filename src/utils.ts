export const redirUrlOr = (str: string): string =>
  new URLSearchParams(window.location.search.slice(1)).get('redirectUrl') || str;


export const deleteServerKeys = (obj: {}) => {
  if (!obj) return obj;
  ['id', 'createdAt', 'updatedAt'].forEach(k => delete obj[k]);
  return obj;
};

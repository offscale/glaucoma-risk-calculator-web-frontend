export const redirUrlOr = (str: string): string =>
  new URLSearchParams(window.location.search.slice(1)).get('redirectUrl') || str;

export const nextEvent = (obj, event) =>
  new Promise(resolve => obj.addEventListener(event, resolve, { once: true }));

export const getSrc = id =>
  document.querySelector('meta[name="img-' + id + '"]').getAttribute("content");

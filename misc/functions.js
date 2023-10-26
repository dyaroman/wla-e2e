exports.getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.fromCamelCaseToWords = (str) =>
  str
    .split(/(?=[A-Z0-9])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([A-Z]+) /g, '$1');

exports.prepareUrl = (url) => {
  // add protocol if it wasn't passed
  if (/^https?:\/\//.test(url) === false) {
    url = `https://${url}`;
  }
  // remove trailing slash if it was passed
  if (/\/$/.test(url)) {
    url = url.slice(0, -1);
  }
  return url;
};

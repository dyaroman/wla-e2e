exports.getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.getRandomSubset = (arr = [], size = arr.length) => {
  const subsetSize = Math.min(size, arr.length);
  const shuffledArray = [...arr];

  // Shuffle the array using the Fisher-Yates algorithm.
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Return a subset of the shuffled array.
  return shuffledArray.slice(0, subsetSize);
};

exports.fromCamelCaseToWords = (str) =>
  str
    .split(/(?=[A-Z0-9])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/([A-Z]+) /g, '$1');

exports.toRandomCase = (str) =>
  str
    .split('')
    .map((c) => (Math.random() > 0.5 ? c.toLowerCase() : c.toUpperCase()))
    .join('');

exports.normalizeUrl = (url) => {
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

exports.getObjectPropertyCaseInsensitive = (key, obj) => {
  for (const objKey in obj) {
    if (
      obj.hasOwnProperty(objKey) &&
      objKey.toLowerCase() === key.toLowerCase()
    ) {
      return obj[objKey];
    }
  }
};

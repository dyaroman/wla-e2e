exports.getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.fromCamelCaseToWords = (str) => {
  const result = str.replace(/([A-Z\d])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

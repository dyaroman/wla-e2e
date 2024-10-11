const { prepareUrl, getObjectPropertyCaseInsensitive } = require('./functions');

let URL = getObjectPropertyCaseInsensitive('url', process.env);
if (URL === undefined) {
  switch (getObjectPropertyCaseInsensitive('env', process.env)) {
    case 'local':
      URL = 'http://localhost:3000';
      break;
    case 'prod':
      URL = 'https://prod.example-app.com';
      break;
    case 'dev':
    default:
      URL = 'https://dev.example-app.com';
  }
} else {
  URL = prepareUrl(URL);
}
exports.URL = URL;

let DATA_URL = getObjectPropertyCaseInsensitive('data_url', process.env);
if (DATA_URL === undefined) {
  switch (getObjectPropertyCaseInsensitive('env', process.env)) {
    case 'prod':
      DATA_URL = 'https://prod.example-app.com';
      break;
    case 'local':
    case 'dev':
    default:
      DATA_URL = 'https://dev.example-app.com';
  }
} else {
  DATA_URL = prepareUrl(DATA_URL);
}

exports.DATA_URL = DATA_URL;

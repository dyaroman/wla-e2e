const { prepareUrl } = require('./functions');

let URL = process.env.URL;
if (URL === undefined) {
  switch (process.env.ENV) {
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

let DATA_URL = process.env.DATA_URL;
if (process.env.DATA_URL === undefined) {
  switch (process.env.ENV) {
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

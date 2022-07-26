let URL = process.env.url;
if (URL !== undefined) {
  // add protocol if it wasn't passed
  if (/^https?:\/\//.test(URL) === false) {
    URL = `https://${URL}`;
  }
  // remove trailing slash if it was passed
  if (/\/$/.test(URL)) {
    URL = URL.slice(0, -1);
  }
}

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
}

exports.URL = URL;

exports.WEBSITES_DATA = 'websites.data.json';

let URL;

switch (process.env.NODE_ENV) {
  case "local":
    URL = "http://localhost:3000";
    break;
  case "prod":
    URL = "https://prod.example-app.com";
    break;
  case "dev":
  default:
    URL = "https://dev.example-app.com";
}

exports.URL = URL;

let WEBSITES_DATA;

switch (process.env.NODE_ENV) {
  case "prod":
    WEBSITES_DATA = "https://prod.example-app.com/websites.data.json";
    break;
  case "local":
  case "dev":
  default:
    WEBSITES_DATA = "https://dev.example-app.com/websites.data.json";
    break;
}

exports.WEBSITES_DATA = WEBSITES_DATA;

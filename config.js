let URL;

switch (process.env.NODE_ENV) {
  case "local":
    URL = "http://localhost:3000";
    break;
  case "prod":
    break;
  case "dev":
  default:
    URL = "https://dev.example-app.com";
}

exports.URL = URL;

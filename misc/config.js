import { normalizeUrl, getObjectPropertyCaseInsensitive } from "./functions.js";

let configUrl = getObjectPropertyCaseInsensitive("url", process.env);
if (configUrl === undefined) {
  switch (getObjectPropertyCaseInsensitive("env", process.env)) {
    case "local":
      configUrl = "http://localhost:3000";
      break;
    case "prod":
      configUrl = "https://prod.example-app.com";
      break;
    case "dev":
    default:
      configUrl = "https://dev.example-app.com";
  }
}

export const URL = normalizeUrl(configUrl);

let configDataUrl = getObjectPropertyCaseInsensitive("data_url", process.env);
if (configDataUrl === undefined) {
  switch (getObjectPropertyCaseInsensitive("env", process.env)) {
    case "prod":
      configDataUrl = "https://prod.example-app.com";
      break;
    case "local":
    case "dev":
    default:
      configDataUrl = "https://dev.example-app.com";
  }
}

export const DATA_URL = normalizeUrl(configDataUrl);

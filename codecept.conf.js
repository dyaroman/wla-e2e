import { getObjectPropertyCaseInsensitive } from "./misc/functions.js";

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
const headless =
  getObjectPropertyCaseInsensitive("headless", process.env) === "true";

export const config = {
  name: "wla-tests",
  noGlobals: true,
  tests: "./tests/*.test.js",
  output: "./output",
  bootstrap: null,
  mocha: {},
  helpers: {
    Playwright: {
      url: "http://localhost",
      show: !headless,
      browser: "chromium",
      windowSize: "1280x720",
      waitForNavigation: "networkidle",
      uniqueScreenshotNames: true,
    },
    WlaHelper: {
      require: "./helpers/wla-helper.js",
    },
  },
  plugins: {
    screenshot: {
      enabled: true,
    },
    aqaReporter: {
      require: "./helpers/aqa-reporter.mjs",
      enabled: true,
    },
  },
  include: {
    I: "./steps_file.js",
  },
};

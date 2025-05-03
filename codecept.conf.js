const { setHeadlessWhen } = require('@codeceptjs/configure');

const { getObjectPropertyCaseInsensitive } = require('./misc/functions');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(
  getObjectPropertyCaseInsensitive('headless', process.env) === 'true',
);

exports.config = {
  name: 'wla-tests',
  tests: './tests/*.test.js',
  output: './output',
  bootstrap: null,
  mocha: {},
  helpers: {
    Playwright: {
      url: 'http://localhost',
      show: true,
      browser: 'chromium',
      windowSize: '1280x720',
      waitForNavigation: 'networkidle',
      uniqueScreenshotNames: true,
    },
    WlaHelper: {
      require: './helpers/wla-helper',
    },
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
};

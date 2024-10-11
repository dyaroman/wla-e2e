const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

const { getObjectPropertyCaseInsensitive } = require('./misc/functions');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(
  getObjectPropertyCaseInsensitive('headless', process.env) === 'true',
);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

exports.config = {
  tests: './tests/*.test.js',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost',
      show: true,
      browser: 'chromium',
      windowSize: '1920x1080',
      waitForNavigation: 'networkidle',
      uniqueScreenshotNames: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  bootstrap: null,
  mocha: {},
  name: 'wla-tests',
};

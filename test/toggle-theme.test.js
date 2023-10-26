const { URL } = require('../misc/config');
const { rgb2hex, hex2rgb } = require('../misc/color');

Feature('theme toggle button #static #sms');

Scenario('check light theme and toggle to dark', async ({ I }) => {
  I.amOnPage(URL);

  // check light theme
  I.seeAttributesOnElements('body', { 'data-theme': 'light' });
  let bgColor = await I.grabCssPropertyFrom('body', 'background-color');
  if (hex2rgb('#fff') !== bgColor) {
    throw new Error(`body bg color should be '#fff' for light theme`);
  }

  // toggle to dark theme
  I.click('button.theme-toggle');

  // check dark theme
  I.seeAttributesOnElements('body', { 'data-theme': 'dark' });
  bgColor = await I.grabCssPropertyFrom('body', 'background-color');
  if (hex2rgb('#212529') !== bgColor) {
    throw new Error(`body bg color should be '#212529' for dark theme`);
  }
});

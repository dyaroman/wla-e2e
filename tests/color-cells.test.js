const { URL, DATA_URL } = require('../misc/config');
const { NO_DATA, WEBSITES_DATA } = require('../misc/consts');
const { hex2rgb } = require('../misc/color');
const { fromCamelCaseToWords } = require('../misc/functions');

Feature('color cells #static #sms');

Scenario('form theme bg color', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { columns, websites } = await response['json']();
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  // prepare columns
  I.click('.table-controls details summary');
  I.click('button[data-qa="hideAllColumns"]');
  for (const column in columns) {
    if (column !== 'website' && !column.toLowerCase().includes('theme'))
      continue;
    I.click(`.showed-columns label[data-qa="${fromCamelCaseToWords(column)}"]`);
  }

  for (let i = 0; i < websites.length; i++) {
    const websiteData = websites[i];
    const row = `.table tbody tr:nth-child(${i + 1})`;
    for (const key in websiteData) {
      switch (key) {
        case 'mainFormPrimaryColor':
        case 'altFormPrimaryColor':
        case 'mainFormEsPrimaryColor':
          if (websiteData[key] === NO_DATA) continue;
          I.say(`check bg color for ${websiteData['website']} ${key}`);
          const selector = key.replace('PrimaryColor', 'Theme');
          const bgColorRgb = await I.grabCssPropertyFrom(
            `${row} td[data-qa="${selector}"]`,
            'background-color'
          );
          if (bgColorRgb !== hex2rgb(websiteData[key])) {
            throw new Error('background color is wrong, please check');
          }
          break;
        default:
          break;
      }
    }
  }
});

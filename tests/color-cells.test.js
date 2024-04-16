const { URL, DATA_URL } = require('../misc/config');
const { NO_DATA, WEBSITES_DATA } = require('../misc/consts');
const { hex2rgb } = require('../misc/color');
const { fromCamelCaseToWords, getRandomSubset } = require('../misc/functions');

Feature('color cells @static @sms');

Scenario('form theme bg color', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {},
  );
  const { columns, websites } = await response['json']();
  I.amOnPage(`${URL}/?showColumns=none&customizeColumnsOpen=`);
  I.waitForElement('table', 60);

  // prepare columns
  for (const column in columns) {
    if (column !== 'website' && !column.toLowerCase().includes('theme'))
      continue;
    I.click(
      `.customize-columns label[data-qa="${fromCamelCaseToWords(column)}"]`,
    );
  }

  const randomWebsites = getRandomSubset(websites, 10);
  for (const website of randomWebsites) {
    const websiteIndex = websites.findIndex(
      (w) => w['website'] === website['website'],
    );
    const row = `.table tbody tr:nth-child(${websiteIndex + 1})`;
    for (const key in website) {
      switch (key) {
        case 'mainFormPrimaryColor':
        case 'altFormPrimaryColor':
        case 'mainFormEsPrimaryColor':
          if (website[key] === NO_DATA) continue;
          I.say(`check bg color for ${website['website']} ${key}`);
          const selector = key.replace('PrimaryColor', 'Theme');
          const bgColorRgb = await I.grabCssPropertyFrom(
            `${row} td[data-qa="${selector}"]`,
            'background-color',
          );
          if (bgColorRgb !== hex2rgb(website[key])) {
            throw new Error('background color is wrong, please check');
          }
          break;
        default:
          break;
      }
    }
  }
});

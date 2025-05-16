const { URL } = require('../misc/config');
const { NO_DATA, SHOW_COLUMNS } = require('../misc/consts');
const { hex2rgb } = require('../misc/color');
const { getRandomSubset } = require('../misc/functions');

Feature('color cells');

Scenario('should have primary color as a background color', async ({ I }) => {
  const columns = await I.getColumns();
  const websites = (await I.getWebsitesData()).slice(0, 100);

  I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none&perPage=100`);
  I.waitForElement('[data-qa="noColumns"]', 60);
  I.openDrawer('columns');

  // prepare columns
  for (const column in columns) {
    if (column !== 'website' && !column.toLowerCase().includes('theme'))
      continue;
    I.click(`.customize-columns label[data-qa="${column}"]`);
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

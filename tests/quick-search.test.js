const { URL } = require('../misc/config');
const { SHOW_COLUMNS } = require('../misc/consts');
const { getRandomNumber } = require('../misc/functions');

Feature('quick search');

Scenario(
  'should insert value from cell clicked with ALT modifier in appropriate search input',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const randomIndex = getRandomNumber(1, 100);
    const websiteData = websites[randomIndex];

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=website&perPage=100`);
    I.waitForElement('table', 60);
    I.click(
      `.table tr:nth-child(${randomIndex + 1}) td[data-qa='website']`,
      null,
      {
        modifiers: ['Alt'],
      },
    );
    I.seeInField('input[data-qa="website"]', websiteData['website']);
    I.seeInCurrentUrl(`website=${websiteData['website']}`);
  },
);

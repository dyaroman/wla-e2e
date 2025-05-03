const { URL } = require('../misc/config');
const { SHOW_COLUMNS } = require('../misc/consts');

Feature('quick search');

Scenario(
  'should insert value from cell clicked with ALT modifier in appropriate search input',
  async ({ I }) => {
    const [websiteData, index] = await I.getRandomWebsiteData({
      returnIndex: true,
    });

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=website`);
    I.waitForElement('table', 60);
    I.click(`.table tr:nth-child(${index + 1}) td[data-qa='website']`, null, {
      modifiers: ['Alt'],
    });
    I.seeInField('input[data-qa="website"]', websiteData['website']);
    I.seeInCurrentUrl(`website=${websiteData['website']}`);
  },
);

const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA, SHOW_COLUMNS } = require('../misc/consts');
const { getRandomNumber } = require('../misc/functions');

Feature('quick search');

Scenario(
  'should insert value from cell clicked with ALT modifier in appropriate search input',
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { websites } = await response['json']();
    const randomNumber = getRandomNumber(1, websites.length);
    const websiteData = websites[randomNumber - 1];

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=website`);
    I.waitForElement('table', 60);
    I.click(
      `.table tr:nth-child(${randomNumber}) td[data-qa='website']`,
      null,
      {
        modifiers: ['Alt'],
      },
    );
    I.seeInCurrentUrl(`website=${websiteData['website']}`);
    I.seeInField('input[data-qa="website"]', websiteData['website']);
  },
);

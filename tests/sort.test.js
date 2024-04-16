const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA } = require('../misc/consts');

Feature('check sorts @static @sms');

Scenario('desc website sort', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {},
  );
  const { websites } = await response['json']();
  const websiteData = websites[websites.length - 1];

  I.amOnPage(`${URL}/`);
  I.waitForElement('table', 60);

  // asc direction
  I.click('.table thead th[data-qa="website"]');
  I.seeInCurrentUrl('column=website&direction=asc');

  // switch to desc direction
  I.click('.table thead th[data-qa="website"]');
  I.seeInCurrentUrl('column=website&direction=desc');
  I.seeTextEquals(
    websiteData['website'],
    'tbody tr:first-child [data-qa="website"]',
  );
});

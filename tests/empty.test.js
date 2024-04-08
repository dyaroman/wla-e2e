const { URL } = require('../misc/config');

Feature('no data to show @static @sms');

Scenario('not existing website', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  const filtersCollapse = await I.grabAttributeFrom(
    'details.filters',
    'open',
  ).then((attr) => attr === null);
  if (filtersCollapse) {
    I.click('details.filters summary');
  }
  I.fillField('[data-qa="website"]', 'google.com');
  I.seeTextEquals('Websites: 0', '[data-qa="websitesNumber"]');
  I.seeInTitle('[0]');
  I.seeTextEquals(
    'No data to show, please check your filters.',
    '[data-qa="noResults"]',
  );
});

const { URL } = require('../misc/config');

Feature('no data to show @static @sms');

Scenario('not existing website', async ({ I }) => {
  I.amOnPage(`${URL}/?website=google.com`);
  I.seeTextEquals('Websites: 0', '[data-qa="websitesNumber"]');
  I.seeInTitle('[0]');
  I.seeTextEquals(
    'No data to show, please check your filters.',
    '[data-qa="noResults"]',
  );
});

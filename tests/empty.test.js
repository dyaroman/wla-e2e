const { URL } = require('../misc/config');

Feature('no data');

Scenario(
  'should see "no data to show" for non existing website search',
  async ({ I }) => {
    const websites = await I.getWebsitesData();

    I.amOnPage(`${URL}/?website=google.com`);
    I.seeTextEquals(`0/${websites.length}`, '[data-qa="counter"]');
    I.seeInTitle('[0]');
    I.seeTextEquals(
      'No data to show, please check your filters.',
      '[data-qa="noResults"]',
    );
    I.openDrawer('sidebar');
    I.seeTextEquals('Websites: 0', '[data-qa="websitesNumber"]');
  },
);

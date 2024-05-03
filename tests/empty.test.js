const { URL } = require('../misc/config');
const { SIDEBAR_OPEN } = require('../misc/consts');

Feature('no data');

Scenario(
  'should see "no data to show" for non existing website search',
  async ({ I }) => {
    I.amOnPage(`${URL}/?website=google.com&${SIDEBAR_OPEN}=`);
    I.seeTextEquals('Websites: 0', '[data-qa="websitesNumber"]');
    I.seeTextEquals('0', '[data-qa="counter"]');
    I.seeInTitle('[0]');
    I.seeTextEquals(
      'No data to show, please check your filters.',
      '[data-qa="noResults"]',
    );
  },
);

const { URL } = require('../config');

Feature('no data to show #common');

Scenario('not existing website', ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  I.fillField(`[data-qa="website"]`, 'google.com');
  I.seeTextEquals(`Websites: 0`, `[data-qa="websitesNumber"]`);
  I.seeTextEquals(
    `No data to show, please change your filters.`,
    `[data-qa="badFilters"]`
  );
});

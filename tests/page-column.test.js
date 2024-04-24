const { URL } = require('../misc/config');
const { SHOW_COLUMNS } = require('../misc/consts');

Feature('page column');

Scenario('should filter websites by "==sc" page', async ({ I }) => {
  I.amOnPage(`${URL}/?pages=%3D%3Dsc&${SHOW_COLUMNS}=website%2Cpages`);
  I.waitForElement('table', 60);
  const websitesNumberByPageFilter =
    (await I.grabNumberOfVisibleElements('tr')) - 1;
  I.amOnPage(`${URL}/?tags=ocs`);
  const websitesNumberByOcsTag =
    (await I.grabNumberOfVisibleElements('tr')) - 1;
  if (websitesNumberByPageFilter !== websitesNumberByOcsTag) {
    throw new Error(
      `Number of websites filtered by page '==sc' (${websitesNumberByPageFilter}) and filtered by 'ocs' tag (${websitesNumberByOcsTag}) should be equal!`,
    );
  }
});

Scenario('should show none websites by "!=index" page', async ({ I }) => {
  I.amOnPage(`${URL}/?pages=%21%3Dindex`);
  const websitesNumber = await I.grabNumberOfVisibleElements('tr');
  if (websitesNumber !== 0) {
    throw new Error(
      `Number of websites filtered by page '!=index' should be 0, but got ${websitesNumber}!`,
    );
  }
});

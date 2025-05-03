const { URL } = require('../misc/config');

Feature('sorts url parameters');

Scenario(
  'should see "column" and "direction" in url when some column sorted',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websiteData = websites[websites.length - 1];

    I.amOnPage(URL);
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
  },
);

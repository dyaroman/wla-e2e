const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA } = require('../misc/consts');

Feature('links #static #sms');

Scenario('commit link', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { commit, repoPath } = await response['json']();
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  // commit
  if (repoPath && commit) {
    I.seeAttributesOnElements('[data-qa="commit"]', {
      href: `https://dev.azure.com/example-org/${repoPath}/commit/${commit}`,
    });
  }
});

Scenario('websites links', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { websites } = await response['json']();
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  for (let i = 0; i < websites.length; i++) {
    const websiteData = websites[i];
    const row = `.table tbody tr:nth-child(${i + 1})`;
    for (const column in websiteData) {
      if (column !== 'website') continue;
      I.seeAttributesOnElements(`${row} th a`, {
        href: `https://${websiteData['host']}/`,
        target: '_blank',
        rel: 'noreferrer',
      });
    }
  }
});

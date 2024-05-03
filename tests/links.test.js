const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA, SIDEBAR_OPEN } = require('../misc/consts');
const { getRandomSubset } = require('../misc/functions');

Feature('links');

Scenario('should see last commit link and websites links', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {},
  );
  const { commit, repoPath, websites } = await response['json']();
  I.amOnPage(`${URL}/?${SIDEBAR_OPEN}=`);
  I.waitForElement('table', 60);

  // commit
  if (repoPath && commit) {
    I.seeAttributesOnElements('[data-qa="commit"] a', {
      href: `https://dev.azure.com/example-org/${repoPath}/commit/${commit}`,
    });
  }

  // close sidebar
  I.pressKey(['CommandOrControl', '/']);

  const randomWebsites = getRandomSubset(websites, 10);
  for (const website of randomWebsites) {
    const websiteIndex = websites.findIndex(
      (w) => w['website'] === website['website'],
    );
    const row = `.table tbody tr:nth-child(${websiteIndex + 1})`;
    for (const column in website) {
      if (column !== 'website') continue;
      I.seeAttributesOnElements(`${row} [data-qa="website"] a`, {
        href: `https://${website['host']}/`,
        target: '_blank',
        rel: 'noreferrer',
      });
    }
  }
});

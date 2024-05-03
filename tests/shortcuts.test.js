const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA, SHOW_COLUMNS, SIDEBAR_OPEN } = require('../misc/consts');

Feature('shortcuts');

Scenario(
  'should open info modal on "open info modal" shortcut',
  async ({ I }) => {
    I.amOnPage(`${URL}/`);
    I.waitForElement('table', 60);
    I.dontSeeElement('dialog.info-modal');
    I.pressKey(['Shift', '?']);
    I.seeElement('dialog.info-modal');
  },
);

Scenario(
  'should move focus to first search input on "search" shortcut',
  async ({ I }) => {
    I.amOnPage(`${URL}/`);
    I.waitForElement('table', 60);
    I.dontSeeInCurrentUrl(`${SIDEBAR_OPEN}=`);

    I.pressKey(['CommandOrControl', 'Shift', 'F']);
    I.type('cash');
    I.seeInCurrentUrl(SIDEBAR_OPEN);
    I.seeInCurrentUrl(`website=cash`);
    I.seeInField('.filters [data-qa="website"]', 'cash');
  },
);

Scenario(
  'should contains websites list on "copy websites" shortcut',
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { websites } = await response['json']();
    const websitesFromData = websites
      .filter((website) => website['website'].toLowerCase().includes('loan'))
      .map((website) => website['website'])
      .join(',');
    I.restartBrowser({ permissions: ['clipboard-read', 'clipboard-write'] });
    I.amOnPage(`${URL}/?website=loan&${SHOW_COLUMNS}=none`);
    I.waitForElement('table', 60);
    I.pressKey(['CommandOrControl', 'Shift', 'C']);
    const websitesFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    if (websitesFromData !== websitesFromClipboard) {
      throw new Error(
        `Websites from data (${websitesFromData}) and clipboard (${websitesFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

Scenario(
  'should clear filters and sort on "clear all" shortcut',
  async ({ I }) => {
    I.amOnPage(`${URL}/?website=cash&template=sml`);
    I.waitForElement('table', 60);
    I.seeInField('.filters [data-qa="website"]', 'cash');
    I.seeInField('.filters [data-qa="template"]', 'sml');
    I.pressKey(['CommandOrControl', 'Shift', 'E']);
    I.seeInField('.filters [data-qa="website"]', '');
    I.seeInField('.filters [data-qa="template"]', '');
    I.dontSeeInCurrentUrl('website=cash');
    I.dontSeeInCurrentUrl('template=sml');
  },
);

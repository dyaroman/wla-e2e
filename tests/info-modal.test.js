const { URL } = require('../misc/config');
const { SIDEBAR_OPEN } = require('../misc/consts');

Feature('info modal');

Scenario('should open and close by click "i" button', ({ I }) => {
  I.amOnPage(`${URL}/?${SIDEBAR_OPEN}=`);
  I.click('[data-qa="infoModal"]');
  I.seeElement('dialog.info-modal');
  I.seeElement('//h3[text()="Shortcuts:"]');
  I.click('//dialog[@class="info-modal"]//button[text()="close"]');
  I.dontSeeElement('dialog.indo-modal');
});

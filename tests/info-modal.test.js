const { URL } = require('../misc/config');

Feature('info modal @static @sms');

Scenario('should open and close by click "i" button', ({ I }) => {
  I.amOnPage(`${URL}/`);
  I.click('.info-modal-btn');
  I.seeElement('dialog.info-modal');
  I.seeElement('//h3[text()="Shortcuts:"]');
  I.click('//dialog[@class="info-modal"]//button[text()="close"]');
  I.dontSeeElement('dialog.indo-modal');
});

const { URL } = require('../misc/config');

Feature('gtm @static @sms');

Scenario('check key', async ({ I }) => {
  I.amOnPage(`${URL}/`);
  I.seeInSource('https://www.googletagmanager.com/gtm.js');
  I.seeInSource('GTM-XXXXXXXX');
  I.seeInSource('https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXX');
});

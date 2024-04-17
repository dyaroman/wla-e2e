const { URL } = require('../misc/config');

Feature('gtm');

Scenario('should see gtm script and correct key in source', async ({ I }) => {
  I.amOnPage(`${URL}/`);
  I.seeInSource('https://www.googletagmanager.com/gtm.js');
  I.seeInSource('GTM-XXXXXXXX');
  I.seeInSource('https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXX');
});

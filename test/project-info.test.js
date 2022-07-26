const { URL, WEBSITES_DATA } = require('../config');

Feature('project info @sms');

Scenario('check title', async ({ I }) => {
  const response = await I.makeApiRequest('GET', WEBSITES_DATA);
  const { project } = await response.json();
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  if (project === undefined) {
    I.dontSeeInTitle('[sms]');
  } else {
    I.seeInTitle('[sms]');
  }
});

const { URL, WEBSITES_DATA, DATA_URL } = require('../misc/config');

Feature('project info #sms');

Scenario('check title', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { project } = await response.json();
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  if (project === undefined) {
    I.dontSeeInTitle('[sms]');
  } else {
    I.seeInTitle('[sms]');
  }
});

const { URL } = require('../misc/config');

Feature('strict equal search');

Scenario('campaignId: 1 #static', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  const filtersCollapse = await I.grabAttributeFrom(
    'details.filters',
    'open',
  ).then((attr) => attr === null);
  if (filtersCollapse) {
    I.click('details.filters summary');
  }

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('input[data-qa="campaignId"]', '1');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "campaignId": "1"');
  }

  I.fillField('input[data-qa="campaignId"]', '==1');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  I.say(
    JSON.stringify({
      numberOfAll,
      numberOfInclude,
      numberOfEqual,
    }),
  );
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "campaignId": "==1"');
  }
});

Scenario('mainForm: 1q_pd_im #static', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  const filtersCollapse = await I.grabAttributeFrom(
    'details.filters',
    'open',
  ).then((attr) => attr === null);
  if (filtersCollapse) {
    I.click('details.filters summary');
  }

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('input[data-qa="mainForm"]', '1q_pd_im');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "mainForm": "1q_pd_im"');
  }

  I.fillField('input[data-qa="mainForm"]', '==1q_pd_im');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  I.say(
    JSON.stringify({
      numberOfAll,
      numberOfInclude,
      numberOfEqual,
    }),
  );
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "mainForm": "==1q_pd_im"');
  }
});

Scenario('mainForm: 1q #sms', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  const filtersCollapse = await I.grabAttributeFrom(
    'details.filters',
    'open',
  ).then((attr) => attr === null);
  if (filtersCollapse) {
    I.click('details.filters summary');
  }

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('input[data-qa="mainForm"]', '1q_tcpa');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "mainForm": "1q_tcpa"');
  }

  I.fillField('input[data-qa="mainForm"]', '==1q_tcpa');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  I.say(
    JSON.stringify({
      numberOfAll,
      numberOfInclude,
      numberOfEqual,
    }),
  );
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "mainForm": "==1q_tcpa"');
  }
});

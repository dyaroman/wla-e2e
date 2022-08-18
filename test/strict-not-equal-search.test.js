const { URL } = require('../misc/config');

Feature('strict not equal search');

Scenario('campaignId: 1 #static', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('[data-qa="campaignId"]', '1');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "campaignId": "1"');
  }

  I.fillField('[data-qa="campaignId"]', '!=1');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  console.log({
    numberOfAll,
    numberOfInclude,
    numberOfEqual,
  });
  if (numberOfEqual === 0 || numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "campaignId": "!=1"');
  }
});

Scenario('mainForm: 1q_pd_im #static', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('[data-qa="mainForm"]', '1q_pd_im');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "mainForm": "1q_pd_im"');
  }

  I.fillField('[data-qa="mainForm"]', '!=1q_pd_im');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  console.log({
    numberOfAll,
    numberOfInclude,
    numberOfEqual,
  });
  if (numberOfEqual === 0 || numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "mainForm": "!=1q_pd_im"');
  }
});

Scenario('mainForm: 1q #sms', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('[data-qa="mainForm"]', '1q_tcpa_v2');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "mainForm": "1q_tcpa_v2"');
  }

  I.fillField('[data-qa="mainForm"]', '!=1q_tcpa_v2');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  console.log({
    numberOfAll,
    numberOfInclude,
    numberOfEqual,
  });
  if (numberOfEqual === 0 || numberOfEqual === numberOfInclude) {
    throw new Error(
      'Error due to filter websites by "mainForm": "!=1q_tcpa_v2"'
    );
  }
});

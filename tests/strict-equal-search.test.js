const { URL } = require('../misc/config');

Feature('strict == search');

Scenario('campaignId == 1', async ({ I }) => {
  I.amOnPage(`${URL}/?campaignId=1`);
  I.waitForElement('table', 60);
  const numberOfInclude = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str),
  );

  I.amOnPage(`${URL}/?campaignId===1`);
  I.waitForElement('table', 60);
  const numberOfEqual = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str),
  );

  console.log({
    numberOfInclude,
    numberOfEqual,
  });
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "campaignId": "==1"');
  }
});

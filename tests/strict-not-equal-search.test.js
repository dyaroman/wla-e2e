const { URL } = require('../misc/config');

Feature('strict != search');

Scenario('campaignId != 1', async ({ I }) => {
  I.amOnPage(`${URL}/?campaignId=1`);
  I.waitForElement('table', 60);
  const numberOfInclude = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str.split('/')[0]),
  );

  I.amOnPage(`${URL}/?campaignId=!=1`);
  I.waitForElement('table', 60);
  const numberOfNotEqual = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str.split('/')[0]),
  );

  console.log({
    numberOfInclude,
    numberOfNotEqual,
  });
  if (isNaN(numberOfInclude)) {
    throw new Error(`should be number, but got: ${numberOfInclude}`);
  }
  if (isNaN(numberOfNotEqual)) {
    throw new Error(`should be number, but got: ${numberOfNotEqual}`);
  }
  if (numberOfInclude === numberOfNotEqual || numberOfNotEqual === 0) {
    throw new Error('Error due to filter websites by "campaignId": "!=1"');
  }
});

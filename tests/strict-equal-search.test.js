const { URL } = require('../misc/config');

Feature('strict == search');

Scenario('mainForm == 1q_pd_im', async ({ I }) => {
  I.amOnPage(`${URL}/?mainForm=1q_pd_im`);
  I.waitForElement('table', 60);
  const numberOfInclude = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str),
  );

  I.amOnPage(`${URL}/?mainForm===1q_pd_im`);
  I.waitForElement('table', 60);
  const numberOfEqual = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str),
  );

  console.log({
    numberOfInclude,
    numberOfEqual,
  });
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "mainForm": "==1q_pd_im"');
  }
});

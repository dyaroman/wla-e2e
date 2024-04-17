const { URL } = require('../misc/config');
const { FILTERS_OPEN } = require('../misc/consts');

Feature('strict != search');

Scenario('mainForm != 1q_pd_im', async ({ I }) => {
  I.amOnPage(`${URL}/?${FILTERS_OPEN}=`);
  I.waitForElement('table', 60);

  const numberOfAll = await I.grabNumberOfVisibleElements('tbody tr');
  I.fillField('input[data-qa="mainForm"]', '1q_pd_im');
  const numberOfInclude = await I.grabNumberOfVisibleElements('tbody tr');
  if (numberOfInclude === numberOfAll) {
    throw new Error('Error due to filter websites by "mainForm": "1q_pd_im"');
  }

  I.fillField('input[data-qa="mainForm"]', '!=1q_pd_im');
  const numberOfEqual = await I.grabNumberOfVisibleElements('tbody tr');
  I.say(
    JSON.stringify({
      numberOfAll,
      numberOfInclude,
      numberOfEqual,
    }),
  );
  if (numberOfEqual === 0 || numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "mainForm": "!=1q_pd_im"');
  }
});

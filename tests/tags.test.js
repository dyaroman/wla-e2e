const { URL } = require('../misc/config');
const { SIDEBAR_OPEN } = require('../misc/consts');

Feature('tags');

Scenario('should see disabled tags if select "uk" tag', async ({ I }) => {
  I.amOnPage(`${URL}/?${SIDEBAR_OPEN}=`);
  I.waitForElement('table', 60);
  const disabledTagsBefore = await I.grabNumberOfVisibleElements(
    '.filters label.disabled',
  );
  if (disabledTagsBefore > 0) {
    throw new Error(`Disabled tags must be 0, but got ${disabledTagsBefore}`);
  }
  I.click(`.tags label[data-qa='uk']`);
  const disabledTagsAfter = await I.grabNumberOfVisibleElements(
    '.tags label.disabled',
  );
  if (disabledTagsAfter === 0) {
    throw new Error(
      `Disabled tags must be more than 0, but got ${disabledTagsAfter}`,
    );
  }
  console.log({ disabledTagsBefore, disabledTagsAfter });
});

Scenario('should exclude websites that have the "uk" tag', async ({ I }) => {
  I.amOnPage(`${URL}/?${SIDEBAR_OPEN}=`);
  I.waitForElement('table', 60);
  const numberOfAllWebsites = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str),
  );
  // include
  I.click(`.tags label[data-qa='uk']`);
  const numberOfIncludeUkWebsites = await I.grabTextFrom(
    '[data-qa="counter"]',
  ).then((str) => Number(str));
  // exclude
  I.click(`.tags label[data-qa='uk']`);
  const numberOfExcludeUkWebsites = await I.grabTextFrom(
    '[data-qa="counter"]',
  ).then((str) => Number(str));
  console.log({
    numberOfAllWebsites,
    numberOfIncludeUkWebsites,
    numberOfExcludeUkWebsites,
  });
  if (
    numberOfAllWebsites !==
    numberOfIncludeUkWebsites + numberOfExcludeUkWebsites
  ) {
    throw new Error(
      'Number of all websites should be equal to sum of UK and non UK websites',
    );
  }
});

const { URL } = require('../misc/config');
const { FILTERS_OPEN } = require('../misc/consts');

Feature('disabled tags @sms');

Scenario('should see disabled tags if select "uk" tag', async ({ I }) => {
  I.amOnPage(`${URL}/?${FILTERS_OPEN}=`);
  I.waitForElement('table', 60);
  const disabledTagsBefore = await I.grabNumberOfVisibleElements(
    '.filters .checkbox.disabled',
  );
  if (disabledTagsBefore > 0) {
    throw new Error(`Disabled tags must be 0, but got ${disabledTagsBefore}`);
  }
  I.click(`.filters .checkbox[data-qa='uk']`);
  const disabledTagsAfter = await I.grabNumberOfVisibleElements(
    '.filters .checkbox.disabled',
  );
  if (disabledTagsAfter === 0) {
    throw new Error(
      `Disabled tags must be more than 0, but got ${disabledTagsAfter}`,
    );
  }
  console.log({ disabledTagsBefore, disabledTagsAfter });
});

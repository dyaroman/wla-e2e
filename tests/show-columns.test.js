const { URL } = require('../misc/config');
const { SHOW_COLUMNS, SIDEBAR_OPEN } = require('../misc/consts');

Feature('show columns');

Scenario('should show filtered column if it present in url', async ({ I }) => {
  I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none&website=loan&${SIDEBAR_OPEN}=`);
  I.waitForElement('table', 60);
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    if (column === 'website') {
      I.seeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.seeElement(`thead [data-qa="${column}"]`);
    } else {
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.dontSeeElement(`thead [data-qa="${column}"]`);
    }
  }
});

Scenario('should show sorted column if it present in url', async ({ I }) => {
  I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none&column=website&${SIDEBAR_OPEN}=`);
  I.waitForElement('table', 60);
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    if (column === 'website') {
      I.seeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.seeElement(`thead [data-qa="${column}"]`);
    } else {
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.dontSeeElement(`thead [data-qa="${column}"]`);
    }
  }
});

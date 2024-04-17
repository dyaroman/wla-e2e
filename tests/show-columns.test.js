const { URL } = require('../misc/config');
const { SHOW_COLUMNS } = require('../misc/consts');

Feature('show columns @static @sms');

Scenario('should show filtered column if it present in url', async ({ I }) => {
  I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none&customizeColumnsOpen=&website=loan`);
  I.waitForElement('table', 60);
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    if (column === 'Website') {
      I.seeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      I.seeElement(`//table//th[text()='${column}']`);
    } else {
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      I.dontSeeElement(`//table//th[text()='${column}']`);
    }
  }
});

Scenario('should show sorted column if it present in url', async ({ I }) => {
  I.amOnPage(
    `${URL}/?${SHOW_COLUMNS}=none&customizeColumnsOpen=&column=website`,
  );
  I.waitForElement('table', 60);
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    if (column === 'Website') {
      I.seeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      I.seeElement(`//table//th[text()='${column}']`);
    } else {
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      I.dontSeeElement(`//table//th[text()='${column}']`);
    }
  }
});

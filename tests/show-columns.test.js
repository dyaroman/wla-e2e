const { URL } = require('../misc/config');

Feature('show columns @static @sms');

Scenario('show filtered column', async ({ I }) => {
  I.amOnPage(`${URL}/?showColumns=none&customizeColumnsOpen=&website=loan`);
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

Scenario('show sorted column', async ({ I }) => {
  I.amOnPage(`${URL}/?showColumns=none&customizeColumnsOpen=&column=website`);
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

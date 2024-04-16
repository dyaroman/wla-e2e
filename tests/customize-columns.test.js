const { URL } = require('../misc/config');

Feature('customize columns @static @sms');

Scenario('default columns', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    const checked = await I.grabCheckedElementStatus(
      `.checkbox__input[name="${column}"]`,
    );
    if (checked) {
      I.seeElement(`//table//th[text()='${column}']`);
    } else {
      I.dontSeeElement(`//table//th[text()='${column}']`);
    }
  }
});

Scenario('alias "all"', async ({ I }) => {
  I.amOnPage(`${URL}/?showColumns=all`);
  I.waitForElement('table', 60);

  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );

  for (const column of columns) {
    I.seeElement(`//table//th[text()='${column}']`);
  }
});

Scenario('alias "none"', async ({ I }) => {
  I.amOnPage(`${URL}/?showColumns=none`);
  I.waitForElement('table', 60);

  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );

  for (const column of columns) {
    I.dontSeeElement(`//table//th[text()='${column}']`);
  }
});

Scenario('show all columns button', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  I.click('.table-controls summary');
  I.click('[data-qa="showAllColumns"]');
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    I.seeElement(`//table//th[text()='${column}']`);
  }
});

Scenario('hide all columns button', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('table', 60);
  I.click('.table-controls summary');
  I.click('[data-qa="hideAllColumns"]');
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    I.dontSeeElement(`//table//th[text()='${column}']`);
  }
});

Scenario('restore default columns button', async ({ I }) => {
  I.amOnPage(`${URL}/?showColumns=none`);
  I.waitForElement('table', 60);
  const columns = await I.grabAttributeFromAll(
    '.customize-columns .checkbox__input',
    'name',
  );
  for (const column of columns) {
    I.dontSeeElement(`//table//th[text()='${column}']`);
  }
  I.click('.table-controls summary');
  I.click('[data-qa="restoreDefaultColumns"]');
  for (const column of columns) {
    const checked = await I.grabCheckedElementStatus(
      `.checkbox__input[name="${column}"]`,
    );
    if (checked) {
      I.seeElement(`//table//th[text()='${column}']`);
    } else {
      I.dontSeeElement(`//table//th[text()='${column}']`);
    }
  }
});

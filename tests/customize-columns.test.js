const { URL, DATA_URL } = require('../misc/config');
const { WEBSITES_DATA, SHOW_COLUMNS } = require('../misc/consts');
const { fromCamelCaseToWords } = require('../misc/functions');

Feature('customize columns @sms');

Scenario(
  `default columns should be checked, showed and url don't have ${SHOW_COLUMNS} parameter`,
  async ({ I }) => {
    I.amOnPage(`${URL}/`);

    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      if (columns[column]['showColumn']) {
        I.seeCheckboxIsChecked(checkbox);
        I.seeElement(`//th[text()='${columnName}']`);
      } else {
        I.dontSeeCheckboxIsChecked(checkbox);
        I.dontSeeElement(`//th[text()='${columnName}']`);
      }
    }

    I.dontSeeInCurrentUrl(`${SHOW_COLUMNS}=`);
  },
);

Scenario(
  `should show all columns when url parameter ${SHOW_COLUMNS}="all"`,
  async ({ I }) => {
    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=all`);

    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      I.seeCheckboxIsChecked(checkbox);
      I.seeElement(`//th[text()='${columnName}']`);
    }
  },
);

Scenario(
  `should show none columns when url parameter ${SHOW_COLUMNS}="none"`,
  async ({ I }) => {
    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none`);

    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      I.dontSeeCheckboxIsChecked(checkbox);
      I.dontSeeElement(`//th[text()='${columnName}']`);
    }
  },
);

Scenario(
  'should show all columns when "show all columns" button clicked',
  async ({ I }) => {
    I.amOnPage(`${URL}/`);
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    I.click('.table-controls summary');
    I.click('[data-qa="showAllColumns"]');
    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      I.seeCheckboxIsChecked(checkbox);
      I.seeElement(`//th[text()='${columnName}']`);
    }
  },
);

Scenario(
  'should hide all columns when "hide all columns" button clicked',
  async ({ I }) => {
    I.amOnPage(`${URL}/`);
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    I.click('.table-controls summary');
    I.click('[data-qa="hideAllColumns"]');
    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      I.dontSeeCheckboxIsChecked(checkbox);
      I.dontSeeElement(`//th[text()='${columnName}']`);
    }
  },
);

Scenario(
  'should show default columns when "restore default columns" button clicked',
  async ({ I }) => {
    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none`);
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();

    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      I.dontSeeCheckboxIsChecked(checkbox);
      I.dontSeeElement(`//th[text()='${columnName}']`);
    }

    I.click('.table-controls summary');
    I.click('[data-qa="restoreDefaultColumns"]');
    for (const column in columns) {
      // skip columns that can't be rendered
      if (!columns[column]['renderColumn']) continue;

      const columnName = fromCamelCaseToWords(column);
      const checkbox = `.customize-columns .checkbox__input[name='${columnName}']`;
      if (columns[column]['showColumn']) {
        I.seeCheckboxIsChecked(checkbox);
        I.seeElement(`//th[text()='${columnName}']`);
      } else {
        I.dontSeeCheckboxIsChecked(checkbox);
        I.dontSeeElement(`//th[text()='${columnName}']`);
      }
    }
  },
);

import { URL } from "../misc/config.js";
import { SHOW_COLUMNS } from "../misc/consts.js";

Feature("customize columns");

Scenario(
  `default columns should be checked, showed and url don't have ${SHOW_COLUMNS} parameter`,
  async ({ I }) => {
    const columns = await I.getColumns();
    const { website } = await I.getRandomWebsiteData();

    I.amOnPage(`${URL}?website=${website}`);
    I.openDrawer("columns");

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      const checkbox = `.customize-columns .checkbox__input[name='${column.name}']`;
      if (column.showColumn) {
        I.seeCheckboxIsChecked(checkbox);
        // table column
        I.seeElement(`thead [data-qa="${column.name}"]`);
      } else {
        I.dontSeeCheckboxIsChecked(checkbox);
        // table column
        I.dontSeeElement(`thead [data-qa="${column.name}"]`);
      }
    }

    I.dontSeeInCurrentUrl(`${SHOW_COLUMNS}=`);
  },
);

Scenario(
  `should show all columns when url parameter ${SHOW_COLUMNS}="all"`,
  async ({ I }) => {
    const { website } = await I.getRandomWebsiteData();
    const columns = await I.getColumns();

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=all&website=${website}`);
    I.openDrawer("columns");

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      I.seeCheckboxIsChecked(
        `.customize-columns .checkbox__input[name='${column.name}']`,
      );
      // table column
      I.seeElement(`thead [data-qa="${column.name}"]`);
    }
  },
);

Scenario(
  `should show none columns when url parameter ${SHOW_COLUMNS}="none"`,
  async ({ I }) => {
    const columns = await I.getColumns();

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none`);
    I.openDrawer("columns");

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      I.dontSeeCheckboxIsChecked(
        `.customize-columns .checkbox__input[name='${column.name}']`,
      );
      // table column
      I.dontSeeElement(`thead [data-qa="${column.name}"]`);
    }

    I.seeTextEquals(
      "No columns to show, please check customize columns.",
      '[data-qa="noColumns"]',
    );
  },
);

Scenario(
  'should show all columns when "show all columns" button clicked',
  async ({ I }) => {
    const columns = await I.getColumns();
    const { website } = await I.getRandomWebsiteData();

    I.amOnPage(`${URL}?website=${website}`);
    I.openDrawer("columns");
    I.click('[data-qa="showAllColumns"]');

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      I.seeCheckboxIsChecked(
        `.customize-columns .checkbox__input[name='${column.name}']`,
      );
      // table column
      I.seeElement(`thead [data-qa="${column.name}"]`);
    }
  },
);

Scenario(
  'should hide all columns when "hide all columns" button clicked',
  async ({ I }) => {
    const columns = await I.getColumns();
    const { website } = await I.getRandomWebsiteData();

    I.amOnPage(`${URL}?website=${website}`);
    I.openDrawer("columns");
    I.click('[data-qa="hideAllColumns"]');

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      I.dontSeeCheckboxIsChecked(
        `.customize-columns .checkbox__input[name='${column.name}']`,
      );
      // table column
      I.dontSeeElement(`thead [data-qa="${column.name}"]`);
    }
  },
);

Scenario(
  'should show default columns when "restore default columns" button clicked',
  async ({ I }) => {
    const columns = await I.getColumns();

    I.amOnPage(`${URL}/?${SHOW_COLUMNS}=none`);
    I.openDrawer("columns");

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      I.dontSeeCheckboxIsChecked(
        `.customize-columns .checkbox__input[name='${column.name}']`,
      );
      // table column
      I.dontSeeElement(`thead [data-qa="${column.name}"]`);
    }

    I.click('[data-qa="restoreDefaultColumns"]');

    for (const column of columns) {
      // skip columns that can't be rendered
      if (!column.renderColumn) continue;

      const checkbox = `.customize-columns .checkbox__input[name='${column.name}']`;
      if (column.showColumn) {
        I.seeCheckboxIsChecked(checkbox);
        // table column
        I.seeElement(`thead [data-qa="${column.name}"]`);
      } else {
        I.dontSeeCheckboxIsChecked(checkbox);
        // table column
        I.dontSeeElement(`thead [data-qa="${column.name}"]`);
      }
    }
  },
);

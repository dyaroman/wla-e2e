import { fromCamelCaseToWords, getRandomNumber } from "../misc/functions.js";
import { URL } from "../misc/config.js";

Feature("check texts");

Scenario("should render correct texts", async ({ I }) => {
  const { commit, env, repoPath, timestamp } = await I.getWlaData();
  const websites = await I.getWebsitesData();
  I.amOnPage(`${URL}?perPage=100`);
  I.waitForElement("table", 60);

  // InfoComponent
  // page title
  let title = `[${websites.length}]`;
  if (env) {
    title += `[${env}]`;
  }
  title += ": WLA";
  I.seeTitleEquals(title);

  // open sidebar
  I.openDrawer("sidebar");
  I.seeTextEquals("copy websites", 'button[data-qa="copyWebsites"]');

  // env
  if (env) {
    I.seeTextEquals(`Environment: ${env}`, '[data-qa="env"]');
  } else {
    I.dontSeeElement('[data-qa="env"]');
  }

  // commit
  if (repoPath && commit) {
    I.seeTextEquals(commit.slice(0, 8), '[data-qa="commit"] a');
  } else {
    I.dontSeeElement('[data-qa="commit"]');
  }

  // timestamp
  if (timestamp) {
    I.seeTextEquals(`Data last updated: ${timestamp}`, '[data-qa="timestamp"]');
  } else {
    I.dontSeeElement('[data-qa="timestamp"]');
  }

  // websites number
  if (websites.length === 1) {
    I.seeTextEquals(
      `Website: ${websites.length}`,
      '[data-qa="websitesNumber"]',
    );
  } else {
    I.seeTextEquals(
      `Websites: ${websites.length}`,
      '[data-qa="websitesNumber"]',
    );
  }

  // FiltersComponent
  I.openDrawer("filters");
  // Filters
  I.seeTextEquals("Filters", ".drawer__title");
  I.seeTextEquals("reset filters", 'button[data-qa="resetFilters"]');
  // check filter label and placeholder
  const columns = await I.getColumns();
  for (const column of columns) {
    // take only columns that render filter
    if (!column.renderFilter) continue;
    switch (column.name) {
      case "tags":
        break;
      default:
        I.seeTextEquals(
          fromCamelCaseToWords(column.name),
          `label:has(input[data-qa="${column.name}"]) > span.filter__title-text`,
        );
        I.seeAttributesOnElements(`input[data-qa="${column.name}"]`, {
          placeholder: fromCamelCaseToWords(column.name),
        });
    }
  }

  // Tags
  I.openDrawer("tags");
  I.seeTextEquals("Tags", ".drawer__title");
  const tags = [];
  websites.forEach((website) =>
    website.tags.forEach((tag) => tags.includes(tag) || tags.push(tag)),
  );
  tags.forEach((tag) => {
    I.seeTextEquals(tag, `.tags label[data-qa='${tag}'] span[class*="label"]`);
  });

  // TableControlsComponent
  // Customize columns
  I.openDrawer("columns");
  I.seeTextEquals("Customize columns", ".drawer__title");
  const showedColumns = [];
  for (const column of columns) {
    column.showColumn && showedColumns.push(column.name);
  }
  for (const column of columns) {
    if (!column.renderColumn) continue;
    const label = `.customize-columns label[data-qa='${column.name}']`;
    I.seeTextEquals(
      fromCamelCaseToWords(column.name),
      `${label} span.checkbox__label`,
    );
    if (showedColumns.includes(column.name)) {
      I.seeCheckboxIsChecked(`${label} input.checkbox__input`);
    } else {
      I.dontSeeCheckboxIsChecked(`${label} input.checkbox__input`);
    }
  }

  // Controls
  I.seeTextEquals(
    "hide all",
    '.table-controls button[data-qa="hideAllColumns"]',
  );
  I.seeTextEquals(
    "restore default",
    '.table-controls button[data-qa="restoreDefaultColumns"]',
  );

  // TableComponent
  // Table Head
  I.click('[data-qa="showAllColumns"]');
  for (const column of columns) {
    if (!column.renderColumn) continue;
    let title;
    switch (column.name) {
      case "index":
        title = "#";
        break;
      case "checkbox":
        title = "";
        break;
      default:
        title = fromCamelCaseToWords(column.name);
        break;
    }
    I.seeTextEquals(title, `.table thead th[data-qa="${column.name}"]`);
  }

  // Table Body
  const websiteIndex = getRandomNumber(1, 100);
  const website = websites[websiteIndex];
  I.say(`check texts for ${website["website"]}`);
  for (const column of columns) {
    if (!column.renderColumn) continue;
    const row = `.table tbody tr:nth-child(${websiteIndex + 1})`;
    switch (column.name) {
      case "tags":
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        Array.isArray(website[column.name]) &&
          website[column.name].forEach((tag) =>
            I.seeTextEquals(tag, `${row} [data-qa='${tag}']`),
          );
        break;

      case "ogImage":
      case "favicon":
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        Array.isArray(website[column.name]) &&
          website[column.name].forEach((path) =>
            I.seeElementInDOM(`img[src="https://${website["host"]}/${path}"]`),
          );
        break;

      case "pages":
        for (const page of website[column.name]) {
          I.see(page, `${row} [data-qa='${column.name}']`);
        }
        break;

      case "forms":
        for (const form of Object.keys(website[column.name])) {
          I.see(form, `${row} [data-qa='${column.name}']`);
        }
        break;

      case "checkbox":
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        break;

      case "index":
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        I.seeTextEquals(
          String(websiteIndex + 1),
          `${row} [data-qa='${column.name}']`,
        );
        break;

      case "ocsDefaultRedirect":
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        I.seeTextEquals(
          String(website[column.name])
            .replace(/https?:\/\//, "")
            .replace("/", ""),
          `${row} [data-qa='${column.name}']`,
        );
        break;

      default:
        I.seeAttributesOnElements(`${row} [data-qa='${column.name}']`, {
          "data-title": fromCamelCaseToWords(column.name),
        });
        I.seeTextEquals(
          String(website[column.name]),
          `${row} [data-qa='${column.name}']`,
        );
        break;
    }
  }
});

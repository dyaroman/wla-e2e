const { fromCamelCaseToWords, getRandomSubset } = require('../misc/functions');
const { URL, DATA_URL } = require('../misc/config');
const {
  WEBSITES_DATA,
  CUSTOMIZE_COLUMNS_OPEN,
  FILTERS_OPEN,
} = require('../misc/consts');

Feature('check texts');

Scenario('should render correct texts', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {},
  );
  const { columns, commit, env, project, repoPath, timestamp, websites } =
    await response['json']();
  I.amOnPage(`${URL}/?${FILTERS_OPEN}=&${CUSTOMIZE_COLUMNS_OPEN}=`);
  I.waitForElement('table', 60);

  // InfoComponent
  // page title
  let title = `[${websites.length}]`;
  if (project) {
    title += `[${project}]`;
  }
  if (env) {
    title += `[${env}]`;
  }
  title += ': Websites List App';
  I.seeTitleEquals(title);

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
  // Filters
  I.seeTextEquals('Filters:', '.filters > summary');
  // check filter label and placeholder
  for (const column of Object.keys(columns)) {
    // take only columns that render filter
    if (!columns[column]['renderFilter']) continue;
    switch (column) {
      case 'tags':
        I.seeTextEquals('Tags:', '.filters details summary');
        break;
      default:
        I.seeElement(
          `//details[@class='filters']//span[text()='${fromCamelCaseToWords(
            column,
          )}']`,
        );
        I.seeAttributesOnElements(`input[data-qa="${column}"]`, {
          placeholder: fromCamelCaseToWords(column),
        });
    }
  }

  // Tags
  const tags = [];
  websites.forEach((website) =>
    website.tags.forEach((tag) => tags.includes(tag) || tags.push(tag)),
  );
  tags.forEach((tag) => {
    I.seeTextEquals(
      tag,
      `.filters label[data-qa='${tag}'] span.checkbox__label`,
    );
  });

  // Filters controls
  I.seeTextEquals('clear all', 'button[data-qa="clearAll"]');
  I.seeTextEquals('copy websites', 'button[data-qa="copyWebsites"]');

  // TableControlsComponent
  // Customize columns
  I.seeTextEquals('Customize columns:', '.table-controls details summary');
  const showedColumns = [];
  for (const column in columns) {
    columns[column]['showColumn'] && showedColumns.push(column);
  }
  for (const column in columns) {
    if (!columns[column]['renderColumn']) continue;
    const label = `.customize-columns label[data-qa='${column}']`;
    I.seeTextEquals(
      fromCamelCaseToWords(column),
      `${label} span.checkbox__label`,
    );
    if (showedColumns.includes(column)) {
      I.seeCheckboxIsChecked(`${label} input.checkbox__input`);
    } else {
      I.dontSeeCheckboxIsChecked(`${label} input.checkbox__input`);
    }
  }

  // Controls
  I.seeTextEquals(
    'hide all columns',
    '.table-controls button[data-qa="hideAllColumns"]',
  );
  I.seeTextEquals(
    'restore default columns',
    '.table-controls button[data-qa="restoreDefaultColumns"]',
  );

  // TableComponent
  // Table Head
  I.click('[data-qa="showAllColumns"]');
  for (const column in columns) {
    if (!columns[column]['renderColumn']) continue;
    let title;
    switch (column) {
      case 'index':
        title = '#';
        break;
      case 'checkbox':
        title = '';
        break;
      default:
        title = fromCamelCaseToWords(column);
        break;
    }
    I.seeTextEquals(title, `.table thead th[data-qa="${column}"]`);
  }

  // Table Body
  const randomWebsites = getRandomSubset(websites, 5);
  for (const website of randomWebsites) {
    const websiteIndex =
      websites.findIndex((w) => w['website'] === website['website']) + 1;
    I.say(`check texts for ${website['website']}`);
    for (const column in columns) {
      if (!columns[column]['renderColumn']) continue;
      const row = `.table tbody tr:nth-child(${websiteIndex})`;
      switch (column) {
        case 'tags':
          I.seeAttributesOnElements(`${row} [data-qa='${column}']`, {
            'data-title': fromCamelCaseToWords(column),
          });
          Array.isArray(website[column]) &&
            website[column].forEach((tag) =>
              I.seeTextEquals(tag, `${row} [data-qa='${tag}']`),
            );
          break;

        case 'ogImage':
          I.seeAttributesOnElements(`${row} [data-qa='${column}']`, {
            'data-title': fromCamelCaseToWords(column),
          });
          Array.isArray(website[column]) &&
            website[column].forEach((path) =>
              I.seeElementInDOM(
                `img[src="https://${website['host']}/${path}"]`,
              ),
            );
          break;

        case 'pages':
          for (const page of website[column]) {
            I.see(page, `${row} [data-qa='${column}']`);
          }
          break;

        case 'checkbox':
          I.seeAttributesOnElements(`${row} [data-qa='${column}']`, {
            'data-title': fromCamelCaseToWords(column),
          });
          break;

        case 'index':
          I.seeAttributesOnElements(`${row} [data-qa='${column}']`, {
            'data-title': fromCamelCaseToWords(column),
          });
          I.seeTextEquals(String(websiteIndex), `${row} [data-qa='${column}']`);
          break;

        default:
          I.seeAttributesOnElements(`${row} [data-qa='${column}']`, {
            'data-title': fromCamelCaseToWords(column),
          });
          I.seeTextEquals(
            String(website[column]),
            `${row} [data-qa='${column}']`,
          );
          break;
      }
    }
  }
});

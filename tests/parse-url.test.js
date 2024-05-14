const { URL, DATA_URL } = require('../misc/config');
const { getRandomNumber, toRandomCase } = require('../misc/functions');
const { WEBSITES_DATA, SIDEBAR_OPEN, SHOW_COLUMNS } = require('../misc/consts');

Feature('parse url');

Scenario(
  'should sort "website" column by "desc" direction from url parameters',
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { websites } = await response['json']();
    const websiteData = websites[websites.length - 1];
    const sorts = {
      column: 'website',
      direction: 'desc',
    };

    const search = new URLSearchParams();
    for (const key in sorts) {
      search.set(key, sorts[key]);
    }

    I.amOnPage(`${URL}/?${search}`);
    I.waitForElement('table', 60);
    I.seeTextEquals(
      websiteData['website'],
      'tbody tr:first-child [data-qa="website"]',
    );
  },
);

Scenario('should read filters from url case insensitive', async ({ I }) => {
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {},
  );
  const { columns, websites } = await response['json']();
  const randomNumber = getRandomNumber(0, websites.length - 1);
  const websiteData = websites[randomNumber];
  const filters = [];
  for (const column in columns) {
    if (!columns[column]['renderFilter']) continue;
    filters.push([column, toRandomCase(column), websiteData[column]]);
  }
  I.amOnPage(
    `${URL}/?${filters
      .map((filter) =>
        filter
          .slice(1)
          .map((e) => {
            if (typeof e === 'string' && e.includes('#'))
              return e.replace('#', encodeURIComponent('#'));
            return e;
          })
          .join('='),
      )
      .join('&')}`,
  );
  I.waitForElement('[data-qa="app"]', 60);

  for (const [correctCase, incorrectCase] of filters) {
    I.seeInCurrentUrl(`${correctCase}=`);
    if (correctCase !== incorrectCase) {
      I.dontSeeInCurrentUrl(`${incorrectCase}=`);
    }
  }
});

Scenario(
  'should read sort parameters from url case insensitive',
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { websites } = await response['json']();
    const websiteData = websites[websites.length - 1];
    const sorts = {
      [toRandomCase('column')]: toRandomCase('website'),
      [toRandomCase('direction')]: toRandomCase('desc'),
    };

    const search = new URLSearchParams();
    for (const key in sorts) {
      search.set(key, sorts[key]);
    }

    I.amOnPage(`${URL}/?${search}`);
    I.waitForElement('table', 60);
    I.seeTextEquals(
      websiteData['website'],
      'tbody tr:first-child [data-qa="website"]',
    );
  },
);

Scenario(
  'should show one website for url with filters by this website data and erase url when "clear all" clicked',
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { websites, columns } = await response['json']();
    const randomNumber = getRandomNumber(0, websites.length - 1);
    const websiteData = websites[randomNumber];
    const randomPage =
      websiteData['pages'][getRandomNumber(0, websiteData['pages'].length - 1)];
    await I.say(
      `Run test for website #${randomNumber} ${websiteData['website']}`,
    );

    // prepare searchParams
    const search = new URLSearchParams();
    for (const key in websiteData) {
      if (!columns[key]['renderFilter']) continue;
      switch (key) {
        case 'tags':
          if (websiteData[key].length > 0) {
            search.set(key, websiteData[key].join());
          }
          break;

        case 'pages':
          search.set(key, randomPage);
          break;

        default:
          search.set(key, websiteData[key]);
      }
    }

    I.amOnPage(`${URL}/?${search}&${SIDEBAR_OPEN}=`);
    I.waitForElement('table', 60);
    I.seeTextEquals('Website: 1', '[data-qa="websitesNumber"]');
    I.seeInTitle('[1]');
    I.seeNumberOfVisibleElements('tbody tr', 1);

    // check that data from URL searchParams equal to data from file
    for (const key in websiteData) {
      if (!columns[key]['renderFilter']) continue;
      switch (key) {
        case 'tags':
          I.seeNumberOfVisibleElements(
            '.table .tags li',
            websiteData['tags'].length,
          );
          break;

        case 'pages':
          I.seeInField(`[data-qa="${key}"]`, randomPage);
          break;

        default:
          I.seeInField(`[data-qa="${key}"]`, websiteData[key]);
      }
    }

    // clear all filters and sorts
    I.click('[data-qa="clearAll"]');
    I.seeInCurrentUrl(URL);

    // check that field are empty
    for (const key in websiteData) {
      if (!columns[key]['renderFilter']) continue;
      switch (key) {
        case 'tags':
          I.dontSeeElement('[data-tag-active]');
          break;
        default:
          I.seeInField(`[data-qa="${key}"]`, '');
      }
    }
  },
);

Scenario(
  'should show opened sidebar when "sidebarOpen" parameter in url',
  ({ I }) => {
    I.amOnPage(`${URL}/?${toRandomCase(SIDEBAR_OPEN)}=`);
    I.seeElement('.filters');
  },
);

Scenario(
  `should read ${SHOW_COLUMNS} parameter from url case insensitive`,
  async ({ I }) => {
    const response = await I.makeApiRequest(
      'GET',
      `${DATA_URL}/${WEBSITES_DATA}`,
      {},
    );
    const { columns } = await response['json']();
    I.amOnPage(`${URL}/?${toRandomCase(SHOW_COLUMNS)}=none`);
    I.waitForElement('[data-qa="noColumns"]', 60);
    for (const column in columns) {
      if (!columns[column]['renderFilter']) continue;
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.dontSeeElement(`thead [data-qa="${column}"]`);
    }
  },
);

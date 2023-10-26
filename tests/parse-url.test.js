const { URL, DATA_URL } = require('../misc/config');
const { getRandomNumber } = require('../misc/functions');
const { WEBSITES_DATA } = require('../misc/consts');

Feature('parse url #static #sms');

Scenario('sorts', async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { websites } = await response['json']();
  const websiteData = websites[websites.length - 1];
  const sorts = {
    column: 'website',
    direction: 'desc',
  };

  for (const key in sorts) {
    search.set(key, sorts[key]);
  }

  I.amOnPage(`${URL}/?${search}`);
  I.waitForElement('table', 60);
  I.seeTextEquals(
    websiteData['website'],
    'tbody tr:first-child [data-qa="website"]'
  );
});

Scenario('filters', async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest(
    'GET',
    `${DATA_URL}/${WEBSITES_DATA}`,
    {}
  );
  const { websites, columns } = await response['json']();
  const numberOfWebsites = websites.length;
  const randomNumber = getRandomNumber(0, numberOfWebsites - 1);
  const websiteData = websites[randomNumber];
  await I.say(
    `Run test for website #${randomNumber} ${websiteData['website']}`
  );

  // prepare searchParams
  for (const key in websiteData) {
    if (!columns[key]['renderFilter']) continue;
    switch (key) {
      case 'tags':
        if (websiteData[key].length > 0) {
          search.set(key, websiteData[key].join());
        }
        break;
      default:
        search.set(key, websiteData[key]);
    }
  }

  I.amOnPage(`${URL}/?${search}`);
  I.waitForElement('table', 60);

  I.seeTextEquals('Website: 1', '[data-qa="websitesNumber"]');
  I.seeNumberOfVisibleElements('tbody tr', 1);

  // check that data from URL searchParams equal to data from file
  for (const key in websiteData) {
    if (!columns[key]['renderFilter']) continue;
    switch (key) {
      case 'tags':
        I.seeNumberOfVisibleElements(
          '.filters .tags li',
          websiteData['tags'].length
        );
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
});

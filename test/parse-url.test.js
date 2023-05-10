const { URL, WEBSITES_DATA } = require('../misc/config');
const { getRandomNumber, fromCamelCaseToWords } = require('../misc/functions');
const { NO_DATA } = require('../misc/consts');
const { rgb2hex } = require('../misc/color');

Feature('parse url #static #sms');

Scenario('filters', async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest('GET', `${URL}/${WEBSITES_DATA}`, {});
  const { websites } = await response.json();
  const numberOfWebsites = websites.length;
  const randomNumber = getRandomNumber(0, numberOfWebsites - 1);
  const websiteData = websites[randomNumber];
  await I.say(
    `Run test for website #${randomNumber} ${websiteData['website']}`
  );

  for (const key in websiteData) {
    switch (key) {
      case 'tags':
        if (websiteData[key].length > 0) {
          search.set(key, websiteData[key].join());
        }
        break;
      case 'host':
      case 'mainFormPrimaryColor':
      case 'altFormPrimaryColor':
      case 'mainFormEsPrimaryColor':
        break;
      default:
        search.set(key, websiteData[key]);
    }
  }

  I.amOnPage(`${URL}/?${search}`);
  I.waitForElement('table', 60);

  for (const key in websiteData) {
    switch (key) {
      case 'website':
        I.seeAttributesOnElements(`tbody [data-qa="${key}"]`, {
          'data-title': fromCamelCaseToWords(key),
        });
        I.seeAttributesOnElements(`tbody [data-qa="${key}"] a`, {
          href: `https://${websiteData['host']}/`,
          target: '_blank',
          rel: 'noreferrer',
        });
        I.seeTextEquals(websiteData[key], `tbody [data-qa="${key}"] a`);
        break;
      case 'tags':
        I.seeAttributesOnElements(`tbody [data-qa="${key}"]`, {
          'data-title': fromCamelCaseToWords(key),
        });
        break;
      case 'host':
        break;
      case 'mainFormPrimaryColor':
      case 'altFormPrimaryColor':
      case 'mainFormEsPrimaryColor':
        if (websiteData[key] === NO_DATA) return;
        const selector = key.replace('PrimaryColor', 'Theme');
        const bgColorRgb = await I.grabCssPropertyFrom(
          `td[data-qa="${selector}"]`,
          'background-color'
        );
        const bgColor = rgb2hex(
          bgColorRgb.replace('rgb(', '').replace(')', '').split(', ')
        );
        if (bgColor.toLowerCase() !== websiteData[key].toLowerCase()) {
          throw new Error('background color is wrong, please check');
        }
        break;
      default:
        I.seeAttributesOnElements(`tbody [data-qa="${key}"]`, {
          'data-title': fromCamelCaseToWords(key),
        });
        I.seeTextEquals(String(websiteData[key]), `tbody [data-qa="${key}"]`);
    }
  }

  I.seeAttributesOnElements('[data-qa="#"]', {
    'data-title': '#',
  });
  I.click('[data-qa="clearAll"]');
  I.seeInCurrentUrl(URL);

  for (const key in websiteData) {
    switch (key) {
      case 'tags':
        I.dontSeeElement('[data-tag-active]');
        break;
      case 'host':
        I.seeNumberOfVisibleElements(
          `a[href="https://${websiteData[key]}"]`,
          1
        );
        break;
      case 'mainFormPrimaryColor':
      case 'altFormPrimaryColor':
      case 'mainFormEsPrimaryColor':
        break;
      default:
        I.seeInField(`[data-qa="${key}"]`, '');
    }
  }
});

Scenario('sorts', async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest('GET', `${URL}/${WEBSITES_DATA}`, {});
  const { websites } = await response.json();
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

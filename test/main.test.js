const { getRandomNumber, fromCamelCaseToWords } = require('../misc/functions');
const { URL, WEBSITES_DATA } = require('../misc/config');
const { NO_DATA } = require('../misc/consts');
const { rgb2hex } = require('../misc/color');

Feature('main #static #sms');

Scenario('random website', async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest('GET', `${URL}/${WEBSITES_DATA}`, {});
  const { env, columns, commit, repoPath, timestamp, websites } =
    await response.json();
  const numberOfWebsites = websites.length;
  const randomNumber = getRandomNumber(0, numberOfWebsites - 1);
  const websiteData = websites[randomNumber];
  await I.say(
    `Run test for website #${randomNumber} ${websiteData['website']}`
  );
  I.amOnPage(URL);
  I.waitForElement('table', 60);

  if (env === undefined) {
    I.seeInTitle('Websites List App');
    I.dontSeeElement('[data-qa="env"]');
  } else {
    I.seeInTitle(`[${env}]: Websites List App`);
    I.seeTextEquals(`env: ${env}`, '[data-qa="env"]');
  }

  if (timestamp === undefined) {
    I.dontSeeElement('[data-qa="timestamp"]');
  } else {
    I.seeTextEquals(`Data last updated: ${timestamp}`, '[data-qa="timestamp"]');
  }

  if (repoPath === undefined || commit === undefined) {
    I.dontSeeElement('[data-qa="commit"]');
  } else {
    I.seeAttributesOnElements('[data-qa="commit"]', {
      href: `https://dev.azure.com/example-org/${repoPath}/commit/${commit}`,
    });
    I.seeTextEquals(commit.slice(0, 8), '[data-qa="commit"]');
  }

  if (numberOfWebsites === 1) {
    I.seeTextEquals(
      `Website: ${numberOfWebsites}`,
      '[data-qa="websitesNumber"]'
    );
  } else {
    I.seeTextEquals(
      `Websites: ${numberOfWebsites}`,
      '[data-qa="websitesNumber"]'
    );
  }

  I.seeNumberOfVisibleElements('.field-title', columns.length);
  for (const column of columns) {
    switch (column) {
      case 'tags':
        I.seeElement('.field-title .tags');
        break;
      default:
        I.seeElement(`input[data-qa="${column}"]`);
        I.seeAttributesOnElements(`input[data-qa="${column}"]`, {
          type: 'text',
          placeholder: fromCamelCaseToWords(column),
        });
    }
  }

  for (const key in websiteData) {
    switch (key) {
      case 'tags':
        if (websiteData[key].length > 0) {
          search.set(key, websiteData[key].join());
        }
        for (const tag of websiteData[key]) {
          I.click(`.filters [data-qa="${tag}"]`);
        }
        break;
      case 'host':
        I.seeNumberOfVisibleElements(
          `a[href="https://${websiteData[key]}"]`,
          1
        );
        break;
      case 'mainFormPrimaryColor':
      case 'altFormPrimaryColor':
        break;
      default:
        if (websiteData[key] !== '') {
          search.set(key, websiteData[key]);
          I.fillField(`[data-qa="${key}"]`, websiteData[key]);
        }
    }
  }

  I.seeCurrentUrlEquals(`${URL}/?${search}`);
  I.seeAttributesOnElements('[data-qa="#"]', {
    'data-title': '#',
  });

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
        if (websiteData[key] === NO_DATA) return;
        const selector =
          key === 'mainFormPrimaryColor' ? 'mainFormTheme' : 'altFormTheme';
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
        break;
      default:
        I.seeInField(`[data-qa="${key}"]`, '');
    }
  }
});

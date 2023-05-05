const { URL } = require('../misc/config');
const { NO_DATA } = require('../misc/consts');

const isProd = process.env.ENV === 'prod';

Feature('saved data #static');

const websites = {
  'bad-credit-loans.co': {
    website: 'bad-credit-loans.co',
    template: 'BCL',
    campaignId: 251583,
    mainForm: '1q_pd_im',
    mainFormTheme: 'theme2',
    mainLeadType: 19,
    altForm: '1q_36',
    altFormTheme: 'theme2',
    altLeadType: 57,
    owner: 'Christian',
    gtmKey: 'GTM-TNP7LR',
    companyName: 'Customer Acquisition LLC',
    email: 'support@bad-credit-loans.co',
    emailLegal: 'legal@bad-credit-loans.co',
    effectiveDate: 'July 1, 2020',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    tags: ['index btn'],
    host: isProd ? 'bad-credit-loans.co' : 'bad-credit-loans_co.example-app.com',
    mainFormPrimaryColor: '#FE6645',
    altFormPrimaryColor: '#FE6645',
  },
  'WhiteRockLoans.com': {
    website: 'WhiteRockLoans.com',
    template: 'WRL',
    campaignId: 241355,
    mainForm: '1q_pd_im',
    mainFormTheme: NO_DATA,
    mainLeadType: 19,
    altForm: '1q_36',
    altFormTheme: NO_DATA,
    altLeadType: 57,
    owner: 'Brian',
    gtmKey: 'GTM-TNP7LR',
    companyName: 'Customer Acquisition LLC',
    email: 'support@WhiteRockLoans.com',
    emailLegal: 'legal@WhiteRockLoans.com',
    effectiveDate: 'July 1, 2020',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    tags: ['fixed header', 'index main form', 'ocs', 'unsubscribe'],
    host: isProd ? 'whiterockloans.com' : 'whiterockloans_com.example-app.com',
    mainFormPrimaryColor: 'no_data',
    altFormPrimaryColor: 'no_data',
  },
};

for (const website in websites) {
  Scenario(website, async ({ I }) => {
    const data = websites[website];
    I.amOnPage(URL);
    I.waitForElement('table', 60);
    for (const key in data) {
      switch (key) {
        case 'tags':
          for (const tag of data[key]) {
            I.click(`.filters [data-qa="${tag}"]`);
          }
          break;
        case 'host':
        case 'mainFormPrimaryColor':
        case 'altFormPrimaryColor':
          break;
        default:
          I.fillField(`[data-qa="${key}"]`, data[key]);
          break;
      }
    }
    I.seeTextEquals('Website: 1', '[data-qa="websitesNumber"]');
    I.seeNumberOfVisibleElements('tbody tr', 1);
  });
}

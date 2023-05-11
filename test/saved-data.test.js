const { URL } = require('../misc/config');
const { NO_DATA } = require('../misc/consts');

const isProd = process.env.ENV === 'prod';

Feature('saved data #static');

const websites = {
  'bad-credit-loans.co': {
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    altForm: '1q_36',
    altFormLeadType: 57,
    altFormPrimaryColor: '#FE6645',
    altFormTheme: 'theme2',
    campaignId: 251583,
    companyName: 'Customer Acquisition LLC',
    effectiveDate: 'July 1, 2020',
    email: 'support@bad-credit-loans.co',
    emailLegal: 'legal@bad-credit-loans.co',
    gtmKey: 'GTM-TNP7LR',
    host: isProd ? 'bad-credit-loans.co' : 'bad-credit-loans_co.example-app.com',
    mainForm: '1q_pd_im',
    mainFormLeadType: 19,
    mainFormPrimaryColor: '#FE6645',
    mainFormTheme: 'theme2',
    owner: 'Christian',
    tags: ['index btn'],
    template: 'BCL',
    website: 'bad-credit-loans.co',
  },
  'WhiteRockLoans.com': {
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    altForm: '1q_36',
    altFormLeadType: 57,
    altFormPrimaryColor: 'no_data',
    altFormTheme: NO_DATA,
    campaignId: 241355,
    companyName: 'Customer Acquisition LLC',
    effectiveDate: 'July 1, 2020',
    email: 'support@WhiteRockLoans.com',
    emailLegal: 'legal@WhiteRockLoans.com',
    gtmKey: 'GTM-TNP7LR',
    host: isProd ? 'whiterockloans.com' : 'whiterockloans_com.example-app.com',
    mainForm: '1q_pd_im',
    mainFormLeadType: 19,
    mainFormPrimaryColor: 'no_data',
    mainFormTheme: NO_DATA,
    owner: 'Brian',
    tags: ['fixed header', 'index main form', 'ocs', 'unsubscribe'],
    template: 'WRL',
    website: 'WhiteRockLoans.com',
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

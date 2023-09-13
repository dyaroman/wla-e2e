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
    mainFormLeadType: 19,
    altForm: '1q_pd_im',
    altFormTheme: 'theme2',
    altFormLeadType: 57,
    mainFormEs: NO_DATA,
    mainFormEsTheme: NO_DATA,
    mainFormEsLeadType: NO_DATA,
    gtmKey: 'GTM-TNP7LR',
    owner: 'Christian',
    email: 'support@bad-credit-loans.co',
    emailLegal: 'legal@bad-credit-loans.co',
    effectiveDate: 'July 1, 2020',
    companyName: 'Customer Acquisition LLC',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    tags: ['index btn'],
    altFormPrimaryColor: '#FE6645',
    host: isProd ? 'bad-credit-loans.co' : 'bad-credit-loans_co.example-app.com',
    mainFormEsPrimaryColor: NO_DATA,
    mainFormPrimaryColor: '#FE6645',
  },
  'WhiteRockLoans.com': {
    website: 'WhiteRockLoans.com',
    template: 'WRL',
    campaignId: 241355,
    mainForm: '1q_pd_im',
    mainFormTheme: NO_DATA,
    mainFormLeadType: 19,
    altForm: '1q_pd_im',
    altFormTheme: NO_DATA,
    altFormLeadType: 57,
    mainFormEs: NO_DATA,
    mainFormEsTheme: NO_DATA,
    mainFormEsLeadType: NO_DATA,
    gtmKey: 'GTM-TNP7LR',
    owner: 'Brian',
    email: 'support@WhiteRockLoans.com',
    emailLegal: 'legal@WhiteRockLoans.com',
    effectiveDate: 'July 1, 2020',
    companyName: 'Customer Acquisition LLC',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    tags: ['fixed header', 'index main form', 'ocs', 'unsubscribe'],
    altFormPrimaryColor: NO_DATA,
    host: isProd ? 'whiterockloans.com' : 'whiterockloans_com.example-app.com',
    mainFormEsPrimaryColor: NO_DATA,
    mainFormPrimaryColor: NO_DATA,
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
        case 'mainFormEsPrimaryColor':
        case 'altFormPrimaryColor':
        case 'vmGroup':
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

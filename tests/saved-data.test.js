const { URL } = require('../misc/config');

const isProd = process.env.ENV === 'prod';
const websites = {
  'bad-credit-loans.co': {
    website: 'bad-credit-loans.co',
    template: 'BCL',
    campaignId: 251583,
    campaignUid: 'no_data',
    mainForm: '1q_pd_im',
    mainFormTheme: 'theme2',
    mainFormLeadType: 19,
    altForm: '1q_ac',
    altFormTheme: 'theme2',
    altFormLeadType: 44,
    mainFormEs: 'no_data',
    mainFormEsTheme: 'no_data',
    mainFormEsLeadType: 'no_data',
    gtmKey: 'GTM-TNP7LR',
    owner: 'Christian',
    email: 'support@bad-credit-loans.co',
    emailLegal: 'legal@bad-credit-loans.co',
    effectiveDate: 'July 1, 2020',
    companyName: 'Customer Acquisition LLC',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    vmGroup: 'us',
    tags: ['index btn'],
    ogImage: ['images/OG_image.jpg'],
    host: isProd ? 'bad-credit-loans.co' : 'bad-credit-loans_co.example-app.com',
    mainFormPrimaryColor: '#fe6645',
    altFormPrimaryColor: '#fe6645',
    mainFormEsPrimaryColor: 'no_data',
  },
  'WhiteRockLoans.com': {
    website: 'WhiteRockLoans.com',
    template: 'WRL',
    campaignId: 241355,
    campaignUid: 'no_data',
    mainForm: '1q_pd_im',
    mainFormTheme: 'no_data',
    mainFormLeadType: 19,
    altForm: '1q_ac',
    altFormTheme: 'no_data',
    altFormLeadType: 44,
    mainFormEs: 'no_data',
    mainFormEsTheme: 'no_data',
    mainFormEsLeadType: 'no_data',
    gtmKey: 'GTM-TNP7LR',
    owner: 'Brian',
    email: 'support@WhiteRockLoans.com',
    emailLegal: 'legal@WhiteRockLoans.com',
    effectiveDate: 'July 1, 2020',
    companyName: 'Customer Acquisition LLC',
    address1: 'Springates Building, Lower Government Road, Charlestown, ',
    address2: 'Saint Kitts and Nevis',
    vmGroup: 'us',
    tags: ['fixed header', 'index main form', 'ocs', 'unsubscribe'],
    ogImage: ['images/OG_image.jpg'],
    host: isProd ? 'whiterockloans.com' : 'whiterockloans_com.example-app.com',
    mainFormPrimaryColor: 'no_data',
    altFormPrimaryColor: 'no_data',
    mainFormEsPrimaryColor: 'no_data',
  },
};

Feature('filter website by saved data #static');

for (const website in websites) {
  Scenario(website, async ({ I }) => {
    const data = websites[website];
    I.amOnPage(URL);
    I.waitForElement('table', 60);
    const filtersCollapse = await I.grabAttributeFrom(
      'details.filters',
      'open',
    ).then((attr) => attr === null);
    if (filtersCollapse) {
      I.click('details.filters summary');
    }

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
        case 'ogImage':
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

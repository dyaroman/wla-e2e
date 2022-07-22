const { URL } = require("../config");

const isProd = process.env.NODE_ENV === "prod";

Feature("saved data");

const websites = {
  "bad-credit-loans.co": {
    website: "bad-credit-loans.co",
    template: "BCL",
    campaignId: 251583,
    mainForm: "1q_pd_im",
    mainLeadType: 19,
    altForm: "1q_36",
    altLeadType: 57,
    owner: "Christian",
    gtmKey: "GTM-TNP7LR",
    secretKey: isProd
      ? "RECAPTCHA_PLACEHOLDER"
      : "RECAPTCHA_PLACEHOLDER",
    companyName: "Customer Acquisition LLC",
    email: "support@bad-credit-loans.co",
    emailLegal: "legal@bad-credit-loans.co",
    effectiveDate: "July 1, 2020",
    address1:
      "Springates Building, Lower Government Road, Charlestown, Nevis, ",
    address2: "Saint Kitts and Nevis",
    tags: ["freshmarketer", "index btn"],
  },
  "WhiteRockLoans.com": {
    website: "WhiteRockLoans.com",
    template: "WRL",
    campaignId: 241355,
    mainForm: "1q_pd_im",
    mainLeadType: 19,
    altForm: "1q_36",
    altLeadType: 57,
    owner: "Brian",
    gtmKey: "GTM-TNP7LR",
    secretKey: isProd
      ? "RECAPTCHA_PLACEHOLDER"
      : "RECAPTCHA_PLACEHOLDER",
    companyName: "Customer Acquisition LLC",
    email: "support@WhiteRockLoans.com",
    emailLegal: "legal@WhiteRockLoans.com",
    effectiveDate: "July 1, 2020",
    address1:
      "Springates Building, Lower Government Road, Charlestown, Nevis, ",
    address2: "Saint Kitts and Nevis",
    tags: [
      "fixed header",
      "freshmarketer",
      "index main form",
      "sc",
      "unsubscribe",
    ],
  },
};

for (const website in websites) {
  Scenario(website, async ({ I }) => {
    const data = websites[website];
    I.amOnPage(URL);
    I.waitForElement("table", 60);
    for (const key in data) {
      if (key === "tags") {
        for (const tag of data[key]) {
          I.click(`.filters [data-qa="${tag}"]`);
        }
      } else {
        I.fillField(`[data-qa="${key}"]`, data[key]);
      }
    }
    I.seeTextEquals(`Website: 1`, `[data-qa="websitesNumber"]`);
    I.seeNumberOfVisibleElements("tbody tr", 1);
  });
}

const { URL } = require("../config");

Feature("parse url");

Scenario("filters", async ({ I }) => {
  const search = new URLSearchParams();
  const filters = {
    website: "bad-credit-loans.co",
    template: "BCL",
    campaignId: "251583",
    mainForm: "1q_pd_im",
    mainLeadType: "19",
    altForm: "1q_36",
    altLeadType: "57",
    owner: "Christian",
    gtmKey: "GTM-TNP7LR",
    secretKey: "RECAPTCHA_PLACEHOLDER",
    companyName: "Nesmetaju LLC",
    email: "support@bad-credit-loans.co",
    emailLegal: "legal@bad-credit-loans.co",
    effectiveDate: "July 1, 2020",
    address1: "Springates Building, Lower Government Road, Charlestown, Nevis,",
    address2: "Saint Kitts and Nevis",
    tags: ["freshmarketer", "index btn"],
  };

  for (const key in filters) {
    if (key === "tags") {
      search.set(key, filters[key].join());
    } else {
      search.set(key, filters[key]);
    }
  }

  I.amOnPage(`${URL}/?${search}`);
  I.waitForElement("table", 60);

  for (const key in filters) {
    if (key === "tags") {
      for (const tag of filters.tags) {
        I.seeAttributesOnElements(`.filters [data-qa="${tag}"]`, {
          "data-tag-active": "",
        });
      }
    } else {
      I.seeInField(`[data-qa="${key}"]`, filters[key]);
    }
  }

  I.seeNumberOfVisibleElements("tbody tr", 1);
  I.click(`[data-qa="clearAll"]`);
  I.seeInCurrentUrl(URL);

  for (const key in filters) {
    if (key === "tags") {
      I.dontSeeElement(`[data-tag-active]`);
    } else {
      I.seeInField(`[data-qa="${key}"]`, "");
    }
  }
});

Scenario("sorts", ({ I }) => {
  const search = new URLSearchParams();
  const sorts = {
    column: "website",
    direction: "desc",
  };

  for (const key in sorts) {
    search.set(key, sorts[key]);
  }

  I.amOnPage(`${URL}/?${search}`);
  I.waitForElement("table", 60);
  I.seeTextEquals(
    "YourLendAssistance.com",
    `tbody tr:first-child [data-qa="website"]`
  );
});

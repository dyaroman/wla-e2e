const { randomNumber } = require("../functions");

const origin = "https://dev.example-app.com";

Feature("filters");

Scenario("random website", async ({ I }) => {
  const search = new URLSearchParams();
  const response = await I.makeApiRequest(
    "GET",
    `${origin}/websites.data.json`
  );
  const { websites } = await response.json();
  const websiteData = websites[randomNumber(0, websites.length - 1)];
  I.amOnPage(origin);
  I.waitForElement("table", 60);
  for (const key in websiteData) {
    switch (key) {
      case "tags":
        search.set(key, websiteData[key].join());
        for (const tag of websiteData[key]) {
          I.click(`.filters [data-qa="${tag}"]`);
        }
        break;
      case "host":
        I.seeElement(`a[href="https://${websiteData[key]}"]`);
        break;
      default:
        search.set(key, websiteData[key]);
        I.fillField(`[data-qa="${key}"]`, websiteData[key]);
    }
  }
  I.seeNumberOfVisibleElements("tbody tr", 1);
  I.seeCurrentUrlEquals(`${origin}/?${search}`);
  I.click(`[data-qa="clearAll"]`);
  I.seeInCurrentUrl(origin);
  for (const key in websiteData) {
    switch (key) {
      case "tags":
        I.dontSeeElement(`[data-tag-active]`);
        break;
      case "host":
        I.seeElement(`a[href="https://${websiteData[key]}"]`);
        break;
      default:
        I.seeInField(`[data-qa="${key}"]`, "");
    }
  }
});

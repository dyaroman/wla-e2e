const origin = "https://dev.example-app.com";

Feature("filters");

Scenario("website", async ({ I }) => {
  const website = "bad-credit-loans";
  I.amOnPage(origin);
  I.waitForElement("table", 60);
  I.fillField(`[data-qa='website']`, website);
  I.seeNumberOfVisibleElements("tbody tr", 1);
  I.seeCurrentUrlEquals(`${origin}/?website=${website}`);
});

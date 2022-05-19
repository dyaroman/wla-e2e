const origin = "https://dev.example-app.com";

Feature("filters");

Scenario("website", async ({ I }) => {
  const website = "bad-credit-loans";
  I.amOnPage(origin);
  I.waitForElement("table", 60);
  I.fillField(`[data-qa='website']`, website);
  const rows = await I.grabNumberOfVisibleElements("tbody tr");
  if (rows !== 1) {
    throw new Error("fail expected only one website");
  }
  I.seeCurrentUrlEquals(`${origin}/?website=${website}`);
});

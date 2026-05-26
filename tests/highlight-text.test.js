import { URL } from "../misc/config.js";

Feature("highlight");

Scenario("should highlight search matched text", async ({ I }) => {
  I.amOnPage(`${URL}/?website=loan`);
  I.waitForElement("table", 60);
  I.seeElement("table mark");
});

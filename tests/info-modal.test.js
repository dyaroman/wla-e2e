import { URL } from "../misc/config.js";

Feature("info modal");

Scenario('should open and close by click "i" button', ({ I }) => {
  I.amOnPage(URL);
  I.openDrawer("sidebar");
  I.click('[data-qa="infoModal"]');
  I.seeElement(".modal");
  I.seeElement('//h3[text()="Shortcuts:"]');
  I.pressKey("Escape");
  I.wait(0.3);
  I.dontSeeElement(".modal");
});

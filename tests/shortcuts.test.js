import { URL } from "../misc/config.js";
import { SHOW_COLUMNS } from "../misc/consts.js";

Feature("shortcuts");

Scenario(
  'should open info modal on "open info modal" shortcut',
  async ({ I }) => {
    I.amOnPage(URL);
    I.waitForElement("table", 60);
    I.dontSeeElement(".modal");
    I.pressKey(["Shift", "?"]);
    I.seeElement(".modal");
    I.seeTextEquals("Info modal", ".modal__title");
  },
);

Scenario(
  'should move focus to first search input on "search" shortcut',
  async ({ I }) => {
    I.amOnPage(URL);
    I.waitForElement("table", 60);
    I.dontSeeElement(".drawer-backdrop");

    I.pressKey(["CommandOrControl", "Shift", "F"]);
    I.wait(0.3);
    I.seeElement(".drawer-backdrop");
    I.seeTextEquals("Filters", ".drawer__title");
    I.type("cash");
    I.seeInField('.filters [data-qa="website"]', "cash");
    I.seeInCurrentUrl("website=cash");
  },
);

Scenario(
  'should contains websites list on "copy websites" shortcut',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websitesFromData = websites
      .filter((website) => website["website"].toLowerCase().includes("loan"))
      .map((website) => website["website"])
      .join(",");
    I.usePlaywrightTo(
      "grant clipboard permissions",
      async ({ browserContext }) => {
        await browserContext.grantPermissions([
          "clipboard-read",
          "clipboard-write",
        ]);
      },
    );
    I.amOnPage(`${URL}/?website=loan&${SHOW_COLUMNS}=none`);
    I.waitForElement("table", 60);
    I.pressKey(["CommandOrControl", "Shift", "C"]);
    const websitesFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    if (websitesFromData !== websitesFromClipboard) {
      throw new Error(
        `Websites from data (${websitesFromData}) and clipboard (${websitesFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

Scenario(
  'should clear filters and sort on "clear all" shortcut',
  async ({ I }) => {
    I.amOnPage(`${URL}/?website=cash&template=sml`);
    I.waitForElement("table", 60);
    I.openDrawer("filters");
    I.seeInField('.filters [data-qa="website"]', "cash");
    I.seeInField('.filters [data-qa="template"]', "sml");
    I.pressKey(["CommandOrControl", "Shift", "E"]);
    I.seeInField('.filters [data-qa="website"]', "");
    I.seeInField('.filters [data-qa="template"]', "");
    I.dontSeeInCurrentUrl("website=cash");
    I.dontSeeInCurrentUrl("template=sml");
  },
);

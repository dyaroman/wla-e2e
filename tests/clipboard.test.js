import os from "os";

import { URL } from "../misc/config.js";
import { NO_DATA, SHOW_COLUMNS } from "../misc/consts.js";

Feature("clipboard");

Scenario(
  "should contains hex from table color cell after click on it with Meta key pressed",
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websiteWithHex = websites.find(
      (website) => website["mainFormPrimaryColor"] !== NO_DATA,
    );
    I.restartBrowser({ permissions: ["clipboard-read", "clipboard-write"] });
    I.amOnPage(
      `${URL}/?website=${websiteWithHex["website"]}&${SHOW_COLUMNS}=website,mainFormTheme`,
    );
    I.waitForElement("table", 60);
    I.click('tbody [data-qa="mainFormTheme"]', null, {
      modifiers: ["Meta"],
    });
    const hexFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    const hexFromWebsiteData = websiteWithHex["mainFormPrimaryColor"];
    if (hexFromClipboard !== hexFromWebsiteData) {
      throw new Error(
        `HEX from website data (${hexFromWebsiteData}) and clipboard (${hexFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

Scenario(
  "should contains text content from table cell after click on it with Meta key pressed",
  async ({ I }) => {
    const websiteNameFromData = (await I.getRandomWebsiteData()).website;
    I.restartBrowser({ permissions: ["clipboard-read", "clipboard-write"] });
    I.amOnPage(`${URL}/?website===${websiteNameFromData}`);
    I.waitForElement("table", 60);
    I.click('tbody [data-qa="website"]', null, {
      modifiers: ["Meta"],
    });
    const websiteNameFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    if (websiteNameFromClipboard !== websiteNameFromData) {
      throw new Error(
        `Website name from website data (${websiteNameFromData}) and clipboard (${websiteNameFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

Scenario(
  'should contains websites list on "copy websites" button click',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websitesFromData = websites
      .filter((website) => website["website"].toLowerCase().includes("coffee"))
      .map((website) => website["website"])
      .join(os.EOL);
    I.restartBrowser({ permissions: ["clipboard-read", "clipboard-write"] });
    I.amOnPage(`${URL}/?website=coffee&${SHOW_COLUMNS}=none`);
    I.waitForElement("table", 60);
    I.openDrawer("sidebar");
    I.click('[data-qa="copyWebsites"]');
    const websitesFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    if (websitesFromData !== websitesFromClipboard) {
      throw new Error(
        `Websites list from data (${websitesFromData}) and clipboard (${websitesFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

Scenario(
  'should contains websites urls list on "copy websites urls" button click',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websitesUrlsFromData = websites
      .filter((website) => website["website"].toLowerCase().includes("coffee"))
      .map((website) => `https://${website["host"]}/`)
      .join(os.EOL);
    I.restartBrowser({ permissions: ["clipboard-read", "clipboard-write"] });
    I.amOnPage(`${URL}/?website=coffee&${SHOW_COLUMNS}=none`);
    I.waitForElement("table", 60);
    I.openDrawer("sidebar");
    I.click('[data-qa="copyWebsitesUrls"]');
    const websitesUrlsFromClipboard = await I.executeScript(() =>
      navigator.clipboard.readText(),
    );
    if (websitesUrlsFromData !== websitesUrlsFromClipboard) {
      throw new Error(
        `Websites urls list from data (${websitesUrlsFromData}) and clipboard (${websitesUrlsFromClipboard}) should match, but it does not!`,
      );
    }
  },
);

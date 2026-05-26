import Helper from "@codeceptjs/helper";

import { DATA_URL } from "../misc/config.js";
import { WEBSITES_DATA } from "../misc/consts.js";
import { getRandomNumber } from "../misc/functions.js";

class WlaHelper extends Helper {
  wlaData;

  async _before() {
    const { Playwright } = this.helpers;
    await Playwright.makeApiRequest("GET", `${DATA_URL}/${WEBSITES_DATA}`)
      .then((response) => response.json())
      .then((json) => {
        this.wlaData = json;
      });
  }

  getWlaData() {
    return this.wlaData;
  }

  getColumns() {
    return this.wlaData["columns"];
  }

  getWebsitesData() {
    return this.wlaData["websites"];
  }

  getRandomWebsiteData({ returnIndex = false } = {}) {
    const websites = this.wlaData["websites"];
    const randomIndex = getRandomNumber(0, websites.length - 1);
    if (returnIndex) return [websites[randomIndex], randomIndex];
    return websites[randomIndex];
  }

  async openDrawer(name) {
    if (!["columns", "sidebar", "filters", "tags"].includes(name)) {
      throw new Error(`Wrong drawer name: ${name}`);
    }
    const drawers = {
      columns: "customizeColumns",
      sidebar: "burger",
      filters: "filters",
      tags: "tags",
    };
    const { Playwright } = this.helpers;
    await this.closeDrawer();
    await Playwright.click(`[data-qa="${drawers[name]}"]`);
    await Playwright.wait(0.3);
  }

  async closeDrawer() {
    const { Playwright } = this.helpers;
    const closeBtn = await Playwright._locate(".drawer__close");
    if (closeBtn.length > 0) {
      await closeBtn[0].click();
      await Playwright.wait(0.3);
    }
  }
}

export default WlaHelper;

import { URL } from "../misc/config.js";
import { getRandomNumber } from "../misc/functions.js";

Feature("links");

Scenario("should see last commit link and websites links", async ({ I }) => {
  const { commit, websites } = await I.getWlaData();
  websites.sort((a, b) => {
    if (a.website === "no_data") return 1;
    if (b.website === "no_data") return -1;
    return a.website.toLowerCase().localeCompare(b.website.toLowerCase());
  });
  I.amOnPage(
    `${URL}?showColumns=pages,website&perPage=100&column=website&direction=asc`,
  );
  I.waitForElement('[data-qa="app"]', 60);

  // open sidebar
  I.openDrawer("sidebar");

  // commit
  if (commit) {
    I.seeAttributesOnElements('[data-qa="commit"] a', {
      href: `https://dev.azure.com/org/git/repo/commit/${commit}`,
    });
  }

  const randomIndex = getRandomNumber(1, 100);
  const website = websites[randomIndex];
  I.say(`check links for #${randomIndex} ${website["website"]}`);
  const websiteIndex = websites.findIndex(
    (w) => w["website"] === website["website"],
  );
  const row = `.table tbody tr:nth-child(${websiteIndex + 1})`;
  for (const column in website) {
    switch (column) {
      case "website":
        I.seeAttributesOnElements(`${row} [data-qa="website"] a`, {
          href: `https://${website["host"]}`,
          target: "_blank",
          rel: "noreferrer",
        });
        break;
      case "pages":
        for (let i = 0; i < website[column].length; i++) {
          I.seeAttributesOnElements(
            `${row} [data-qa="pages"] li:nth-child(${i + 1}) a`,
            {
              href: `https://${website["host"]}/${website[column][i]}`,
              target: "_blank",
              rel: "noreferrer",
            },
          );
        }
        break;
      default:
        break;
    }
  }
});

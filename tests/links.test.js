import { URL } from "../misc/config.js";
import { getRandomNumber } from "../misc/functions.js";

Feature("links");

Scenario("should see last commit link and websites links", async ({ I }) => {
  const { commit, repoPath, websites } = await I.getWlaData();
  I.amOnPage(`${URL}?showColumns=pages,website&perPage=100`);
  I.waitForElement('[data-qa="app"]', 60);

  // open sidebar
  I.openDrawer("sidebar");

  // commit
  if (repoPath && commit) {
    I.seeAttributesOnElements('[data-qa="commit"] a', {
      href: `https://dev.azure.com/example-org/${repoPath}/commit/${commit}`,
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
          href: `https://${website["host"]}/`,
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

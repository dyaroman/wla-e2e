import { URL } from "../misc/config.js";

Feature("tags");

Scenario('should see disabled tags if select "es" tag', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement("table", 60);
  I.openDrawer("tags");
  const disabledTagsBefore = await I.grabNumberOfVisibleElements(
    ".tags label.disabled",
  );
  if (disabledTagsBefore > 0) {
    throw new Error(`Disabled tags must be 0, but got ${disabledTagsBefore}`);
  }
  I.click(`.tags label[data-qa='es']`);
  const disabledTagsAfter = await I.grabNumberOfVisibleElements(
    ".tags label.disabled",
  );
  if (disabledTagsAfter === 0) {
    throw new Error(
      `Disabled tags must be more than 0, but got ${disabledTagsAfter}`,
    );
  }
  console.log({ disabledTagsBefore, disabledTagsAfter });
});

Scenario('should exclude websites that have the "es" tag', async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement("table", 60);
  const numberOfAllWebsites = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str.split("/")[0]),
  );
  I.openDrawer("tags");
  // include
  I.click('.tags label[data-qa="es"]');
  const numberOfIncludeWebsites = await I.grabTextFrom(
    '[data-qa="counter"]',
  ).then((str) => Number(str.split("/")[0]));
  // exclude
  I.click('.tags label[data-qa="es"]');
  const numberOfExcludeWebsites = await I.grabTextFrom(
    '[data-qa="counter"]',
  ).then((str) => Number(str.split("/")[0]));
  console.log({
    numberOfAllWebsites,
    numberOfIncludeWebsites,
    numberOfExcludeWebsites,
  });
  if (
    numberOfAllWebsites !==
    numberOfIncludeWebsites + numberOfExcludeWebsites
  ) {
    throw new Error(
      "Number of all websites should be equal to sum of include and exclude websites",
    );
  }
});

import { URL } from "../misc/config.js";

Feature("strict == search");

Scenario("campaignId == 1", async ({ I }) => {
  I.amOnPage(`${URL}/?campaignId=1`);
  I.waitForElement("table", 60);
  const numberOfInclude = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str.split("/")[0]),
  );

  I.amOnPage(`${URL}/?campaignId===1`);
  I.waitForElement("table", 60);
  const numberOfEqual = await I.grabTextFrom('[data-qa="counter"]').then(
    (str) => Number(str.split("/")[0]),
  );

  console.log({
    numberOfInclude,
    numberOfEqual,
  });
  if (isNaN(numberOfInclude)) {
    throw new Error(`should be number, but got: ${numberOfInclude}`);
  }
  if (isNaN(numberOfEqual)) {
    throw new Error(`should be number, but got: ${numberOfEqual}`);
  }
  if (numberOfEqual === numberOfInclude) {
    throw new Error('Error due to filter websites by "campaignId": "==1"');
  }
});

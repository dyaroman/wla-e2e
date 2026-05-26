import { URL } from "../misc/config.js";
import { getRandomNumber, toRandomCase } from "../misc/functions.js";
import { SHOW_COLUMNS } from "../misc/consts.js";

Feature("parse url");

Scenario(
  'should sort "website" column by "desc" direction from url parameters',
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websiteData = websites[websites.length - 1];
    const sorts = {
      column: "website",
      direction: "desc",
    };

    const search = new URLSearchParams();
    for (const key in sorts) {
      search.set(key, sorts[key]);
    }

    I.amOnPage(`${URL}/?${search}`);
    I.waitForElement("table", 60);
    I.seeTextEquals(
      websiteData["website"],
      'tbody tr:first-child [data-qa="website"]',
    );
  },
);

Scenario("should read filters from url case insensitive", async ({ I }) => {
  const columns = await I.getColumns();
  const websiteData = await I.getRandomWebsiteData();
  const filters = [];
  for (const column in columns) {
    if (!columns[column]["renderFilter"]) continue;
    filters.push([column, toRandomCase(column), websiteData[column]]);
  }
  I.amOnPage(
    `${URL}/?${filters
      .map((filter) =>
        filter
          .slice(1)
          .map((e) => {
            if (typeof e === "string" && e.includes("#"))
              return e.replace("#", encodeURIComponent("#"));
            return e;
          })
          .join("="),
      )
      .join("&")}`,
  );
  I.waitForElement('[data-qa="app"]', 60);

  for (const [correctCase, incorrectCase] of filters) {
    I.seeInCurrentUrl(`${correctCase}=`);
    if (correctCase !== incorrectCase) {
      I.dontSeeInCurrentUrl(`${incorrectCase}=`);
    }
  }
});

Scenario(
  "should read sort parameters from url case insensitive",
  async ({ I }) => {
    const websites = await I.getWebsitesData();
    const websiteData = websites[websites.length - 1];
    const sorts = {
      [toRandomCase("column")]: toRandomCase("website"),
      [toRandomCase("direction")]: toRandomCase("desc"),
    };

    const search = new URLSearchParams();
    for (const key in sorts) {
      search.set(key, sorts[key]);
    }

    I.amOnPage(`${URL}/?${search}`);
    I.waitForElement("table", 60);
    I.seeTextEquals(
      websiteData["website"],
      'tbody tr:first-child [data-qa="website"]',
    );
  },
);

Scenario(
  'should show one website for url with filters by this website data and erase url when "clear all" clicked',
  async ({ I }) => {
    const columns = await I.getColumns();
    const websiteData = await I.getRandomWebsiteData();
    const randomPage =
      websiteData["pages"][getRandomNumber(0, websiteData["pages"].length - 1)];
    const randomForm = Object.keys(websiteData["forms"])[
      getRandomNumber(0, Object.keys(websiteData["forms"]).length - 1)
    ];
    await I.say(`Run test for website ${websiteData["website"]}`);

    // prepare searchParams
    const search = new URLSearchParams();
    for (const key in websiteData) {
      if (!columns[key]["renderFilter"]) continue;
      switch (key) {
        case "tags":
          if (websiteData[key].length > 0) {
            search.set(key, websiteData[key].join());
          }
          break;

        case "pages":
          search.set(key, randomPage);
          break;

        case "forms":
          if (randomForm) {
            search.set(key, randomForm);
          }
          break;

        default:
          search.set(key, websiteData[key]);
      }
    }

    I.amOnPage(`${URL}/?${search}`);
    I.waitForElement("table", 60);
    // open sidebar
    I.pressKey(["CommandOrControl", "/"]);
    I.seeTextEquals("Website: 1", '[data-qa="websitesNumber"]');
    I.seeInTitle("[1]");
    I.seeNumberOfVisibleElements("tbody tr", 1);
    // close sidebar
    I.pressKey(["CommandOrControl", "/"]);

    // check that data from URL searchParams equal to data from file
    I.openDrawer("filters");
    for (const key in websiteData) {
      if (!columns[key]["renderFilter"]) continue;
      switch (key) {
        case "tags":
          I.seeNumberOfVisibleElements(
            ".table .tags-list li",
            websiteData["tags"].length,
          );
          break;

        case "pages":
          I.seeInField(`input[data-qa="${key}"]`, randomPage);
          break;

        case "forms":
          if (randomForm) {
            I.seeInField(`input[data-qa="${key}"]`, randomForm);
          }
          break;

        default:
          I.seeInField(`input[data-qa="${key}"]`, websiteData[key]);
      }
    }

    // clear all filters and sorts
    I.click('[data-qa="resetFilters"]');
    I.openDrawer("tags");
    I.click('[data-qa="resetTags"]');
    I.seeInCurrentUrl(URL);

    // check that field are empty
    for (const key in websiteData) {
      if (!columns[key]["renderFilter"]) continue;
      switch (key) {
        case "tags":
          I.dontSeeElement("[data-tag-active]");
          break;
        default:
          I.seeInField(`[data-qa="${key}"]`, "");
      }
    }
  },
);

Scenario(
  `should read ${SHOW_COLUMNS} parameter from url case insensitive`,
  async ({ I }) => {
    const columns = await I.getColumns();
    I.amOnPage(`${URL}/?${toRandomCase(SHOW_COLUMNS)}=none`);
    I.waitForElement('[data-qa="noColumns"]', 60);
    I.openDrawer("columns");
    for (const column in columns) {
      if (!columns[column]["renderFilter"]) continue;
      I.dontSeeCheckboxIsChecked(`.checkbox__input[name="${column}"]`);
      // table column
      I.dontSeeElement(`thead [data-qa="${column}"]`);
    }
  },
);

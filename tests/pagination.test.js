import { URL } from "../misc/config.js";

Feature("@pagination");

Scenario(
  "should disable prev button and first page button on first page",
  async ({ I }) => {
    I.amOnPage(URL);
    I.waitForElement('[data-qa="app"]', 60);
    const firstPageBtn = await I.grabDisabledElementStatus(
      '[data-qa="firstPage"]',
    );
    if (!firstPageBtn) {
      throw new Error("First page button should be disabled");
    }
    const prevPageBtn = await I.grabDisabledElementStatus(
      '[data-qa="prevPage"]',
    );
    if (!prevPageBtn) {
      throw new Error("Previous page button should be disabled");
    }
  },
);

Scenario(
  "should disable next button and last page button on last page",
  async ({ I }) => {
    I.amOnPage(URL);
    I.waitForElement('[data-qa="app"]', 60);
    const rows = await I.grabTextFrom('[data-qa="counter"]');
    const perPage = await I.grabValueFrom('[data-qa="perPage"]');
    const totalPages = Math.ceil(rows / perPage);
    I.amOnPage(`${URL}?currentPage=${totalPages}`);
    const nextPageBtn = await I.grabDisabledElementStatus(
      '[data-qa="nextPage"]',
    );
    if (!nextPageBtn) {
      throw new Error("Next page button should be disabled");
    }
    const lastPageBtn = await I.grabDisabledElementStatus(
      '[data-qa="lastPage"]',
    );
    if (!lastPageBtn) {
      throw new Error("Last page button should be disabled");
    }
  },
);

Scenario("should match per page value with table rows", async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('[data-qa="app"]', 60);
  const perPage = Number(await I.grabValueFrom('[data-qa="perPage"]'));
  const rows = await I.grabNumberOfVisibleElements("tbody tr");
  if (perPage !== rows) {
    throw new Error(`Per page value should be ${rows}, but got ${perPage}`);
  }
});

Scenario("should read valid per page value from url", async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('[data-qa="app"]', 60);
  const perPageSecondValue = Number(
    await I.grabAttributeFrom(
      '[data-qa="perPage"] option:nth-child(2)',
      "value",
    ),
  );
  I.amOnPage(`${URL}?perPage=${perPageSecondValue}`);
  I.waitForElement('[data-qa="app"]', 60);
  const perPage = Number(await I.grabValueFrom('[data-qa="perPage"]'));
  if (perPage !== perPageSecondValue) {
    throw new Error(
      `Per page value should be ${perPageSecondValue}, but got ${perPage}`,
    );
  }
  const rows = await I.grabNumberOfVisibleElements("tbody tr");
  if (rows !== perPageSecondValue) {
    throw new Error(
      `Table rows should be ${perPageSecondValue}, but got ${rows}`,
    );
  }
});

Scenario("should ignore invalid per page value from url", async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('[data-qa="app"]', 60);
  const perPageDefaultValue = Number(
    await I.grabValueFrom('[data-qa="perPage"]'),
  );
  const invalidPerPageValue = 42;
  I.amOnPage(`${URL}?perPage=${invalidPerPageValue}`);
  I.waitForElement('[data-qa="app"]', 60);
  const perPage = Number(await I.grabValueFrom('[data-qa="perPage"]'));
  if (perPage !== perPageDefaultValue) {
    throw new Error(
      `Per page value should be ${perPageDefaultValue}, but got ${perPage}`,
    );
  }
  const rows = await I.grabNumberOfVisibleElements("tbody tr");
  if (rows !== perPageDefaultValue) {
    throw new Error(
      `Table rows should be ${perPageDefaultValue}, but got ${rows}`,
    );
  }
  I.dontSeeInCurrentUrl(`perPage=${invalidPerPageValue}`);
});

Scenario("should show 100 websites on page", async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('[data-qa="app"]', 60);
  I.selectOption('[data-qa="perPage"]', "100");
  const perPage = Number(await I.grabValueFrom('[data-qa="perPage"]'));
  if (perPage !== 100) {
    throw new Error(`Per page value should be 100, but got ${perPage}`);
  }
  const rows = await I.grabNumberOfVisibleElements("tbody tr");
  if (rows !== 100) {
    throw new Error(`Table rows should be 100, but got ${rows}`);
  }
  I.seeInCurrentUrl("perPage=100");
});

Scenario("should show proper current page", async ({ I }) => {
  I.amOnPage(URL);
  I.waitForElement('[data-qa="app"]', 60);
  const rows = await I.grabTextFrom('[data-qa="counter"]');
  const perPage = await I.grabValueFrom('[data-qa="perPage"]');
  const totalPages = Math.ceil(rows / perPage);
  I.seeTextEquals(`1/${totalPages}`, '[data-qa="currentPage"]');
  I.click('[data-qa="nextPage"]');
  I.seeTextEquals(`2/${totalPages}`, '[data-qa="currentPage"]');
  I.click('[data-qa="nextPage"]');
  I.seeTextEquals(`3/${totalPages}`, '[data-qa="currentPage"]');
  I.click('[data-qa="prevPage"]');
  I.seeTextEquals(`2/${totalPages}`, '[data-qa="currentPage"]');
  I.click('[data-qa="lastPage"]');
  I.seeTextEquals(`${totalPages}/${totalPages}`, '[data-qa="currentPage"]');
  I.click('[data-qa="firstPage"]');
  I.seeTextEquals(`1/${totalPages}`, '[data-qa="currentPage"]');
});

Scenario("should read valid current page value from url", async ({ I }) => {
  const currentPageValidValue = 3;
  I.amOnPage(`${URL}?currentPage=${currentPageValidValue}`);
  I.waitForElement('[data-qa="app"]', 60);
  const rows = await I.grabTextFrom('[data-qa="counter"]');
  const perPage = await I.grabValueFrom('[data-qa="perPage"]');
  const totalPages = Math.ceil(rows / perPage);
  I.seeTextEquals(
    `${currentPageValidValue}/${totalPages}`,
    '[data-qa="currentPage"]',
  );
});

Scenario("should ignore invalid current page value from url", async ({ I }) => {
  const currentPageInvalidValue = -1;
  I.amOnPage(`${URL}?currentPage=${currentPageInvalidValue}`);
  I.waitForElement('[data-qa="app"]', 60);
  const rows = await I.grabTextFrom('[data-qa="counter"]');
  const perPage = await I.grabValueFrom('[data-qa="perPage"]');
  const totalPages = Math.ceil(rows / perPage);
  I.seeTextEquals(`1/${totalPages}`, '[data-qa="currentPage"]');
  I.dontSeeInCurrentUrl("currentPage");
});

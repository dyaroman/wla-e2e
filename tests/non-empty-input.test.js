const { URL } = require('../misc/config');

Feature('input modification css class');

Scenario(
  'non-empty input should have "--filled" modification css class',
  async ({ I }) => {
    I.amOnPage(`${URL}/?website=loan`);
    I.waitForElement('table', 60);
    const inputClasses = await I.grabAttributeFrom(
      'input[data-qa="website"]',
      'class',
    );
    if (!inputClasses.includes('--filled')) {
      throw new Error(
        `Non-empty input element should have '--filled' css modification class! But it haven't: "${inputClasses}"`,
      );
    }
  },
);

Scenario(
  `empty input shouldn't have "--filled" modification css class`,
  async ({ I }) => {
    I.amOnPage(`${URL}/`);
    I.waitForElement('table', 60);
    const inputClasses = await I.grabAttributeFrom(
      'input[data-qa="website"]',
      'class',
    );
    if (inputClasses.includes('--filled')) {
      throw new Error(
        `Empty input element shouldn't have '--filled' css modification class! But it has: "${inputClasses}"`,
      );
    }
  },
);

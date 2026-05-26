import { URL } from "../misc/config.js";
import { hex2rgb, rgb2hex } from "../misc/color.js";

Feature("theme toggle");

Scenario("should toggle from light theme to dark theme", async ({ I }) => {
  const lightBgColor = "#fff";
  const darkBgColor = "#212529";

  I.amOnPage(URL);
  // check light theme
  let bgColor = await I.grabCssPropertyFrom("body", "background-color");
  if (hex2rgb(lightBgColor) !== bgColor) {
    throw new Error(
      `body bg color should be "${lightBgColor}" for light theme, but got "${rgb2hex(bgColor)}"`,
    );
  }

  // toggle to dark theme
  I.restartBrowser({ colorScheme: "dark" });
  I.amOnPage(URL);

  // check dark theme
  bgColor = await I.grabCssPropertyFrom("body", "background-color");
  if (hex2rgb(darkBgColor) !== bgColor) {
    throw new Error(
      `body bg color should be "${darkBgColor}" for dark theme, but got "${rgb2hex(bgColor)}"`,
    );
  }
});

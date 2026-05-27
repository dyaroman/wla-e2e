import { event } from "codeceptjs";
import fs from "fs";
import crypto from "crypto";

/**
 * CodeceptJS plugin that writes test results to output/results.json
 * in the format expected by the wla-aqa dashboard.
 */
export default function aqaReporter() {
  const results = [];

  event.dispatcher.on(event.test.passed, (test) => {
    results.push({
      title: test.title,
      pass: true,
      fail: false,
      skipped: false,
      err: null,
      img: test.artifacts?.screenshot
        ? getFilename(test.artifacts.screenshot)
        : null,
      uuid: crypto.randomUUID(),
    });
  });

  event.dispatcher.on(event.test.failed, (test) => {
    results.push({
      title: test.title,
      pass: false,
      fail: true,
      skipped: false,
      err: { message: test.err?.message || "" },
      img: test.artifacts?.screenshot
        ? getFilename(test.artifacts.screenshot)
        : null,
      uuid: crypto.randomUUID(),
    });
  });

  event.dispatcher.on(event.test.skipped, (test) => {
    results.push({
      title: test.title,
      pass: false,
      fail: false,
      skipped: true,
      err: null,
      img: null,
      uuid: crypto.randomUUID(),
    });
  });

  event.dispatcher.on(event.all.result, () => {
    if (!fs.existsSync("./output")) {
      fs.mkdirSync("./output");
    }
    fs.writeFileSync("./output/results.json", JSON.stringify(results, null, 2));
  });
}

function getFilename(filePath) {
  return filePath ? filePath.split("/").pop() : null;
}

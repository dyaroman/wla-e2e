import { event } from "codeceptjs";
import fs from "fs";
import crypto from "crypto";

/**
 * CodeceptJS plugin that writes test results to output/results.json
 * in the format expected by the wla-aqa dashboard.
 *
 * Screenshots are read from test.artifacts.screenshot in event.all.result
 * (not in event.test.failed) because the screenshot plugin schedules the
 * capture via recorder.add() — the artifact path is only available after
 * the recorder has flushed, which is guaranteed by event.all.result time.
 */
export default function aqaReporter() {
  // Store test object references; resolve screenshot paths in event.all.result
  const pending = [];

  event.dispatcher.on(event.test.passed, (test) => {
    pending.push({ test, pass: true, fail: false, skipped: false });
  });

  event.dispatcher.on(event.test.failed, (test) => {
    pending.push({ test, pass: false, fail: true, skipped: false });
  });

  event.dispatcher.on(event.test.skipped, (test) => {
    pending.push({ test, pass: false, fail: false, skipped: true });
  });

  event.dispatcher.on(event.all.result, () => {
    const results = pending.map(({ test, pass, fail, skipped }) => ({
      title: test.title,
      pass,
      fail,
      skipped,
      err: fail ? { message: test.err?.message || "" } : null,
      // artifacts.screenshot is set by the screenshot plugin after recorder flush
      img: test.artifacts?.screenshot
        ? getFilename(test.artifacts.screenshot)
        : null,
      uuid: crypto.randomUUID(),
    }));

    if (!fs.existsSync("./output")) {
      fs.mkdirSync("./output");
    }
    fs.writeFileSync("./output/results.json", JSON.stringify(results, null, 2));
  });
}

function getFilename(filePath) {
  return filePath ? filePath.split("/").pop() : null;
}

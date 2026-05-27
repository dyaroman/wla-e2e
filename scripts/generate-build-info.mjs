import fs from "fs";

const info = {
  buildNumber: process.env.BUILD_NUMBER,
  buildTimestamp: new Date().toISOString(),
  buildId: process.env.RUN_ID, // GitHub Actions run_id → links to GH Actions run
  pipelineBranch: process.env.BRANCH,
  env: process.env.TEST_ENV || "prod",
};

if (!fs.existsSync("./output")) {
  fs.mkdirSync("./output");
}

fs.writeFileSync("./output/build-info.json", JSON.stringify(info, null, 2));
console.log("Generated build-info.json:", JSON.stringify(info));

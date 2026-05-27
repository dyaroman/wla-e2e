/**
 * Updates the `data` branch with the latest test results.
 *
 * Layout of the data branch:
 *   build-info.json      ← latest run (root)
 *   results.json         ← latest run (root)
 *   images/              ← latest run screenshots (root)
 *   builds.json          ← array of previously archived builds [{number, timestamp}]
 *   {buildNumber}/       ← archived older runs
 *     build-info.json
 *     results.json
 *     images/
 *
 * wla-aqa fetches both builds.json (history) and the root build-info.json (latest),
 * merges them, and deduplicates by build number.
 */

import { execSync } from "child_process";
import fs from "fs";

const exec = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const execOutput = (cmd) => execSync(cmd, { encoding: "utf8" }).trim();

// ── 1. Read new build info ──────────────────────────────────────────────────
const buildInfo = JSON.parse(
  fs.readFileSync("./output/build-info.json", "utf8"),
);
const newNumber = buildInfo.buildNumber;
const newTimestamp = buildInfo.buildTimestamp;

console.log(`Updating data branch with build ${newNumber}…`);

// ── 2. Configure git ────────────────────────────────────────────────────────
exec('git config user.email "action@github.com"');
exec('git config user.name "GitHub Actions"');

// ── 3. Save new results to a temp location ──────────────────────────────────
// CodeceptJS writes screenshots directly to output/ (not a subdirectory).
// Collect them into an images/ folder so the dashboard can fetch them as
// /{buildNumber}/images/{filename}.
const tmpDir = "/tmp/new-results";
if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
fs.mkdirSync(tmpDir);
fs.copyFileSync("./output/build-info.json", `${tmpDir}/build-info.json`);
fs.copyFileSync("./output/results.json", `${tmpDir}/results.json`);

const screenshots = fs
  .readdirSync("./output")
  .filter((f) => f.endsWith(".png"));
if (screenshots.length > 0) {
  fs.mkdirSync(`${tmpDir}/images`);
  for (const file of screenshots) {
    fs.copyFileSync(`./output/${file}`, `${tmpDir}/images/${file}`);
  }
  console.log(`Collected ${screenshots.length} screenshot(s)`);
}

// ── 4. Switch to data branch ────────────────────────────────────────────────
// Discard any working-tree changes (e.g. package.json modified by npm pkg delete)
// before switching branches — results are already saved in /tmp.
exec("git reset --hard HEAD");
exec("git fetch origin data");
exec("git checkout data");

// ── 5. Archive current root results (if any) ────────────────────────────────
let archivedNumber = null;
let archivedTimestamp = null;
if (fs.existsSync("build-info.json")) {
  const prev = JSON.parse(fs.readFileSync("build-info.json", "utf8"));
  archivedNumber = prev.buildNumber;
  archivedTimestamp = prev.buildTimestamp;
  console.log(`Archiving previous build ${archivedNumber}…`);
  fs.mkdirSync(archivedNumber, { recursive: true });
  fs.renameSync("build-info.json", `${archivedNumber}/build-info.json`);
  if (fs.existsSync("results.json"))
    fs.renameSync("results.json", `${archivedNumber}/results.json`);
  if (fs.existsSync("images"))
    fs.renameSync("images", `${archivedNumber}/images`);
}

// ── 6. Copy new results to root ─────────────────────────────────────────────
fs.copyFileSync(`${tmpDir}/build-info.json`, "build-info.json");
fs.copyFileSync(`${tmpDir}/results.json`, "results.json");
if (fs.existsSync(`${tmpDir}/images`)) {
  fs.cpSync(`${tmpDir}/images`, "images", { recursive: true });
}

// ── 7. Update builds.json (keep last 10 archived builds) ────────────────────
// builds.json tracks only ARCHIVED builds; the current run lives at root
// in build-info.json and is fetched separately by the dashboard.
// Adding the current run here would cause it to appear twice in the selector.
let builds = [];
if (fs.existsSync("builds.json")) {
  builds = JSON.parse(fs.readFileSync("builds.json", "utf8"));
}

if (archivedNumber) {
  builds.unshift({ number: archivedNumber, timestamp: archivedTimestamp });
}

// Prune to 10: remove the oldest entry and its folder
while (builds.length > 10) {
  const oldest = builds.pop();
  if (fs.existsSync(oldest.number)) {
    fs.rmSync(oldest.number, { recursive: true, force: true });
    console.log(`Pruned old build ${oldest.number}`);
  }
}

fs.writeFileSync("builds.json", JSON.stringify(builds, null, 2));

// ── 8. Commit and push ───────────────────────────────────────────────────────
exec("git add -A");
exec(`git commit -m "results: ${newNumber}" --allow-empty`);
exec("git push origin data");
console.log(`Data branch updated with build ${newNumber} ✓`);

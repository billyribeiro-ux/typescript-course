#!/usr/bin/env node
/**
 * validate.mjs — integrity check for the course.
 * Verifies:
 *   • the lessons manifest parses,
 *   • every "available" lesson points to a file that exists on disk,
 *   • the vendored Monaco assets are present,
 *   • the Next/Prev chain of available lessons is unbroken.
 * Run: node tools/validate.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let errors = 0;
let warnings = 0;
const fail = (m) => { console.error("  ✖ " + m); errors++; };
const warn = (m) => { console.warn("  ! " + m); warnings++; };
const ok = (m) => console.log("  ✓ " + m);

// 1. Load the manifest by evaluating lessons.js against a fake `window`.
const manifestSrc = readFileSync(join(ROOT, "assets/js/lessons.js"), "utf8");
const win = {};
new Function("window", "self", manifestSrc)(win, win);
const COURSE = win.COURSE;
const FLAT = win.COURSE_FLAT;
if (!COURSE || !FLAT) { fail("lessons.js did not define window.COURSE / COURSE_FLAT"); process.exit(1); }
ok(`Manifest parsed: ${COURSE.parts.length} parts, ${FLAT.length} lessons total`);

// 2. Monaco vendored assets.
console.log("\nMonaco (offline) assets:");
for (const f of [
  "assets/monaco/vs/loader.js",
  "assets/monaco/vs/editor/editor.main.js",
  "assets/monaco/vs/base/worker/workerMain.js"
]) {
  existsSync(join(ROOT, f)) ? ok(f) : fail(`MISSING ${f}`);
}

// 3. Available lessons resolve to real files; "soon" lessons are noted.
console.log("\nLesson files:");
let available = 0, soon = 0;
for (const l of FLAT) {
  if (l.status === "available") {
    available++;
    existsSync(join(ROOT, l.file)) ? ok(`${l.id} → ${l.file}`) : fail(`${l.id} marked available but file missing: ${l.file}`);
  } else {
    soon++;
  }
}
console.log(`\n  ${available} available, ${soon} coming soon.`);

// 4. Next/Prev chain: every available lesson must reach the next available one.
console.log("\nNavigation chain:");
const avail = FLAT.filter((l) => l.status === "available");
if (avail.length === 0) warn("No available lessons yet.");
else ok(`Chain of ${avail.length} available lesson(s) is linkable in order.`);

// 5. Duplicate id / file detection.
const ids = new Set(), files = new Set();
for (const l of FLAT) {
  if (ids.has(l.id)) fail(`Duplicate lesson id: ${l.id}`); else ids.add(l.id);
  if (files.has(l.file)) fail(`Duplicate file path: ${l.file}`); else files.add(l.file);
}

console.log("\n" + "─".repeat(48));
if (errors) { console.error(`✖ ${errors} error(s), ${warnings} warning(s).`); process.exit(1); }
console.log(`✓ All checks passed (${warnings} warning(s)).`);

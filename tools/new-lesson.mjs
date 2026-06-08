#!/usr/bin/env node
/**
 * new-lesson.mjs — scaffold a lesson page from the shared template, keeping the
 * 100+ pages consistent. It looks the lesson up in the manifest by id so the
 * filename, title and part label are always correct.
 *
 * Usage: node tools/new-lesson.mjs 00-02
 *        node tools/new-lesson.mjs 04-13 --force   (overwrite if exists)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
const force = process.argv.includes("--force");
if (!id) { console.error("Usage: node tools/new-lesson.mjs <lesson-id> [--force]"); process.exit(1); }

const win = {};
new Function("window", "self", readFileSync(join(ROOT, "assets/js/lessons.js"), "utf8"))(win, win);
const lesson = win.COURSE_FLAT.find((l) => l.id === id);
if (!lesson) { console.error(`No lesson with id "${id}" in the manifest.`); process.exit(1); }

const out = join(ROOT, lesson.file);
if (existsSync(out) && !force) { console.error(`Already exists: ${lesson.file} (use --force to overwrite)`); process.exit(1); }

const template = readFileSync(join(ROOT, "tools/_lesson-template.html"), "utf8");
const html = template
  .replaceAll("{{LESSON_ID}}", lesson.id)
  .replaceAll("{{TITLE}}", lesson.title)
  .replaceAll("{{EYEBROW}}", `Part ${lesson.partNum} · ${lesson.partTitle} — Lesson ${lesson.id.split("-")[1].replace(/^0/, "")}`)
  .replaceAll("{{LEAD}}", "TODO: write the lesson lead paragraph.");

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`Created ${lesson.file}`);
console.log(`Remember to flip its status to "available" in assets/js/lessons.js.`);

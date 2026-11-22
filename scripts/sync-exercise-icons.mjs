import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

const APP_ROOT = resolve(import.meta.dirname, "..");
const CONCEPT_ROOT = resolve(process.argv[2] || join(APP_ROOT, "../foss-gym-icon-concepts/output"));
const CATALOG_PATH = join(CONCEPT_ROOT, "icon-catalog.json");
const OUTPUT_PATH = join(APP_ROOT, "exercise-icons.js");
const APPROVED_GROUPS = new Set(["chest", "back", "shoulders", "traps", "biceps", "triceps", "forearms"]);

function appSafeSvg(source, exercise) {
  const markerPrefix = `motion-arrow-${exercise.id}`;
  return source
    .replace(/^<\?xml[^>]*>\s*/, "")
    .replace(/<svg[^>]*>/, '<svg class="exercise-specific-art" viewBox="0 0 160 160" aria-hidden="true" focusable="false">')
    .replace(/\s*<title id="title">[\s\S]*?<\/title>/, "")
    .replace(/\s*<desc id="desc">[\s\S]*?<\/desc>/, "")
    .replaceAll("motion-arrow", markerPrefix)
    .replaceAll("#F1F5F2", "var(--text)")
    .replaceAll("#B9F64A", "var(--accent)")
    .replaceAll("#69736D", "var(--muted)")
    .replaceAll("#0B0F0D", "var(--surface-2)")
    .replace(/>\s+</g, "><")
    .trim();
}

const catalog = JSON.parse(await readFile(CATALOG_PATH, "utf8"));
const approved = catalog.filter((exercise) => APPROVED_GROUPS.has(exercise.group));
if (approved.length !== 49) throw new Error(`Expected 49 approved upper-body icons, found ${approved.length}.`);

const entries = [];
for (const exercise of approved) {
  const source = await readFile(join(CONCEPT_ROOT, exercise.file), "utf8");
  const svg = appSafeSvg(source, exercise);
  if (!svg.includes('class="exercise-specific-art"') || !svg.includes(`motion-arrow-${exercise.id}`)) {
    throw new Error(`Could not prepare ${exercise.id}.`);
  }
  entries.push(`    ${JSON.stringify(exercise.id)}: ${JSON.stringify(svg)}`);
}

const output = `(function (global) {
  "use strict";

  const icons = Object.freeze({
${entries.join(",\n")}
  });

  global.FossExerciseIcons = Object.freeze({
    get(id) { return icons[String(id || "")] || ""; },
    has(id) { return Object.prototype.hasOwnProperty.call(icons, String(id || "")); },
    ids() { return Object.keys(icons); }
  });
})(window);\n`;

await writeFile(OUTPUT_PATH, output, "utf8");
console.log(`Synced ${approved.length} approved exercise icons to ${OUTPUT_PATH}.`);

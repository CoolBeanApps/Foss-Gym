import "../equipment.js";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const catalog = globalThis.FossEquipment;
const output = resolve(process.argv[2] || "dist/Foss-Gym-Planet-Fitness-Crunch-Equipment.csv");
const requirements = catalog.allRequirements();
const verifiedDate = "2026-08-13";

function cell(value) {
  return '"' + String(value == null ? "" : value).replaceAll('"', '""') + '"';
}

function sourceFor(chainId, availability, itemId) {
  if (chainId === "planet") {
    if (itemId === "circuit-machines") return catalog.sources.planet_circuit;
    if (availability === "chain") return catalog.sources.planet_clubs;
    return catalog.sources.planet_location;
  }
  if (availability === "chain") return catalog.sources.crunch_equipment;
  if (availability === "common") return catalog.sources.crunch_location;
  return catalog.sources.crunch_signature;
}

function availabilityLabel(value) {
  if (value === "chain") return "Listed by chain";
  if (value === "common") return "Common category or official club example";
  return "Select clubs or premium locations";
}

const rows = [[
  "chain",
  "equipment_id",
  "equipment_name",
  "category",
  "equipment_type",
  "availability_scope",
  "enabled_in_app_default",
  "correlated_exercise_ids",
  "source_url",
  "verified_date",
  "inventory_note"
]];

catalog.items().forEach((item) => {
  [
    ["planet", "Planet Fitness"],
    ["crunch", "Crunch Fitness"]
  ].forEach(([chainId, chainName]) => {
    const availability = item[chainId];
    if (!availability) return;
    const exerciseIds = Object.entries(requirements)
      .filter(([, options]) => options.some((option) => option.includes(item.id)))
      .map(([exerciseId]) => exerciseId)
      .sort();
    rows.push([
      chainName,
      item.id,
      item.name,
      item.category,
      item.kind,
      availabilityLabel(availability),
      availability === "chain" || availability === "common" ? "yes" : "no",
      exerciseIds.join(";"),
      sourceFor(chainId, availability, item.id),
      verifiedDate,
      "Exact brands, quantities, and machines vary by club. Confirm against the location you use."
    ]);
  });
});

await mkdir(dirname(output), { recursive: true });
await writeFile(output, "\ufeff" + rows.map((row) => row.map(cell).join(",")).join("\r\n"), "utf8");
console.log(`Wrote ${rows.length - 1} equipment rows to ${output}`);

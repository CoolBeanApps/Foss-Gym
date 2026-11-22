const assert = require("node:assert/strict");

(async function () {
  await import("../core.js");
  const core = globalThis.FossCore;

  assert.equal(core.round(core.kgToDisplay(100, "lb"), 1), 220.5);
  assert.equal(core.round(core.displayToKg(220.46226218, "lb"), 1), 100);
  assert.equal(core.ordinal(1), "1st");
  assert.equal(core.ordinal(12), "12th");
  assert.equal(core.ordinal(23), "23rd");

  const standards = [0.5, 0.75, 1, 1.25, 1.5];
  assert.equal(core.percentileForRatio(0.5, standards), 20);
  assert.equal(core.percentileForRatio(1, standards), 60);
  assert.equal(core.percentileForRatio(1.5, standards), 95);
  assert.equal(core.round(core.valueForPercentile(60, standards), 2), 1);
  assert.ok(Math.abs(core.percentileForRatio(core.valueForPercentile(72.4, standards), standards) - 72.4) < 0.2);
  assert.equal(core.fossaPoints(72), 7200);
  assert.equal(core.fossaPoints(99), 9900);
  assert.equal(core.rankLift(100, 100, standards).tier, "Intermediate");
  assert.ok(core.rankLift(150, 100, standards).percentile > core.rankLift(100, 100, standards).percentile);
  assert.equal(core.rankReps(20, [5, 10, 20, 30, 40]).percentile, 60);

  assert.deepEqual(
    { prestige: core.rankProgress(1).prestige, level: core.rankProgress(1).level },
    { prestige: 0, level: 1 }
  );
  assert.equal(core.rankProgress(99).prestige, 10);
  assert.equal(core.rankProgress(99).level, 70);
  assert.equal(core.rankProgress(99).title, "Maximum Elite");

  assert.equal(core.progressionSchemes().length, 13);
  assert.equal(core.progressionSchemes().find((scheme) => scheme.id === "tiers").name, "Tier Scale");
  assert.equal(core.progressionForScore(72, "tiers").primary, "S");
  assert.equal(core.progressionSteps("tiers").length, 6);
  assert.equal(core.progressionSteps("tiers").at(-1).primary, "S");
  assert.equal(core.progressionForScore(72, "training").title, "Competitive athlete");
  assert.equal(core.progressionForScore(76, "dragonball").title, "Goku equivalent");
  assert.equal(core.progressionForScore(97, "competitive").primary, "APEX");
  assert.equal(core.progressionForScore(99, "cod").title, "Maximum Elite");
  assert.equal(core.progressionForScore(72, "training").nextAt, 80);
  assert.equal(core.progressionForScore(72, "cod").nextAt, 73);
  assert.equal(core.progressionSteps("training").length, 10);
  assert.equal(core.progressionSteps("training")[0].title, "Untrained");
  assert.equal(core.progressionSteps("training").at(-1).title, "World class");
  assert.ok(core.progressionSteps("cod").length >= 11);
  assert.equal(core.progressionSteps("cod").at(-1).at, 99);
  assert.equal(core.progressionSteps("csgo_knives").length, 20);
  assert.equal(core.progressionSteps("csgo_knives")[0].title, "Navaja Knife");
  assert.equal(core.progressionSteps("csgo_knives").at(-1).title, "Karambit");
  assert.equal(core.progressionForScore(94, "csgo_knives").title, "Butterfly Knife");
  assert.equal(core.progressionForScore(99, "csgo_knives").title, "Karambit");
  assert.equal(core.progressionForScore(98, "ex_scale").primary, 'SHE SAID, "YOU LOOK LIKE MY EX, JUST SMALLER."');
  assert.equal(core.progressionForScore(98, "ex_scale").shortLabel, "JUST SMALLER");
  assert.equal(core.progressionForScore(99, "ex_scale").primary, "YOU ARE THE EX.");
  assert.equal(core.progressionForScore(99, "ex_scale").shortLabel, "THE EX");
  assert.equal(core.progressionForScore(99, "ex_scale").schemeName, "Infinite Ammo");
  assert.equal(core.progressionSteps("baki").length, 11);
  assert.equal(core.progressionSteps("baki")[0].primary, "SUEDO");
  assert.equal(core.progressionSteps("baki")[0].at, 100);
  assert.equal(core.progressionSteps("baki").at(-1).primary, "YUJIRO");
  assert.equal(core.progressionForScore(72, "baki").primary, "HUMAN");
  assert.equal(core.progressionForScore(72, "baki").title, "Below Suedo");
  assert.equal(core.progressionForScore(72, "baki").nextTitle, "SUEDO · Card pinch");
  assert.equal(core.progressionTargetPercentile(100, "baki"), 100);
  assert.equal(core.bakiPoints(72), 373248000000000);
  assert.equal(core.bakiPoints(99), 970299000000000);
  assert.equal(core.bakiPoints(100), 1000000000000000);

  assert.equal(core.calculateBMI(81.6466, 175.26), 26.6);
  assert.equal(core.bmiCategory(22), "Healthy weight");
  assert.equal(core.bmiCategory(31), "Obesity, class 1");
  const tapeEstimate = core.estimateTapeBodyFat("male", 180, 90, 40, 0);
  assert.ok(tapeEstimate > 5 && tapeEstimate < 40);

  console.log("Foss Gym core tests passed");
})().catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});

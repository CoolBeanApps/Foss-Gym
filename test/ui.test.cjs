const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const coreSource = fs.readFileSync(path.join(root, "core.js"), "utf8");
const equipmentSource = fs.readFileSync(path.join(root, "equipment.js"), "utf8");
const guidesSource = fs.readFileSync(path.join(root, "guides.js"), "utf8");
const exerciseIconsSource = fs.readFileSync(path.join(root, "exercise-icons.js"), "utf8");
const recordsSource = fs.readFileSync(path.join(root, "records.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "main.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const mainActivitySource = fs.readFileSync(path.join(root, "android", "MainActivity.java"), "utf8");
const nativePrepareSource = fs.readFileSync(path.join(root, "scripts", "prepare-nitron.mjs"), "utf8");
const widgetInfoSources = ["dashboard", "stats", "body", "workout"].map((name) =>
  fs.readFileSync(path.join(root, "android", "res", "xml", "widget_" + name + "_info.xml"), "utf8")
);

const dom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss.local/",
  pretendToBeVisual: true
});

const window = dom.window;
window.scrollTo = function () {};
window.__openedUrls = [];
window.open = function (url) {
  window.__openedUrls.push(url);
  return null;
};
window.__vibrations = [];
window.navigator.vibrate = function (pattern) {
  window.__vibrations.push(pattern);
  return true;
};
window.__canvasArcRadii = [];
window.HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    fill() {},
    stroke() {},
    arc(x, y, radius) { window.__canvasArcRadii.push(radius); },
    createLinearGradient() { return { addColorStop() {} }; },
    setLineDash() {},
    set strokeStyle(value) {},
    set fillStyle(value) {},
    set lineWidth(value) {},
    set lineCap(value) {},
    set lineJoin(value) {}
  };
};

window.eval(coreSource);
window.eval(equipmentSource);
window.eval(guidesSource);
window.eval(exerciseIconsSource);
window.eval(recordsSource);
window.eval(appSource);

assert.equal(window.document.title, "Foss Gym");
assert.equal(window.document.querySelector(".brand-name").textContent, "FOSS GYM");
assert.equal(window.document.querySelector(".topbar #activeLocationSelect"), null);
assert.ok(window.document.querySelector("#workoutsPage .workout-location-control #activeLocationSelect"));
assert.equal(window.document.querySelector("#workoutLocationControl > span"), null);
assert.equal(window.document.querySelector(".workout-heading-actions").firstElementChild.id, "workoutLocationControl");
assert.equal(window.document.querySelector(".workout-heading-actions").lastElementChild.id, "newPlanButton");
assert.equal(window.document.querySelector("#settingsButton svg circle").getAttribute("cx"), "12");
assert.equal(window.document.querySelectorAll("#muscleGrid .muscle-card").length, 15);
assert.equal(window.document.querySelectorAll("#planList .plan-choice-card").length, 1);
assert.equal(window.document.querySelectorAll(".bottom-nav [data-tab]").length, 5);
assert.ok(window.document.querySelector('.bottom-nav [data-tab="cardio"]'));
assert.equal(window.document.querySelectorAll(".anatomical-human").length, 2);
assert.equal(window.document.querySelectorAll(".muscle[data-group=forearms]").length, 4);
assert.match(window.document.querySelector('.muscle[data-group="forearms"][data-side="left"]').getAttribute("d"), /l-7 47 19 12/);
assert.match(window.document.querySelector('.muscle[data-group="quads"][data-side="left"]').getAttribute("d"), /l16 78 30-28/);
assert.match(window.document.querySelector('.muscle[data-group="core"][data-side="left"]').getAttribute("d"), /M128 334l20-7/);
assert.match(window.document.querySelector('.muscle[data-group="biceps"][data-side="left"]').getAttribute("d"), /c3 16 16 21 28 8/);
[
  "chest", "back", "shoulders", "traps", "biceps", "triceps", "forearms",
  "obliques", "lower-back", "quads", "hamstrings", "adductors", "glutes", "calves"
].forEach((group) => {
  const shapes = Array.from(window.document.querySelectorAll('.muscle[data-group="' + group + '"]'));
  assert.ok(shapes.length >= 2, group + " must render on both sides");
  assert.ok(shapes.some((shape) => shape.dataset.side === "left"), group + " must have an explicit left path");
  assert.ok(shapes.some((shape) => shape.dataset.side === "right"), group + " must have an explicit right path");
  assert.ok(shapes.every((shape) => !shape.hasAttribute("transform")), group + " must not rely on mirrored SVG transforms");
});
assert.ok(window.document.querySelectorAll("#exercisePickerList [data-pick-exercise]").length >= 100);
assert.equal(window.FossExerciseGuides.ids().length, 120);
assert.equal(window.FossExerciseIcons.ids().length, 49);
assert.ok(window.FossExerciseIcons.has("bench-press"));
assert.ok(window.FossExerciseIcons.has("hand-gripper"));
assert.equal(window.FossExerciseIcons.has("cable-crunch"), false);
assert.match(window.FossExerciseIcons.get("bench-press"), /class="exercise-specific-art"/);
assert.match(window.FossExerciseIcons.get("bench-press"), /var\(--accent\)/);
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="bench-press"] .exercise-specific-art'));
Array.from(window.document.querySelectorAll("#exercisePickerList [data-pick-exercise]")).forEach((row) => {
  assert.ok(window.FossExerciseGuides.has(row.dataset.pickExercise), row.dataset.pickExercise + " must have a verified guide");
});
window.FossExerciseGuides.ids().forEach((exerciseId) => {
  const guide = window.FossExerciseGuides.get(exerciseId);
  assert.ok(guide.description.trim(), exerciseId + " guide needs a description");
  assert.equal(guide.steps.length, 4, exerciseId + " guide needs four steps");
  assert.ok(guide.steps.every((step) => typeof step === "string" && step.trim()), exerciseId + " guide steps must be complete");
  assert.ok(guide.tip.trim(), exerciseId + " guide needs a tip");
});
assert.match(window.FossExerciseGuides.get("pike-push-up").steps.join(" "), /hips are high|hips high/i);
assert.doesNotMatch(window.FossExerciseGuides.get("pike-push-up").steps.join(" "), /straight line from head to heel/i);
assert.match(window.FossExerciseGuides.get("prone-y-raise").steps.join(" "), /thumbs upward|shoulder blades/i);
assert.doesNotMatch(guidesSource, /required by the variation|set your ribs|intended angle|stable bottom position/i);
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="hand-gripper"]'));
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="leg-press"]'));
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="calf-press"]'));
assert.ok(window.FossExerciseGuides.has("calf-press"));
assert.deepEqual(Array.from(window.FossEquipment.requirements("calf-press")[0]), ["leg-press-machine"]);
assert.equal(window.FossWorldRecords.lookup("bench-press", "male").valueKg, 291.5);
assert.equal(window.FossWorldRecords.lookup("bench-press", "female").valueKg, 167);
assert.equal(window.FossWorldRecords.lookup("pull-up", "male").valueReps, 1224);
assert.equal(window.FossWorldRecords.lookup("pull-up", "female"), null);
assert.equal(window.FossWorldRecords.lookup("chin-up", "male").valueReps, 612);
assert.equal(window.FossWorldRecords.lookup("bodyweight-squat", "male").valueReps, 1100);
assert.equal(window.FossWorldRecords.status("leg-press", "male").standardized, false);
[
  "straight-leg-sit-up", "toe-touch", "flutter-kick", "scissor-kick", "shoulder-tap",
  "plank-jack", "ab-wheel-rollout", "windshield-wiper", "dragon-flag", "cross-body-mountain-climber"
].forEach((exerciseId) => assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="' + exerciseId + '"]')));
assert.equal(window.document.querySelectorAll("#workoutFilterStrip [data-workout-filter]").length, 3);
assert.equal(window.document.querySelectorAll("#exerciseFilterStrip [data-exercise-filter]").length, 3);
assert.equal(window.document.querySelector('#workoutFilterStrip [data-workout-filter="bodyweight"]'), null);
assert.equal(window.document.querySelector('#exerciseFilterStrip [data-exercise-filter="weighted"]'), null);
assert.equal(window.document.querySelectorAll("#workoutGroupFilter option").length, 16);
assert.equal(window.document.querySelectorAll("#exerciseGroupFilter option").length, 16);
assert.ok(window.document.querySelector("#planList .plan-tags"));
assert.match(stylesSource, /\.exercise-info-button\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/s);
assert.match(stylesSource, /\.tag-muscle[^{]*\{[^}]*color:\s*#c4aaff/s);
assert.match(stylesSource, /\.tag-no-equipment[^{]*\{[^}]*color:\s*#79eb84/s);
assert.match(stylesSource, /\.tag-needs-equipment[^{]*\{[^}]*color:\s*#7bbaff/s);
assert.match(stylesSource, /\.tag-bodyweight[^{]*\{[^}]*color:\s*#54e4d1/s);
assert.match(stylesSource, /\.tag-weighted[^{]*\{[^}]*color:\s*#ffd96f/s);
assert.match(stylesSource, /\.workout-location-control select\s*\{[^}]*height:\s*44px/s);
assert.equal(window.document.getElementById("iconDrawModes"), null);
assert.equal(window.document.getElementById("drawIconToolButton"), null);
assert.equal(window.document.getElementById("iconStrokeWidth").value, "4");
assert.deepEqual(Array.from(window.document.querySelectorAll(".icon-draw-tools button")).map((button) => button.id), [
  "undoIconStrokeButton", "redoIconStrokeButton", "clearIconDrawingButton", "eraseIconToolButton", "saveIconDrawingButton"
]);
assert.doesNotMatch(appSource, /isPenEraserEvent|S Pen button/);
assert.equal(window.document.querySelector('#exerciseInfoModal .primary-button[data-close="exerciseInfoModal"]'), null);
assert.match(stylesSource, /svg\.drawn-plan-icon\s*\{[^}]*width:\s*100%\s*!important;[^}]*height:\s*100%\s*!important;/s);
assert.equal(window.document.querySelector("#cooldownDock > .cooldown-title"), null);
assert.equal(window.document.querySelectorAll("#cooldownDock [data-rest-seconds]").length, 0);
assert.equal(window.document.getElementById("cooldownDock").children.length, 2);
assert.equal(window.document.querySelector("#cooldownDock .cooldown-word").textContent, "Cooldown");
assert.equal(window.document.querySelector("#cooldownDock .timer-word").textContent, "Timer");
assert.ok(window.document.getElementById("closeCooldownTimer"));
assert.ok(window.document.getElementById("showCooldownTimer"));
assert.equal(window.document.querySelectorAll("#cooldownEditControls [data-cooldown-seconds]").length, 3);
assert.deepEqual(Array.from(window.document.querySelectorAll("#cooldownEditControls [data-cooldown-seconds]"), (button) => button.textContent), ["30", "60", "90"]);
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "60");
assert.equal(window.document.getElementById("restTimerStatus").textContent, "TAP TO START");
assert.match(stylesSource, /\.cooldown-readout\s*\{[^}]*border:\s*2px solid #050705/s);
assert.match(stylesSource, /\.cooldown-dock\.timer-position-bottom-right\s*\{[^}]*right:\s*10px/s);
assert.match(stylesSource, /\/\* Foss Gym 1\.15 \*\/[\s\S]*?\.cooldown-dock\s*\{[^}]*width:\s*138px;[^}]*height:\s*138px;/s);
assert.match(appSource, /setTimeout\(function \(\) \{[\s\S]*?cooldownPositioning = false;[\s\S]*?\}, 5000\)/s);
assert.match(appSource, /cooldownHoldTimer = setTimeout\(function \(\) \{\s*cooldownDragging = false;\s*enterCooldownPositioning\(\);/s);
assert.match(mainActivitySource, /ACTION_RESET_TIMER\s*=\s*"com\.foss\.workouts\.RESET_COOLDOWN"/);
assert.match(mainActivitySource, /setLockscreenVisibility\(Notification\.VISIBILITY_PUBLIC\)/);
assert.match(mainActivitySource, /new long\[\]\{0L, 180L, 120L, 180L, 120L, 180L\}/);
assert.match(mainActivitySource, /\.addAction\([^\n]*"Reset"/);
assert.match(stylesSource, /\.compact-filter-strip > button,[\s\S]*?font-size:\s*11px/s);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="no_equipment"]').click();
assert.match(window.document.getElementById("planList").textContent, /No matching workouts/);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="equipment"]').click();
assert.equal(window.document.querySelectorAll("#planList .plan-choice-card").length, 1);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="all"]').click();

window.document.querySelector('#exerciseFilterStrip [data-exercise-filter="no_equipment"]').click();
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="wall-push-up"]'));
assert.equal(window.document.querySelector('#exercisePickerList [data-pick-exercise="bench-press"]'), null);
assert.equal(window.document.querySelector('#exercisePickerList [data-pick-exercise="pull-up"]'), null);
Array.from(window.document.querySelectorAll("#exercisePickerList [data-pick-exercise]")).forEach((row) => {
  assert.ok(row.querySelector(".tag-no-equipment"));
  assert.ok(row.querySelector(".tag-bodyweight"));
  assert.equal(row.querySelector(".tag-weighted"), null);
});
window.document.getElementById("exerciseGroupFilter").value = "core";
window.document.getElementById("exerciseGroupFilter").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="flutter-kick"]'));
assert.equal(window.document.querySelector('#exercisePickerList [data-pick-exercise="wall-push-up"]'), null);
window.document.getElementById("exerciseGroupFilter").value = "all";
window.document.getElementById("exerciseGroupFilter").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.querySelector('#exerciseFilterStrip [data-exercise-filter="equipment"]').click();
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="bench-press"]'));
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise="pull-up"]'));
assert.equal(window.document.querySelector('#exercisePickerList [data-pick-exercise="wall-push-up"]'), null);
window.document.querySelector('#exerciseFilterStrip [data-exercise-filter="all"]').click();
assert.ok(window.document.getElementById("setupModal").classList.contains("open"));
assert.ok(!window.document.getElementById("setupProfileStep").classList.contains("hidden"));
assert.ok(window.document.getElementById("setupLocationStep").classList.contains("hidden"));
assert.ok(window.document.getElementById("setupPhysiqueStep").classList.contains("hidden"));
assert.equal(window.document.getElementById("setupStepLabel").textContent, "STEP 1 OF 3");
assert.ok(window.document.getElementById("setupWeight").compareDocumentPosition(window.document.getElementById("setupHeightFeet")) & window.Node.DOCUMENT_POSITION_FOLLOWING);
assert.ok(window.document.getElementById("setupHeightFeet").compareDocumentPosition(window.document.getElementById("setupStandard")) & window.Node.DOCUMENT_POSITION_FOLLOWING);
assert.equal(window.document.getElementById("setupHeight"), null);
assert.ok(window.document.getElementById("setupHeightFeet"));
assert.ok(window.document.getElementById("setupHeightInches"));
assert.deepEqual(Array.from(window.document.querySelectorAll("#setupLocations [data-setup-location]"), (button) => button.dataset.setupLocation), [
  "planet", "crunch", "apartment", "home"
]);
assert.equal(window.document.querySelectorAll("#setupEquipmentPreference [data-value]").length, 3);
assert.equal(window.FossEquipment.items().length, 70);
assert.ok(window.FossEquipment.defaultEquipment("planet").length >= 40);
assert.ok(window.FossEquipment.defaultEquipment("crunch").length >= 50);
assert.deepEqual(Array.from(window.FossEquipment.requirements("bench-press")[1]), ["smith-machine", "flat-bench"]);

window.document.getElementById("setupWeight").value = "180";
window.document.getElementById("setupHeightFeet").value = "6";
window.document.getElementById("setupHeightInches").value = "2";
window.document.querySelector('#setupUnits [data-value="kg"]').click();
assert.ok(window.document.getElementById("setupHeightImperial").classList.contains("hidden"));
assert.ok(Math.abs(Number(window.document.getElementById("setupHeightCm").value) - 188) < 0.2);
window.document.querySelector('#setupUnits [data-value="lb"]').click();
assert.equal(window.document.getElementById("setupHeightFeet").value, "6");
assert.ok(Math.abs(Number(window.document.getElementById("setupHeightInches").value) - 2) < 0.1);
window.document.getElementById("setupNextButton").click();
assert.ok(window.document.getElementById("setupProfileStep").classList.contains("hidden"));
assert.ok(!window.document.getElementById("setupLocationStep").classList.contains("hidden"));
assert.ok(window.document.getElementById("setupPhysiqueStep").classList.contains("hidden"));
assert.equal(window.document.getElementById("setupStepLabel").textContent, "STEP 2 OF 3");
assert.match(window.document.getElementById("setupTitle").textContent, /Where do you train/);
assert.match(stylesSource, /\.setup-location-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
assert.match(stylesSource, /\.setup-preference button\.active\[data-value="machines"\],[\s\S]*?background:\s*var\(--accent\)/s);
assert.match(stylesSource, /\.setup-preference button\.active\[data-value="none"\],[\s\S]*?background:\s*#3b423e/s);
window.document.querySelector('[data-setup-location="planet"]').click();
window.document.querySelector('[data-setup-location="crunch"]').click();
assert.equal(window.document.querySelectorAll("#setupEquipmentSummaries [data-setup-equipment]").length, 2);
window.document.getElementById("setupLocationNextButton").click();
assert.ok(window.document.getElementById("setupLocationStep").classList.contains("hidden"));
assert.ok(!window.document.getElementById("setupPhysiqueStep").classList.contains("hidden"));
assert.equal(window.document.getElementById("setupStepLabel").textContent, "STEP 3 OF 3");
assert.match(window.document.getElementById("setupTitle").textContent, /ideal physique/i);
assert.equal(window.document.querySelectorAll("#setupPhysiqueSelect option").length, 9);
assert.equal(window.document.querySelector('#setupPhysiqueSelect option[value="lean_af"]').textContent, "Lean AF");
assert.equal(window.document.querySelector('#setupPhysiqueSelect option[value="guts"]').textContent, "Guts");
assert.equal(window.document.querySelector('#setupPhysiqueSelect option[value="baki"]').textContent, "Baki logic (gag)");
window.document.getElementById("setupPhysiqueSelect").value = "guts";
window.document.getElementById("setupPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(window.document.getElementById("setupPhysiqueName").textContent, "Guts");
window.document.getElementById("setupPhysiqueSelect").value = "golden";
window.document.getElementById("finishSetupButton").click();
assert.ok(!window.document.getElementById("setupModal").classList.contains("open"));
let saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.ok(Math.abs(saved.profile.heightCm - 187.96) < 0.02);
assert.equal(saved.settings.progression, "training");
assert.equal(saved.settings.pointLabel, "xp");
assert.equal(saved.settings.weightedScoreMode, "heaviest_set");
assert.equal(saved.settings.historyBundleWindow, "day");
assert.equal(saved.settings.recentTrainingWindowDays, 7);
assert.equal(saved.settings.weightGoalKg, null);
assert.equal(saved.settings.weightGoalDate, "");
assert.deepEqual(saved.settings.cardioGoals, {});
assert.equal(saved.settings.weightDisplay.currentWeight, true);
assert.equal(saved.settings.weightDisplay.dailyRate, false);
assert.ok(saved.settings.donationReminderNextAt > Date.now() + 29 * 86400000);
assert.equal(saved.settings.rankTargetMode, "training");
assert.equal(saved.settings.proportionalPhysique, "golden");
assert.equal(saved.settings.proportionalMassBias, 0);
assert.deepEqual(saved.settings.availableLocations, ["planet", "crunch"]);
assert.equal(saved.settings.activeLocation, "planet");
assert.equal(saved.settings.equipmentPreference, "none");
assert.equal(saved.settings.locationSetupComplete, true);
assert.equal(window.document.querySelectorAll("#activeLocationSelect option").length, 2);
window.document.getElementById("activeLocationSelect").value = "crunch";
window.document.getElementById("activeLocationSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).settings.activeLocation, "crunch");

window.document.getElementById("settingsButton").click();
assert.ok(window.document.getElementById("settingsModal").classList.contains("open"));
assert.ok(window.document.getElementById("progressionDropdown").classList.contains("hidden"));
assert.equal(window.document.querySelectorAll("#weightedScoreModeSetting [data-value]").length, 3);
assert.equal(window.document.querySelectorAll("#rankTargetModeSetting [data-value]").length, 2);
assert.equal(window.document.querySelectorAll("#cooldownTimerSetting [data-value]").length, 3);
assert.equal(window.document.querySelectorAll("#historyBundleWindow option").length, 5);
assert.equal(window.document.querySelectorAll("#recentTrainingWindow option").length, 6);
assert.equal(window.document.querySelectorAll("#proportionalPhysiqueSelect option").length, 9);
assert.match(stylesSource, /settings-card\.scoring-mode-card\.progress-target-card[\s\S]*?font-size:\s*16px/);
assert.match(stylesSource, /settings-card\.scoring-mode-card\.weighted-score-card[\s\S]*?font-size:\s*16px/);
assert.match(stylesSource, /select option,[\s\S]*?background-color:\s*#111713;[\s\S]*?color:\s*#f6f8f6/);
assert.match(mainActivitySource, /setTheme\(android\.R\.style\.Theme_Material_NoActionBar\);/);
window.document.querySelector('#standardSetting [data-value="female"]').click();
assert.ok(window.document.getElementById("confirmDialog").classList.contains("open"));
assert.match(window.document.getElementById("confirmMessage").textContent, /ma'am and stuff/i);
window.document.getElementById("confirmCancel").click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).profile.standard, "male");
window.document.querySelector('#standardSetting [data-value="female"]').click();
window.document.getElementById("confirmOkay").click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).profile.standard, "female");
window.document.querySelector('#standardSetting [data-value="male"]').click();
assert.match(window.document.getElementById("confirmMessage").textContent, /sir and stuff/i);
window.document.getElementById("confirmOkay").click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).profile.standard, "male");
assert.ok(window.document.getElementById("openProportionalTargetsButton"));
window.document.getElementById("openProportionalTargetsButton").click();
assert.ok(window.document.getElementById("proportionalTargetsModal").classList.contains("open"));
assert.equal(window.document.querySelectorAll("#proportionalPreviewGrid .proportional-preview-card").length, 12);
assert.equal(window.document.querySelectorAll("#proportionalPreviewGrid .measurement-target.pending").length, 0);
assert.match(window.document.getElementById("proportionalPreviewGrid").textContent, /BODY FAT/);
assert.equal(window.document.getElementById("proportionalMinimumLabel").textContent, "130 lb");
assert.equal(window.document.getElementById("proportionalMaximumLabel").textContent, "205 lb");
assert.equal(window.document.getElementById("proportionalScalePreset"), null);
assert.equal(window.document.getElementById("proportionalScaleCustom"), null);
assert.equal(window.document.getElementById("proportionalScaleMinimum"), null);
assert.equal(window.document.getElementById("proportionalScaleMaximum"), null);
assert.equal(Number(window.document.getElementById("proportionalMassBias").min), -28);
assert.equal(Number(window.document.getElementById("proportionalMassBias").max), 14);
assert.match(window.document.getElementById("proportionalReferenceMarkerLabel").textContent, /Current mass/);
window.document.getElementById("proportionalPhysiqueSelect").value = "guts";
window.document.getElementById("proportionalPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.match(window.document.getElementById("proportionalReferenceMarkerLabel").textContent, /Guts reference/);
assert.match(window.document.getElementById("proportionalPreviewGrid").textContent, /9\.5%/);
window.document.getElementById("proportionalPhysiqueSelect").value = "golden";
window.document.getElementById("proportionalPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("addCustomPhysiqueButton").click();
assert.ok(window.document.getElementById("customPhysiqueModal").classList.contains("open"));
window.document.getElementById("customPhysiqueName").value = "Hero Ratio";
window.document.querySelector('[data-custom-ratio="shoulderCm"]').value = "1.75";
window.document.getElementById("saveCustomPhysiqueButton").click();
const customRatioState = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(customRatioState.customPhysiques.length, 1);
assert.equal(customRatioState.customPhysiques[0].name, "Hero Ratio");
assert.equal(customRatioState.customPhysiques[0].ratios.shoulderCm, 1.75);
assert.equal(customRatioState.settings.proportionalPhysique, customRatioState.customPhysiques[0].id);
assert.equal(window.document.querySelectorAll("#proportionalPhysiqueSelect option").length, 10);
assert.ok(window.document.querySelector('[data-edit-custom-physique="' + customRatioState.customPhysiques[0].id + '"]'));
window.document.getElementById("proportionalPhysiqueSelect").value = "golden";
window.document.getElementById("proportionalPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.querySelector('#proportionalTargetsModal [data-close="proportionalTargetsModal"]').click();
assert.ok(window.document.getElementById("settingsModal").classList.contains("open"));
assert.ok(window.document.getElementById("donateButton"));
assert.equal(window.document.querySelectorAll("#donationReminder").length, 1);
assert.equal(window.document.querySelector("#donationReminderButton span").textContent, "We run on donations, tap here to donate!");
assert.ok(window.document.getElementById("donationReminder").classList.contains("hidden"));
assert.match(stylesSource, /\.donation-reminder-message span\s*\{[^}]*-webkit-line-clamp:\s*2;/s);
assert.match(stylesSource, /\.donation-reminder-message strong\s*\{[^}]*background:\s*#55e870;/s);
assert.ok(window.document.getElementById("openWeightGoalButton"));
assert.ok(window.document.getElementById("openCardioGoalSettingsButton"));
assert.ok(window.document.getElementById("openDeveloperNoteButton"));
assert.ok(window.document.getElementById("openCopyrightButton"));
assert.match(window.document.querySelector(".widget-help-card").textContent, /Long-press.*Widgets.*Next plan/is);
[
  "Foss Gym Dashboard", "Foss Gym Top Stats", "Foss Gym Body Metrics", "Foss Gym Workout"
].forEach((label) => assert.match(nativePrepareSource, new RegExp(label)));
widgetInfoSources.forEach((source) => assert.match(source, /android:description="@string\/widget_/));
window.document.getElementById("donateButton").click();
assert.ok(window.document.getElementById("donationModal").classList.contains("open"));
assert.equal(window.document.getElementById("monthlyDonationAmount").textContent, "$1.00");
const monthlyDonationUrls = [
  "https://buy.stripe.com/9B6eVd9NM4dKgrr8d6f7i07",
  "https://donate.stripe.com/eVq4gz5xw4dK3EF792f7i08",
  "https://donate.stripe.com/bJedR94tsaC82AB792f7i09",
  "https://donate.stripe.com/28E7sLgcaaC8ejjgJCf7i0a",
  "https://donate.stripe.com/dRmaEXcZY8u02ABctmf7i0b"
];
monthlyDonationUrls.forEach((url, index) => {
  window.document.getElementById("monthlyDonationSlider").value = String(index);
  window.document.getElementById("monthlyDonationSlider").dispatchEvent(new window.Event("input", { bubbles: true }));
  window.document.getElementById("donationSubmitButton").click();
  assert.equal(window.__openedUrls.at(-1), url);
  assert.ok(mainActivitySource.includes(url));
});
window.document.querySelector('#donationTabs [data-donation-tab="one-time"]').click();
window.document.getElementById("donationSubmitButton").click();
assert.equal(window.__openedUrls.at(-1), "https://donate.stripe.com/7sYdR97FE4dK4IJdxqf7i06");
assert.match(mainActivitySource, /public void openDonation\(final String option\)/);
window.document.querySelector('#donationModal [data-close="donationModal"]').click();
window.document.getElementById("openDeveloperNoteButton").click();
assert.ok(window.document.getElementById("developerNoteModal").classList.contains("open"));
assert.match(window.document.getElementById("developerNoteModal").textContent, /No unnecessary complexity.*No tracking everything you do/is);
window.document.querySelector('#developerNoteModal [data-close="developerNoteModal"]').click();
window.document.getElementById("openCopyrightButton").click();
assert.ok(window.document.getElementById("copyrightModal").classList.contains("open"));
assert.match(window.document.getElementById("copyrightModal").textContent, /cannot run ads/i);
assert.match(window.document.getElementById("copyrightModal").textContent, /cannot spy on the user/i);
assert.match(window.document.getElementById("copyrightModal").textContent, /must keep the Donate button/i);
window.document.querySelector('#copyrightModal [data-close="copyrightModal"]').click();
window.document.getElementById("historyBundleWindow").value = "60";
window.document.getElementById("historyBundleWindow").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).settings.historyBundleWindow, "60");
window.document.getElementById("historyBundleWindow").value = "day";
window.document.getElementById("historyBundleWindow").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("proportionalPhysiqueSelect").value = "arnold";
window.document.getElementById("proportionalPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).settings.proportionalPhysique, "arnold");
assert.match(window.document.getElementById("proportionalTargetSettingName").textContent, /Arnold/);
assert.match(window.document.getElementById("proportionalReferenceMarkerLabel").textContent, /Arnold reference/);
window.document.getElementById("proportionalPhysiqueSelect").value = "golden";
window.document.getElementById("proportionalPhysiqueSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.ok(window.document.querySelector('#cooldownTimerSetting [data-value="60"].active'));
window.document.querySelector('#cooldownTimerSetting [data-value="90"]').click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).settings.restSeconds, 90);
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "90");
assert.ok(window.document.querySelector(".scoring-readme"));
assert.ok(window.document.getElementById("exportDataButton"));
assert.ok(window.document.getElementById("importDataButton"));
assert.equal(window.document.querySelectorAll("#locationSettings .settings-location-card").length, 4);
assert.equal(window.document.querySelectorAll("#equipmentPreferenceSetting [data-value]").length, 3);
assert.ok(window.document.querySelector("#themeOptions [data-custom-color]"));
assert.match(stylesSource, /\.custom-color-option > span\s*\{[^}]*conic-gradient[^}]*box-shadow:\s*none/s);
assert.doesNotMatch(stylesSource, /\.custom-color-option > span\s*\{[^}]*linear-gradient/s);
assert.equal(window.document.getElementById("colorHueSlider").type, "range");
assert.ok(window.document.getElementById("colorSpectrum"));
assert.ok(window.document.querySelector('#showExerciseTagsSetting [data-value="true"].active'));
window.document.querySelector('#showExerciseTagsSetting [data-value="false"]').click();
assert.equal(window.document.querySelector("#planList .plan-tags"), null);
assert.equal(window.document.querySelector("#exercisePickerList .library-tags"), null);
window.document.querySelector('#showExerciseTagsSetting [data-value="true"]').click();
assert.ok(window.document.querySelector("#planList .plan-tags"));
window.document.getElementById("progressionSettingButton").click();
assert.equal(window.document.querySelectorAll("#progressionSelect option").length, 13);
assert.ok(window.document.querySelector('#progressionSelect option[value="csgo_knives"]'));
assert.ok(window.document.querySelector('#progressionSelect option[value="ex_scale"]'));
assert.ok(window.document.querySelector('#progressionSelect option[value="baki"]'));
assert.equal(window.document.querySelector('#progressionSelect option[value="tiers"]').textContent, "Tier Scale");
assert.equal(window.document.querySelectorAll("#pointLabelSelect option").length, 5);
assert.match(window.document.getElementById("pointLabelPreview").textContent, /XP$/);
window.document.getElementById("progressionSelect").value = "baki";
window.document.getElementById("progressionSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.ok(window.document.body.classList.contains("baki-mode"));
assert.match(window.document.getElementById("progressionSettingValue").textContent, /HUMAN/);
assert.match(window.document.getElementById("progressionDescription").textContent, /character ranks are never awarded/i);
assert.match(window.document.getElementById("pointLabelPreview").textContent, /157,464,000,000,000 XP$/);
window.document.getElementById("progressionSelect").value = "tiers";
window.document.getElementById("progressionSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("pointLabelSelect").value = "custom";
window.document.getElementById("pointLabelSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("customPointLabelInput").value = "Iron";
window.document.getElementById("customPointLabelInput").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.match(window.document.getElementById("pointLabelPreview").textContent, /Iron$/);
window.document.getElementById("pointLabelSelect").value = "xp";
window.document.getElementById("pointLabelSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.querySelector('[data-theme-choice="electric"]').click();
window.document.querySelector('[data-logo-choice="barbell"]').click();
window.document.querySelector("#themeOptions [data-custom-color]").click();
assert.ok(window.document.getElementById("colorPickerModal").classList.contains("open"));
window.document.getElementById("customAccentHex").value = "#22CC88";
window.document.getElementById("customAccentHex").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("saveCustomAccentButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.customAccent, "#22CC88");
assert.equal(saved.settings.useCustomAccent, true);
assert.equal(window.document.body.style.getPropertyValue("--accent"), "#22CC88");
window.document.querySelector('[data-theme-choice="electric"]').click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.progression, "tiers");
assert.equal(saved.settings.pointLabel, "xp");
assert.equal(saved.settings.theme, "electric");
assert.equal(saved.settings.logo, "barbell");
assert.equal(saved.settings.useCustomAccent, false);
assert.equal(window.document.body.dataset.theme, "electric");
assert.ok(window.document.querySelector(".brand-mark svg"));

window.document.getElementById("appTitleInput").value = "Iron Den";
window.document.getElementById("appTitleInput").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.getElementById("appTitleInput").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(window.document.querySelector(".brand-name").textContent, "IRON DEN");
assert.equal(window.document.title, "Iron Den");
window.document.getElementById("drawAppMarkButton").click();
assert.equal(window.document.getElementById("iconDrawEyebrow").textContent, "APP MARK");
assert.ok(window.document.getElementById("settingsModal").classList.contains("open"));
assert.ok(window.document.getElementById("iconDrawModal").classList.contains("open"));
assert.match(stylesSource, /#iconDrawModal\s*\{[^}]*z-index:\s*170;/s);
const appMarkCanvas = window.document.getElementById("iconDrawCanvas");
appMarkCanvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 300, right: 300, bottom: 300 });
appMarkCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 30, clientY: 150 }));
appMarkCanvas.dispatchEvent(new window.MouseEvent("pointermove", { bubbles: true, clientX: 270, clientY: 150 }));
appMarkCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 270, clientY: 150 }));
window.document.getElementById("saveIconDrawingButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.logo, "custom");
assert.ok(saved.settings.customAppMark.length);
assert.ok(window.document.getElementById("drawAppMarkButton").classList.contains("active"));
window.document.querySelector('[data-logo-choice="barbell"]').click();

window.document.getElementById("addCustomExerciseButton").click();
window.document.getElementById("customExerciseName").value = "Plate Pinch";
window.document.querySelector('[data-custom-exercise-group="forearms"]').click();
window.document.querySelector('[data-custom-exercise-group="biceps"]').click();
window.document.querySelector('[data-custom-exercise-group="chest"]').click();
assert.match(window.document.getElementById("customExerciseWeighting").textContent, /50%/);
window.document.querySelector('[data-draw-exercise-icon]').click();
assert.equal(window.document.getElementById("iconDrawEyebrow").textContent, "EXERCISE ICON");
window.document.getElementById("iconStrokeWidth").value = "3";
window.document.getElementById("iconStrokeWidth").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.equal(window.document.getElementById("iconStrokeWidthValue").value, "3");
const exerciseIconCanvas = window.document.getElementById("iconDrawCanvas");
exerciseIconCanvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 300, right: 300, bottom: 300 });
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 45, clientY: 60 }));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointermove", { bubbles: true, clientX: 225, clientY: 210 }));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 225, clientY: 210 }));
assert.equal(window.document.getElementById("redoIconStrokeButton").disabled, true);
window.document.getElementById("undoIconStrokeButton").click();
assert.equal(window.document.getElementById("redoIconStrokeButton").disabled, false);
window.document.getElementById("redoIconStrokeButton").click();
window.document.getElementById("saveIconDrawingButton").click();
assert.ok(window.document.querySelector('[data-draw-exercise-icon].active .drawn-plan-icon'));
window.document.querySelector('[data-draw-exercise-icon]').click();
window.document.getElementById("iconStrokeWidth").value = "6";
window.document.getElementById("iconStrokeWidth").dispatchEvent(new window.Event("input", { bubbles: true }));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 60, clientY: 240 }));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointermove", { bubbles: true, clientX: 240, clientY: 60 }));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 240, clientY: 60 }));
window.document.getElementById("eraseIconToolButton").click();
assert.ok(window.document.getElementById("eraseIconToolButton").classList.contains("active"));
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 150, clientY: 150 }));
assert.equal(window.__canvasArcRadii.at(-1), 18);
exerciseIconCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 150, clientY: 150 }));
assert.ok(window.document.getElementById("undoIconStrokeButton").disabled === false);
window.document.getElementById("undoIconStrokeButton").click();
window.document.getElementById("eraseIconToolButton").click();
assert.ok(!window.document.getElementById("eraseIconToolButton").classList.contains("active"));
window.document.getElementById("saveIconDrawingButton").click();
window.document.getElementById("saveCustomExerciseButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.customExercises.length, 1);
assert.equal(saved.customExercises[0].name, "Plate Pinch");
assert.deepEqual(saved.customExercises[0].muscleGroups, ["forearms", "biceps"]);
assert.equal(saved.customExercises[0].muscleWeights.forearms, 0.5);
assert.equal(saved.customExercises[0].muscleWeights.biceps, 0.5);
assert.equal(saved.customExercises[0].motion, "custom");
assert.deepEqual(saved.customExercises[0].customIcon.map((stroke) => stroke.width), [3, 6]);
assert.ok(saved.customExercises[0].customIcon[0].points.length > 2);
assert.equal(saved.customExercises[0].customIconWidth, 6);
assert.ok(window.document.querySelector('[data-draw-exercise-icon] polyline[stroke-width="3"]'));
assert.ok(window.document.querySelector('[data-draw-exercise-icon] polyline[stroke-width="6"]'));
window.document.querySelector('[data-close="settingsModal"]').click();
assert.ok(window.document.getElementById("cooldownDock").classList.contains("timer-context-hidden"));

window.document.querySelector('[data-muscle-card="chest"]').click();
assert.ok(window.document.getElementById("liftModal").classList.contains("open"));
assert.ok(!window.document.getElementById("cooldownDock").classList.contains("timer-context-hidden"));
window.document.getElementById("liftWeightInput").value = "225";
window.document.getElementById("liftWeightInput").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.getElementById("liftRepsInput").value = "5";
window.document.getElementById("liftRepsInput").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.getElementById("saveLiftButton").click();

saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.lifts.length, 1);
assert.equal(saved.lifts[0].oneRepMaxKg, undefined);
assert.notEqual(window.document.getElementById("overallScore").textContent, "--");
assert.doesNotMatch(window.document.getElementById("overallScore").textContent, /^P\d+$/);
assert.match(window.document.querySelector('[data-muscle-card="chest"] small').textContent, /Bench Press/);
const chestFills = Array.from(window.document.querySelectorAll('.muscle[data-group="chest"]')).map((node) => node.style.fill);
assert.ok(chestFills[0]);
assert.ok(chestFills.every((fill) => fill === chestFills[0]));
Array.from(window.document.querySelectorAll('.muscle[data-group="chest"]')).forEach((node) => {
  assert.equal(node.getAttribute("fill"), chestFills[0]);
  assert.equal(node.style.getPropertyPriority("fill"), "important");
});
assert.equal(window.document.querySelectorAll("#liftRankLadder .rank-ladder-row").length, window.FossCore.progressionSteps("tiers").length);
assert.doesNotMatch(window.document.getElementById("liftRankLadder").textContent, /estimated/i);

const liftsBeforeBakiDisplay = JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts;
window.document.getElementById("progressionSelect").value = "baki";
window.document.getElementById("progressionSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
window.document.getElementById("liftWeightInput").value = "300";
window.document.getElementById("liftWeightInput").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.equal(window.document.getElementById("livePercentile").textContent, "HUMAN");
assert.match(window.document.getElementById("liveTier").textContent, /Below Suedo.*parody only/i);
assert.match(window.document.getElementById("liveOneRepMax").textContent, /SUEDO.*4[0-9],[0-9]{3} lb/i);
assert.equal(window.document.querySelectorAll("#liftRankLadder .rank-ladder-row").length, 11);
assert.match(window.document.getElementById("liftRankLadderTitle").textContent, /Baki character targets.*parody only/i);
assert.match(window.document.getElementById("liftRankLadder").textContent, /SUEDO.*Card pinch.*4[0-9],[0-9]{3} lb/is);
assert.match(window.document.getElementById("liftRankLadder").textContent, /YUJIRO.*Physics resigns/is);
assert.deepEqual(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts, liftsBeforeBakiDisplay);
window.document.getElementById("progressionSelect").value = "tiers";
window.document.getElementById("progressionSelect").dispatchEvent(new window.Event("change", { bubbles: true }));
assert.equal(window.document.querySelectorAll("#liftRankLadder .rank-ladder-row").length, 6);
assert.doesNotMatch(window.document.getElementById("liftRankLadder").textContent, /S\+|SS|SSS/);

window.document.getElementById("liftWeightInput").value = "200";
window.document.getElementById("liftRepsInput").value = "20";
window.document.getElementById("saveLiftButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.lifts.length, 2);
assert.match(window.document.getElementById("bestOneRepMax").textContent, /225/);
assert.doesNotMatch(window.document.getElementById("liftModal").textContent, /estimated 1RM/i);

window.document.querySelector('[data-lift-exercise="push-up"]').click();
assert.ok(window.document.getElementById("liftWeightField").classList.contains("hidden"));
window.document.getElementById("liftRepsInput").value = "30";
window.document.getElementById("liftRepsInput").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.getElementById("saveLiftButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.lifts.length, 3);
assert.equal(saved.lifts[2].weightKg, 0);
window.document.getElementById("liftRepsInput").value = "20";
window.document.getElementById("saveLiftButton").click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts.length, 4);
const pushupSession = window.document.querySelector("#liftScoreHistory .score-history-bundle");
assert.match(pushupSession.textContent, /2 sets/);
assert.equal(pushupSession.querySelectorAll(".score-bundle-sets em").length, 2);
assert.match(pushupSession.textContent, /30 clean reps/);
assert.match(pushupSession.textContent, /20 clean reps/);
pushupSession.querySelector("[data-delete-bundle]").click();
window.document.getElementById("confirmOkay").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.lifts.length, 2);
assert.equal(window.document.getElementById("bestOneRepMax").textContent, "Not set");

window.document.querySelector('[data-close="liftModal"]').click();
window.document.querySelector('[data-muscle-card="forearms"]').click();
assert.equal(window.document.getElementById("liftTitle").textContent, "Adjustable Hand Gripper");
assert.equal(window.document.getElementById("liftUnitLabel").textContent, "LB");
window.document.getElementById("liftWeightInput").value = "40";
window.document.getElementById("liftRepsInput").value = "5";
window.document.getElementById("saveLiftButton").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
const gripperLift = saved.lifts.find((lift) => lift.exerciseId === "hand-gripper");
assert.ok(Math.abs(gripperLift.weightKg - 18.1437) < 0.01);
assert.match(window.document.getElementById("bestOneRepMax").textContent, /40 lb/);
window.document.querySelector('[data-close="liftModal"]').click();
window.document.querySelector('[data-tab="workouts"]').click();
assert.ok(!window.document.getElementById("workoutOverview").classList.contains("hidden"));
assert.ok(window.document.getElementById("workoutDetail").classList.contains("hidden"));
assert.equal(window.document.getElementById("restTimerToggle").closest("#workoutDetail"), null);
window.document.querySelector("[data-select-plan]").click();
assert.ok(!window.document.getElementById("workoutDetail").classList.contains("hidden"));
assert.ok(window.document.getElementById("workoutsPage").classList.contains("workout-selected"));
assert.ok(!window.document.getElementById("activeWorkoutSticky").contains(window.document.getElementById("restTimerToggle")));
assert.ok(window.document.getElementById("cooldownDock").contains(window.document.getElementById("restTimerToggle")));
assert.ok(window.document.getElementById("activeWorkoutSticky").contains(window.document.getElementById("selectedWorkoutName")));
assert.equal(window.document.getElementById("activeWorkoutModal"), null);
assert.equal(window.document.getElementById("finishWorkoutButton"), null);
assert.equal(window.document.getElementById("newPlanButton").textContent, "Edit");
assert.ok(!window.document.getElementById("newPlanButton").classList.contains("hidden"));
assert.equal(window.document.getElementById("editCurrentWorkout").textContent, "Edit");
window.document.getElementById("newPlanButton").click();
assert.ok(window.document.getElementById("planModal").classList.contains("open"));
assert.equal(window.document.getElementById("planModalTitle").textContent, "Edit plan");
assert.equal(window.document.querySelector('[data-editor-field="sets"]').closest(".editor-number-field").querySelector("span").textContent, "Sets");
assert.equal(window.document.querySelector('[data-editor-field="reps"]').closest(".editor-number-field").querySelector("span").textContent, "Reps");
window.document.querySelector('#planModal [data-close="planModal"]').click();
assert.ok(!window.document.getElementById("planModal").classList.contains("open"));
window.document.getElementById("editCurrentWorkout").click();
assert.ok(window.document.getElementById("planModal").classList.contains("open"));
assert.equal(window.document.getElementById("planModalTitle").textContent, "Edit plan");
window.document.querySelector('#planModal [data-close="planModal"]').click();
const squatDetailButton = window.document.querySelector('#workoutLogger [data-open-exercise-detail="back-squat"]');
assert.ok(squatDetailButton);
squatDetailButton.click();
assert.ok(window.document.getElementById("liftModal").classList.contains("open"));
assert.equal(window.document.getElementById("liftTitle").textContent, "Back Squat");
assert.ok(window.document.getElementById("liftCooldownButton"));
assert.ok(!window.document.getElementById("cooldownDock").classList.contains("timer-context-hidden"));
assert.match(window.document.getElementById("worldRecordLabel").textContent, /MEN'S OPEN CLASSIC WORLD RECORD/);
assert.match(window.document.getElementById("worldRecordCopy").textContent, /International Powerlifting Federation/);
assert.equal(window.document.querySelectorAll("#liftRankLadder .rank-ladder-row").length, window.FossCore.progressionSteps("tiers").length);
window.document.getElementById("liftInfoButton").click();
assert.ok(window.document.getElementById("exerciseInfoModal").classList.contains("open"));
assert.equal(window.document.getElementById("exerciseInfoTitle").textContent, "Back Squat");
window.document.querySelector('#exerciseInfoModal [data-close="exerciseInfoModal"]').click();
assert.ok(window.document.getElementById("liftModal").classList.contains("open"));
window.document.querySelector('#liftModal [data-close="liftModal"]').click();
const benchGuideButton = window.document.querySelector('#workoutLogger [data-quick-exercise="bench-press"] [data-exercise-info="bench-press"]');
assert.ok(benchGuideButton);
benchGuideButton.click();
assert.ok(window.document.getElementById("exerciseInfoModal").classList.contains("open"));
assert.equal(window.document.getElementById("exerciseInfoTitle").textContent, "Bench Press");
assert.equal(window.document.querySelectorAll("#exerciseInfoSteps li").length, 4);
assert.match(window.document.getElementById("exerciseInfoTip").textContent, /spotter|safety/i);
assert.equal(window.document.querySelectorAll("#exerciseInfoRankings .rank-ladder-row").length, window.FossCore.progressionSteps("tiers").length);
assert.match(window.document.getElementById("exerciseInfoRankTitle").textContent, /targets/i);
assert.match(window.document.getElementById("exerciseInfoRankings").textContent, /lb/);
assert.ok(window.document.getElementById("exerciseInfoTip").compareDocumentPosition(window.document.getElementById("exerciseInfoRankSection")) & window.Node.DOCUMENT_POSITION_FOLLOWING);
assert.equal(window.document.querySelector(".exercise-info-swipe-cue").textContent, "Swipe up for rank targets");
assert.match(stylesSource, /\.exercise-info-guide-page\s*\{[^}]*min-height:\s*calc\(100dvh - 92px\)/s);
window.document.querySelector('#exerciseInfoModal [data-close="exerciseInfoModal"]').click();
const benchQuickCard = window.document.querySelector('#workoutLogger [data-quick-exercise="bench-press"]');
const liftsBeforeInvalidScore = JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts.length;
benchQuickCard.querySelector("[data-quick-weight]").value = "0";
benchQuickCard.querySelector('[data-save-quick-score="bench-press"]').click();
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts.length, liftsBeforeInvalidScore);
assert.ok(window.document.getElementById("feedbackBanner").classList.contains("error"));
assert.equal(window.document.getElementById("feedbackBanner").textContent, "Enter a weight greater than zero.");
benchQuickCard.querySelector("[data-quick-weight]").value = "230";
benchQuickCard.querySelector("[data-quick-reps]").value = "1";
benchQuickCard.querySelector('[data-save-quick-score="bench-press"]').click();
assert.ok(window.document.getElementById("feedbackBanner").classList.contains("success"));
assert.match(window.document.getElementById("feedbackBanner").textContent, /score added to your history/i);
assert.ok(window.document.querySelector('#workoutLogger [data-quick-exercise="bench-press"]').classList.contains("score-saved"));
assert.equal(window.__vibrations.at(-1), 45);
assert.ok(window.document.querySelector('[data-muscle-card="chest"]').classList.contains("recently-trained"));
assert.ok(Number(window.document.querySelector('[data-muscle-card="chest"]').style.getPropertyValue("--recent-opacity")) > 0.99);
assert.ok(window.document.querySelectorAll("#muscleGrid .muscle-card-progress").length === 15);
window.document.querySelector('#cooldownTimerSetting [data-value="30"]').click();
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "30");
window.document.getElementById("restTimerToggle").dispatchEvent(new window.MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
assert.ok(window.document.getElementById("cooldownDock").classList.contains("positioning"));
assert.equal(window.document.getElementById("cooldownEditControls").getAttribute("aria-hidden"), "false");
window.document.body.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true }));
assert.ok(!window.document.getElementById("cooldownDock").classList.contains("positioning"));
window.document.getElementById("restTimerToggle").dispatchEvent(new window.MouseEvent("contextmenu", { bubbles: true, cancelable: true }));
window.document.querySelector('#cooldownEditControls [data-cooldown-seconds="90"]').click();
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "90");
window.document.querySelector('#cooldownEditControls [data-cooldown-seconds="30"]').click();
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "30");
window.document.getElementById("restTimerToggle").dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 900, clientY: 700, button: 0 }));
window.dispatchEvent(new window.MouseEvent("pointermove", { bubbles: true, clientX: 40, clientY: 110 }));
window.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 40, clientY: 110 }));
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.cooldownTimerPosition, "top-left");
assert.ok(window.document.getElementById("cooldownDock").classList.contains("timer-position-top-left"));
window.document.getElementById("closeCooldownTimer").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.cooldownTimerVisible, false);
assert.ok(window.document.getElementById("cooldownDock").classList.contains("timer-hidden"));
window.document.getElementById("showCooldownTimer").click();
saved = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(saved.settings.cooldownTimerVisible, true);
assert.ok(!window.document.getElementById("cooldownDock").classList.contains("timer-hidden"));
window.document.getElementById("showCooldownTimer").click();
assert.ok(window.document.getElementById("cooldownDock").classList.contains("timer-hidden"));
window.document.getElementById("showCooldownTimer").click();
assert.ok(!window.document.getElementById("cooldownDock").classList.contains("timer-hidden"));
window.document.getElementById("restTimerToggle").click();
assert.equal(window.document.getElementById("restTimerStatus").textContent, "TAP TO RESET");
assert.ok(window.document.getElementById("restTimerToggle").classList.contains("running"));
window.document.getElementById("restTimerToggle").click();
assert.equal(window.document.getElementById("restTimerDisplay").textContent, "30");
assert.equal(window.document.getElementById("restTimerStatus").textContent, "TAP TO START");
assert.ok(!window.document.getElementById("restTimerToggle").classList.contains("running"));

window.document.querySelector("[data-edit-plan]").click();
window.document.getElementById("addExerciseButton").click();
window.document.querySelector('[data-pick-exercise="crunch"]').click();
window.dispatchEvent(new window.PopStateEvent("popstate", { state: { fossRoot: true } }));
assert.ok(window.document.getElementById("confirmDialog").classList.contains("open"));
assert.equal(window.document.getElementById("confirmTitle").textContent, "Exit workout builder?");
assert.equal(window.document.getElementById("confirmMessage").textContent, "Your progress will not be saved.");
assert.equal(window.document.getElementById("confirmCancel").textContent, "Keep building");
window.document.getElementById("confirmCancel").click();
assert.ok(window.document.getElementById("planModal").classList.contains("open"));
window.document.querySelector('#planModal [data-close="planModal"]').click();
assert.ok(window.document.getElementById("confirmDialog").classList.contains("open"));
window.document.getElementById("confirmOkay").click();
assert.ok(!window.document.getElementById("planModal").classList.contains("open"));
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).plans[0].exercises.length, 5);

window.document.querySelector("[data-edit-plan]").click();
window.document.getElementById("deletePlanButton").click();
window.document.getElementById("confirmOkay").click();
assert.equal(window.document.querySelectorAll("#planList .plan-choice-card").length, 0);
assert.equal(JSON.parse(window.localStorage.getItem("foss.workouts.v1")).plans.length, 0);

window.document.getElementById("newPlanButton").click();
window.document.getElementById("planNameInput").value = "Quick Core";
window.document.getElementById("planNameInput").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.ok(window.document.querySelector("[data-draw-plan-icon]"));
window.document.querySelector("[data-draw-plan-icon]").click();
assert.ok(window.document.getElementById("iconDrawModal").classList.contains("open"));
window.document.getElementById("iconStrokeWidth").value = "2.5";
window.document.getElementById("iconStrokeWidth").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.equal(window.document.getElementById("iconStrokeWidthValue").value, "2.5");
const iconCanvas = window.document.getElementById("iconDrawCanvas");
iconCanvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 300, right: 300, bottom: 300 });
iconCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 30, clientY: 45 }));
iconCanvas.dispatchEvent(new window.MouseEvent("pointermove", { bubbles: true, clientX: 210, clientY: 240 }));
iconCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 210, clientY: 240 }));
window.document.getElementById("undoIconStrokeButton").click();
assert.equal(window.document.getElementById("redoIconStrokeButton").disabled, false);
window.document.getElementById("redoIconStrokeButton").click();
window.document.getElementById("iconStrokeWidth").value = "7";
window.document.getElementById("iconStrokeWidth").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.getElementById("eraseIconToolButton").click();
assert.ok(window.document.getElementById("eraseIconToolButton").classList.contains("active"));
iconCanvas.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true, clientX: 120, clientY: 142 }));
assert.equal(window.__canvasArcRadii.at(-1), 21);
iconCanvas.dispatchEvent(new window.MouseEvent("pointerup", { bubbles: true, clientX: 120, clientY: 142 }));
window.document.getElementById("undoIconStrokeButton").click();
window.document.getElementById("eraseIconToolButton").click();
assert.ok(!window.document.getElementById("eraseIconToolButton").classList.contains("active"));
window.document.getElementById("saveIconDrawingButton").click();
assert.ok(!window.document.getElementById("iconDrawModal").classList.contains("open"));
assert.ok(window.document.querySelector("[data-draw-plan-icon].active .drawn-plan-icon"));
window.document.getElementById("addExerciseButton").click();
window.document.getElementById("exerciseSearchInput").value = "Plate Pinch";
window.document.getElementById("exerciseSearchInput").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.ok(window.document.querySelector('#exercisePickerList [data-pick-exercise^="custom-"]'));
window.document.getElementById("exerciseSearchInput").value = "Crunch";
window.document.getElementById("exerciseSearchInput").dispatchEvent(new window.Event("input", { bubbles: true }));
window.document.querySelector('[data-pick-exercise="crunch"]').click();
window.document.getElementById("savePlanButton").click();
const drawnPlanState = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(drawnPlanState.plans[0].icon, "custom");
assert.equal(drawnPlanState.plans[0].customIconWidth, 7);
assert.equal(drawnPlanState.plans[0].customIcon[0].width, 2.5);
assert.ok(drawnPlanState.plans[0].customIcon[0].points.length >= 2);
assert.ok(drawnPlanState.plans[0].customIcon[0].points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.x <= 100 && point.y >= 0 && point.y <= 100));
assert.ok(window.document.querySelector("#planList .drawn-plan-icon"));
assert.ok(window.document.querySelector('#planList .drawn-plan-icon polyline[stroke-width="2.5"]'));
assert.equal(window.document.querySelectorAll("#workoutLogger [data-quick-exercise=crunch]").length, 1);
assert.equal(window.document.querySelectorAll("#workoutLogger [data-quick-weight]").length, 0);
window.document.querySelector('#workoutLogger [data-save-quick-score="crunch"]').click();
const afterQuickScore = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(afterQuickScore.workouts.length, 0);
assert.ok(afterQuickScore.lifts.some((lift) => lift.exerciseId === "crunch"));
const workoutScoreBadge = window.document.querySelector('#workoutLogger [data-quick-exercise="crunch"] .quick-high-score');
assert.ok(workoutScoreBadge.closest(".quick-log-heading"));
assert.match(workoutScoreBadge.textContent, /HIGH SCORE.*reps/);
assert.equal(workoutScoreBadge.querySelector("small"), null);
window.document.getElementById("clearWorkoutSelection").click();
assert.ok(!window.document.getElementById("workoutOverview").classList.contains("hidden"));
assert.match(window.document.querySelector("#planList .plan-tags").textContent, /NO EQUIPMENT/i);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="no_equipment"]').click();
assert.equal(window.document.querySelectorAll("#planList .plan-choice-card").length, 1);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="equipment"]').click();
assert.match(window.document.getElementById("planList").textContent, /No matching workouts/);
window.document.querySelector('#workoutFilterStrip [data-workout-filter="all"]').click();
assert.ok(window.document.querySelectorAll("#workoutHighScores .high-score-row").length <= 3);
window.document.getElementById("viewAllWorkoutHighScores").click();
assert.ok(!window.document.getElementById("workoutHighScoresPage").classList.contains("hidden"));
assert.ok(window.document.querySelectorAll("#workoutAllHighScores .high-score-row").length >= 3);
window.document.getElementById("closeWorkoutHighScores").click();
assert.ok(!window.document.getElementById("workoutOverview").classList.contains("hidden"));

window.document.querySelector('[data-tab="dashboard"]').click();
assert.ok(window.document.getElementById("dashboardPage").classList.contains("active"));
assert.ok(Number(window.document.getElementById("dashboardHighScoreTotal").textContent) >= 3);
assert.ok(window.document.querySelectorAll("#dashboardHighScores .dashboard-score-card").length >= 3);
assert.ok(window.document.querySelectorAll("#dashboardHighScores .dashboard-score-card").length <= 3);
assert.match(window.document.getElementById("dashboardPoints").textContent, /XP$/);
assert.match(window.document.getElementById("dashboardNextRank").textContent, /XP|Top rank/);
assert.match(window.document.querySelector("#dashboardHighScores .rank-progress-copy span:last-child").textContent, /lb lifted|kg lifted|clean reps|Top rank/);
assert.doesNotMatch(window.document.getElementById("dashboardPage").textContent, /estimated 1RM/i);
window.document.getElementById("viewAllDashboardScores").click();
assert.ok(!window.document.getElementById("dashboardAllStatsPage").classList.contains("hidden"));
assert.ok(window.document.querySelector("#dashboardAllHighScores .score-rating-divider"));
window.document.getElementById("closeDashboardScores").click();
assert.ok(!window.document.getElementById("dashboardOverview").classList.contains("hidden"));
window.document.querySelector('[data-chart-mode="weight"]').click();
assert.equal(window.document.getElementById("dashboardChartTitle").textContent, "Body weight");

window.document.querySelector('[data-tab="cardio"]').click();
assert.ok(window.document.getElementById("cardioPage").classList.contains("active"));
assert.equal(window.document.querySelectorAll("#cardioActivitySelect option").length, 13);
assert.ok(window.document.querySelector('#cardioActivitySelect option[value="forty-yard-dash"]'));
assert.ok(window.document.getElementById("cardioActivitySelect").classList.contains("hidden"));
assert.equal(window.document.querySelectorAll("#cardioActivityTabs [data-cardio-activity]").length, 13);
window.document.querySelector('#cardioActivityTabs [data-cardio-activity="forty-yard-dash"]').click();
assert.equal(window.document.getElementById("cardioActivitySelect").value, "forty-yard-dash");
assert.ok(window.document.querySelector('#cardioActivityTabs [data-cardio-activity="forty-yard-dash"]').classList.contains("active"));
window.document.getElementById("cardioSecondsInput").value = "4.75";
window.document.getElementById("saveCardioScoreButton").click();
let cardioState = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(cardioState.cardio.length, 1);
assert.equal(cardioState.cardio[0].activityId, "forty-yard-dash");
assert.match(window.document.getElementById("cardioHistoryList").textContent, /40-Yard Dash/);
const futureCardioGoalDate = new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10);
window.document.getElementById("openCardioGoalFromLogger").click();
assert.ok(window.document.getElementById("cardioGoalModal").classList.contains("open"));
assert.equal(window.document.getElementById("cardioGoalActivitySelect").value, "forty-yard-dash");
assert.equal(window.document.getElementById("cardioGoalDateInput").min, new Date(Date.now() + 86400000).toISOString().slice(0, 10));
window.document.getElementById("cardioGoalMinutesInput").value = "0";
window.document.getElementById("cardioGoalSecondsInput").value = "4.5";
window.document.getElementById("cardioGoalDateInput").value = futureCardioGoalDate;
window.document.getElementById("saveCardioGoalButton").click();
cardioState = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(cardioState.settings.cardioGoals["forty-yard-dash"].value, 4.5);
assert.equal(cardioState.settings.cardioGoals["forty-yard-dash"].date, futureCardioGoalDate);
assert.equal(window.document.getElementById("cardioGoalSettingValue").textContent, "1 cardio goal");
assert.equal(window.document.querySelector("#cardioPage #cardioChart"), null);

window.document.querySelector('[data-tab="body"]').click();
assert.ok(window.document.getElementById("bodyPage").classList.contains("active"));
assert.ok(window.document.querySelector("#bodyPage #cardioChart"));
assert.equal(window.document.getElementById("cardioChartEmpty").parentElement.className, "cardio-chart-frame");
assert.match(stylesSource, /\.cardio-chart-frame \.chart-empty,[\s\S]*?transform:\s*translateY\(-50%\)/s);
assert.equal(window.document.querySelectorAll("#measurementGrid .measurement-card").length, 12);
assert.equal(window.document.querySelectorAll("#measurementGrid [data-measurement-guide]").length, 0);
assert.equal(window.document.getElementById("proportionSummary"), null);
assert.notEqual(window.document.getElementById("bmiValue").textContent, "--");
window.document.getElementById("openMeasurementDisplayButton").click();
assert.ok(window.document.getElementById("measurementDisplayModal").classList.contains("open"));
assert.equal(window.document.querySelectorAll("#measurementDisplayOptions [data-weight-display]").length, 10);
assert.ok(!window.document.querySelector('#measurementDisplayOptions [data-weight-display="dailyRate"]').classList.contains("active"));
window.document.querySelector('#measurementDisplayOptions [data-weight-display="dailyRate"]').click();
window.document.querySelector('#measurementDisplayOptions [data-weight-display="xAxis"]').click();
let displayState = JSON.parse(window.localStorage.getItem("foss.workouts.v1")).settings.weightDisplay;
assert.equal(displayState.dailyRate, true);
assert.equal(displayState.xAxis, false);
assert.ok(window.document.getElementById("weightXAxisLabel").classList.contains("hidden"));
window.document.querySelector('#measurementDisplayModal [data-close="measurementDisplayModal"]').click();
window.document.getElementById("openWeightGoalFromBody").click();
assert.ok(window.document.getElementById("weightGoalModal").classList.contains("open"));
const futureGoalDate = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
window.document.getElementById("weightGoalInput").value = "170";
window.document.getElementById("weightGoalDateInput").value = futureGoalDate;
window.document.getElementById("saveWeightGoalButton").click();
const weightGoalState = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.ok(weightGoalState.settings.weightGoalKg > 77 && weightGoalState.settings.weightGoalKg < 78);
assert.equal(weightGoalState.settings.weightGoalDate, futureGoalDate);
assert.equal(window.document.getElementById("weightChartTitle").textContent, "Trajectory");
assert.match(window.document.getElementById("bodyWeightChange").textContent, /^GOAL /);
assert.match(window.document.getElementById("weightMetricGrid").textContent, /NEEDED DAILY/);
assert.match(window.document.getElementById("weightMetricGrid").textContent, /NEEDED WEEKLY/);
assert.match(window.document.getElementById("weightEndDate").textContent, /END /);
window.document.getElementById("currentWeightViewButton").click();
assert.equal(window.document.getElementById("weightChartTitle").textContent, "Full timeline");
assert.match(window.document.getElementById("bodyWeightChange").textContent, /^ALL /);
window.document.getElementById("currentWeightViewButton").click();
assert.equal(window.document.getElementById("weightChartTitle").textContent, "Past 7 days");
assert.match(window.document.getElementById("bodyWeightChange").textContent, /^7D /);
window.document.querySelector('[data-quick-measurement="waistCm"]').click();
assert.ok(window.document.getElementById("quickMeasurementModal").classList.contains("open"));
assert.match(window.document.getElementById("quickMeasurementInstruction").textContent, /navel/i);
assert.ok(!window.document.getElementById("quickMeasurementProgress").classList.contains("hidden"));
assert.match(window.document.getElementById("quickMeasurementTargetValue").textContent, /in/);
window.document.getElementById("quickMeasurementInput").value = "35";
window.document.getElementById("quickMeasurementInput").dispatchEvent(new window.Event("input", { bubbles: true }));
assert.match(window.document.getElementById("quickMeasurementProgressCopy").textContent, /target/i);
window.document.getElementById("saveQuickMeasurementButton").click();
const afterQuickMeasurement = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
const lastMeasurement = afterQuickMeasurement.measurements[afterQuickMeasurement.measurements.length - 1];
assert.ok(lastMeasurement.waistCm > 0);
assert.equal(lastMeasurement.neckCm, undefined);
assert.match(window.document.querySelector('[data-quick-measurement="chestCm"] .measurement-target').textContent, /target/i);
assert.doesNotMatch(window.document.querySelector('[data-quick-measurement="chestCm"] .measurement-target').textContent, /%/);
assert.ok(window.document.querySelectorAll("#measurementHistoryPreview .measurement-history-entry").length <= 3);
window.document.querySelector('#measurementHistoryPreview [data-edit-measurement-entry]').click();
assert.ok(window.document.getElementById("measurementHistoryEditModal").classList.contains("open"));
const waistHistoryInput = window.document.querySelector('#measurementHistoryEditForm [data-history-measurement-key="waistCm"]');
assert.ok(waistHistoryInput);
waistHistoryInput.value = "36";
window.document.getElementById("saveMeasurementHistoryEdit").click();
const editedMeasurements = JSON.parse(window.localStorage.getItem("foss.workouts.v1")).measurements;
assert.ok(editedMeasurements.some((entry) => entry.waistCm > 91 && entry.waistCm < 92));

const widgetSnapshot = window.FossGymWidgets.snapshot();
assert.match(widgetSnapshot.title, /Iron Den/i);
assert.equal(widgetSnapshot.body.weight.endsWith(" lb"), true);
assert.ok(Array.isArray(widgetSnapshot.topScores));
assert.ok(Array.isArray(widgetSnapshot.plans));

window.document.getElementById("bodyMethodButton").click();
assert.ok(window.document.getElementById("bodyInfoModal").classList.contains("open"));
window.dispatchEvent(new window.PopStateEvent("popstate", { state: { fossRoot: true } }));
assert.ok(!window.document.getElementById("bodyInfoModal").classList.contains("open"));

const backupCsv = window.FossGymBackup.createCsv();
assert.ok(backupCsv.startsWith('\ufeff"record_type","record_id","data"'));
assert.match(backupCsv, /foss_gym_csv/);
const parsedBackup = window.FossGymBackup.parseCsv(backupCsv);
assert.equal(parsedBackup.version, 20);
assert.deepEqual(Array.from(parsedBackup.settings.availableLocations), ["planet", "crunch"]);
assert.equal(parsedBackup.settings.activeLocation, "crunch");
assert.equal(parsedBackup.settings.locationSetupComplete, true);
assert.equal(parsedBackup.settings.theme, "electric");
assert.equal(parsedBackup.settings.weightedScoreMode, "heaviest_set");
assert.equal(parsedBackup.settings.customAccent, "#22CC88");
assert.equal(parsedBackup.settings.useCustomAccent, false);
assert.equal(parsedBackup.settings.showExerciseTags, true);
assert.equal(parsedBackup.settings.cooldownTimerVisible, true);
assert.equal(parsedBackup.settings.cooldownTimerPosition, "top-left");
assert.equal(parsedBackup.settings.historyBundleWindow, "day");
assert.equal(parsedBackup.settings.recentTrainingWindowDays, 7);
assert.equal(parsedBackup.cardio.length, 1);
assert.equal(parsedBackup.settings.weightGoalDate, futureGoalDate);
assert.equal(parsedBackup.settings.cardioGoals["forty-yard-dash"].date, futureCardioGoalDate);
assert.equal(parsedBackup.settings.weightDisplay.dailyRate, true);
assert.equal(parsedBackup.settings.weightDisplay.xAxis, false);
assert.ok(parsedBackup.settings.donationReminderNextAt > Date.now() + 29 * 86400000);
assert.equal(parsedBackup.settings.rankTargetMode, "training");
assert.equal(parsedBackup.settings.proportionalPhysique, "golden");
assert.equal(parsedBackup.settings.proportionalScalePreset, undefined);
assert.equal(parsedBackup.customPhysiques.length, 1);
assert.equal(parsedBackup.customPhysiques[0].name, "Hero Ratio");
assert.equal(parsedBackup.customPhysiques[0].ratios.shoulderCm, 1.75);
assert.equal(parsedBackup.settings.appTitle, "Iron Den");
assert.ok(parsedBackup.settings.customAppMark.length);
assert.equal(parsedBackup.customExercises.length, 1);
assert.deepEqual(Array.from(parsedBackup.customExercises[0].muscleGroups), ["forearms", "biceps"]);
assert.equal(parsedBackup.customExercises[0].motion, "custom");
assert.ok(parsedBackup.customExercises[0].customIcon.length);
assert.equal(parsedBackup.customExercises[0].customIconWidth, 6);
assert.deepEqual(Array.from(parsedBackup.customExercises[0].customIcon, (stroke) => stroke.width), [3, 6]);
assert.equal(parsedBackup.plans.length, 1);
assert.equal(parsedBackup.plans[0].icon, "custom");
assert.equal(parsedBackup.plans[0].customIconWidth, 7);
assert.equal(parsedBackup.plans[0].customIcon[0].width, 2.5);
assert.equal(JSON.stringify(parsedBackup.plans[0].customIcon), JSON.stringify(drawnPlanState.plans[0].customIcon));
assert.equal(parsedBackup.lifts.length, JSON.parse(window.localStorage.getItem("foss.workouts.v1")).lifts.length);
assert.equal(window.FossGymBackup.importCsvText(backupCsv), true);
assert.ok(window.document.getElementById("confirmDialog").classList.contains("open"));
window.document.getElementById("confirmOkay").click();
const restoredBackup = JSON.parse(window.localStorage.getItem("foss.workouts.v1"));
assert.equal(restoredBackup.customExercises[0].name, "Plate Pinch");
assert.equal(restoredBackup.customPhysiques[0].name, "Hero Ratio");
assert.equal(restoredBackup.customPhysiques[0].ratios.shoulderCm, 1.75);
assert.equal(restoredBackup.plans[0].name, "Quick Core");
assert.equal(restoredBackup.plans[0].icon, "custom");
assert.equal(restoredBackup.plans[0].customIconWidth, 7);
assert.equal(restoredBackup.plans[0].customIcon[0].width, 2.5);
assert.equal(JSON.stringify(restoredBackup.plans[0].customIcon), JSON.stringify(drawnPlanState.plans[0].customIcon));
assert.equal(restoredBackup.measurements.length, parsedBackup.measurements.length);

window.close();

const migrationDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-migration.local/",
  pretendToBeVisual: true
});
const migrationWindow = migrationDom.window;
migrationWindow.scrollTo = function () {};
migrationWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
migrationWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 2,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6, heightCm: 175.3 },
  lifts: [],
  plans: [{ id: "old-plan", name: "Old Plan", exercises: [{ exerciseId: "bench-press", sets: 3, reps: 5, weightKg: null }] }],
  workouts: [{ id: "legacy-session", name: "Old session" }],
  measurements: []
}));
migrationWindow.eval(coreSource);
migrationWindow.eval(equipmentSource);
migrationWindow.eval(guidesSource);
migrationWindow.eval(recordsSource);
migrationWindow.eval(appSource);
assert.equal(migrationWindow.document.body.dataset.theme, "lime");
assert.ok(migrationWindow.document.querySelector('[data-select-plan="old-plan"]'));
assert.equal(migrationWindow.document.querySelectorAll("#progressionSelect option").length, 13);
assert.match(migrationWindow.document.getElementById("progressionSettingValue").textContent, /Training level/i);
assert.match(migrationWindow.document.getElementById("pointLabelPreview").textContent, /XP$/);
migrationDom.window.close();

const multiMuscleDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-multi-muscle.local/",
  pretendToBeVisual: true
});
const multiMuscleWindow = multiMuscleDom.window;
multiMuscleWindow.scrollTo = function () {};
multiMuscleWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
multiMuscleWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 10,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6, heightCm: 188 },
  lifts: [
    { id: "bench-score", exerciseId: "bench-press", date: "2026-08-12T10:00:00.000Z", weightKg: 80, reps: 1 },
    { id: "multi-score", exerciseId: "custom-multi", date: "2026-08-12T11:00:00.000Z", weightKg: 70, reps: 1 }
  ],
  plans: [],
  workouts: [],
  measurements: [],
  customExercises: [{
    id: "custom-multi",
    name: "Dual Arm Test",
    group: "forearms",
    muscleGroups: ["forearms", "biceps"],
    motion: "custom",
    customIcon: [[{ x: 10, y: 10 }, { x: 90, y: 90 }]],
    customIconWidth: 7,
    type: "weighted",
    male: [0.1, 0.2, 0.3, 0.4, 0.5],
    female: [0.08, 0.16, 0.24, 0.32, 0.4],
    custom: true
  }],
  settings: { progression: "training", weightedScoreMode: "heaviest_set" }
}));
multiMuscleWindow.eval(coreSource);
multiMuscleWindow.eval(equipmentSource);
multiMuscleWindow.eval(guidesSource);
multiMuscleWindow.eval(recordsSource);
multiMuscleWindow.eval(appSource);
assert.equal(multiMuscleWindow.document.querySelector('.custom-exercise-row .drawn-plan-icon polyline').getAttribute("stroke-width"), "7");
assert.match(multiMuscleWindow.document.querySelector('[data-muscle-card="forearms"] small').textContent, /Dual Arm Test/);
assert.match(multiMuscleWindow.document.querySelector('[data-muscle-card="biceps"] small').textContent, /Dual Arm Test/);
assert.equal(
  multiMuscleWindow.document.querySelector('.muscle[data-group="forearms"]').style.fill,
  multiMuscleWindow.document.querySelector('.muscle[data-group="biceps"]').style.fill
);
const benchPercentile = multiMuscleWindow.FossCore.rankLift(80, 81.6, [0.5, 1, 1.25, 1.5, 2]).percentile;
const multiPercentile = multiMuscleWindow.FossCore.rankLift(70, 81.6, [0.1, 0.2, 0.3, 0.4, 0.5]).percentile;
const weightedOverall = multiMuscleWindow.FossCore.round((benchPercentile + multiPercentile) / 2, 1);
assert.match(multiMuscleWindow.document.getElementById("overallSubtext").textContent, new RegExp(multiMuscleWindow.FossCore.ordinal(weightedOverall)));
multiMuscleDom.window.close();

const oneRmDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-one-rm.local/",
  pretendToBeVisual: true
});
const oneRmWindow = oneRmDom.window;
oneRmWindow.scrollTo = function () {};
oneRmWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
oneRmWindow.eval(coreSource);
oneRmWindow.eval(equipmentSource);
oneRmWindow.eval(guidesSource);
oneRmWindow.eval(recordsSource);
oneRmWindow.eval(appSource);
oneRmWindow.document.getElementById("setupWeight").value = "180";
oneRmWindow.document.getElementById("setupHeightFeet").value = "5";
oneRmWindow.document.getElementById("setupHeightInches").value = "9";
oneRmWindow.document.getElementById("setupNextButton").click();
oneRmWindow.document.querySelector('[data-setup-location="planet"]').click();
oneRmWindow.document.getElementById("setupLocationNextButton").click();
oneRmWindow.document.getElementById("finishSetupButton").click();
oneRmWindow.document.getElementById("settingsButton").click();
oneRmWindow.document.querySelector('#weightedScoreModeSetting [data-value="one_rep_max"]').click();
assert.equal(JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1")).settings.weightedScoreMode, "heaviest_set");
assert.ok(oneRmWindow.document.getElementById("confirmDialog").classList.contains("open"));
assert.match(oneRmWindow.document.getElementById("confirmMessage").textContent, /Every saved set will be kept/);
oneRmWindow.document.getElementById("confirmOkay").click();
assert.equal(JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1")).settings.weightedScoreMode, "one_rep_max");
oneRmWindow.document.querySelector('[data-close="settingsModal"]').click();
oneRmWindow.document.querySelector('[data-muscle-card="chest"]').click();
assert.equal(oneRmWindow.document.getElementById("liftRepsInput").value, "1");
oneRmWindow.document.getElementById("liftWeightInput").value = "225";
oneRmWindow.document.getElementById("liftRepsInput").value = "5";
oneRmWindow.document.getElementById("saveLiftButton").click();
assert.equal(oneRmWindow.document.getElementById("liftBestLabel").textContent, "ACTUAL 1RM");
assert.equal(oneRmWindow.document.getElementById("bestOneRepMax").textContent, "Not set");
assert.match(oneRmWindow.document.getElementById("liftScoreHistory").textContent, /Saved set only/);
oneRmWindow.document.getElementById("liftWeightInput").value = "200";
oneRmWindow.document.getElementById("liftRepsInput").value = "1";
oneRmWindow.document.getElementById("saveLiftButton").click();
assert.match(oneRmWindow.document.getElementById("bestOneRepMax").textContent, /200/);
assert.match(oneRmWindow.document.getElementById("liftScoreHistory").textContent, /2 sets/);
assert.equal(oneRmWindow.document.querySelectorAll("#liftScoreHistory .score-bundle-sets em").length, 2);
let oneRmState = JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1"));
assert.equal(oneRmState.lifts.length, 2);
assert.equal(oneRmState.lifts.filter((lift) => lift.reps === 1).length, 1);

oneRmWindow.document.querySelector('[data-close="liftModal"]').click();
oneRmWindow.document.getElementById("settingsButton").click();
oneRmWindow.document.querySelector('#weightedScoreModeSetting [data-value="estimated_one_rep_max"]').click();
assert.equal(JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1")).settings.weightedScoreMode, "one_rep_max");
oneRmWindow.document.getElementById("confirmOkay").click();
oneRmState = JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1"));
assert.equal(oneRmState.settings.weightedScoreMode, "estimated_one_rep_max");
assert.equal(oneRmState.lifts.length, 2);
oneRmWindow.document.querySelector('[data-close="settingsModal"]').click();
oneRmWindow.document.querySelector('[data-muscle-card="chest"]').click();
assert.equal(oneRmWindow.document.getElementById("liftBestLabel").textContent, "ESTIMATED 1RM");
assert.match(oneRmWindow.document.getElementById("bestOneRepMax").textContent, /262\.5/);
assert.match(oneRmWindow.document.getElementById("liftScoreHistory").textContent, /2 sets/);

oneRmWindow.document.querySelector('[data-close="liftModal"]').click();
oneRmWindow.document.getElementById("settingsButton").click();
oneRmWindow.document.querySelector('#weightedScoreModeSetting [data-value="heaviest_set"]').click();
oneRmWindow.document.getElementById("confirmOkay").click();
oneRmState = JSON.parse(oneRmWindow.localStorage.getItem("foss.workouts.v1"));
assert.equal(oneRmState.settings.weightedScoreMode, "heaviest_set");
assert.equal(oneRmState.lifts.length, 2);
oneRmWindow.document.querySelector('[data-close="settingsModal"]').click();
oneRmWindow.document.querySelector('[data-muscle-card="chest"]').click();
assert.equal(oneRmWindow.document.getElementById("liftBestLabel").textContent, "HEAVIEST SET");
assert.match(oneRmWindow.document.getElementById("bestOneRepMax").textContent, /225/);
oneRmDom.window.close();

const historyDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-history.local/",
  pretendToBeVisual: true
});
const historyWindow = historyDom.window;
historyWindow.scrollTo = function () {};
historyWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
historyWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 12,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6466, heightCm: 187.96 },
  lifts: [
    { id: "bench-1", exerciseId: "bench-press", date: "2026-08-10T10:00:00.000Z", weightKg: 45, reps: 1 },
    { id: "bench-2", exerciseId: "bench-press", date: "2026-08-11T10:00:00.000Z", weightKg: 50, reps: 1 },
    { id: "bench-3", exerciseId: "bench-press", date: "2026-08-12T10:00:00.000Z", weightKg: 55, reps: 1 },
    { id: "bench-4", exerciseId: "bench-press", date: "2026-08-13T10:00:00.000Z", weightKg: 60, reps: 1 }
  ],
  plans: [],
  workouts: [],
  measurements: [],
  customExercises: [],
  settings: {
    progression: "training",
    weightedScoreMode: "heaviest_set",
    locationSetupComplete: true,
    availableLocations: ["planet"],
    activeLocation: "planet"
  }
}));
historyWindow.eval(coreSource);
historyWindow.eval(equipmentSource);
historyWindow.eval(guidesSource);
historyWindow.eval(recordsSource);
historyWindow.eval(appSource);
historyWindow.document.querySelector('[data-muscle-card="chest"]').click();
assert.equal(historyWindow.document.querySelectorAll("#liftScoreHistory .score-history-row").length, 3);
assert.equal(historyWindow.document.getElementById("liftScoreCount").textContent, "Showing latest 3 of 4 sessions · 4 sets");
assert.equal(historyWindow.document.getElementById("viewAllLiftScores").textContent, "View all");
historyWindow.document.getElementById("viewAllLiftScores").click();
assert.equal(historyWindow.document.querySelectorAll("#liftScoreHistory .score-history-row").length, 4);
assert.equal(historyWindow.document.getElementById("viewAllLiftScores").textContent, "Show latest 3");
historyWindow.document.getElementById("liftWeightInput").value = "125";
historyWindow.document.getElementById("liftRepsInput").value = "1";
historyWindow.document.getElementById("liftWeightInput").dispatchEvent(new historyWindow.Event("input", { bubbles: true }));
assert.equal(historyWindow.document.getElementById("livePercentile").textContent, "NOVICE");
historyWindow.document.querySelector('[data-close="liftModal"]').click();
historyWindow.document.querySelector('[data-muscle-card="shoulders"]').click();
historyWindow.document.getElementById("liftWeightInput").value = "110";
historyWindow.document.getElementById("liftRepsInput").value = "1";
historyWindow.document.getElementById("liftWeightInput").dispatchEvent(new historyWindow.Event("input", { bubbles: true }));
assert.equal(historyWindow.document.getElementById("livePercentile").textContent, "TRAINED");
historyDom.window.close();

const homeDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-home.local/",
  pretendToBeVisual: true
});
const homeWindow = homeDom.window;
homeWindow.scrollTo = function () {};
homeWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
homeWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 12,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6466, heightCm: 187.96 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [],
  customExercises: [],
  settings: {
    progression: "training",
    locationSetupComplete: true,
    availableLocations: ["home"],
    activeLocation: "home",
    locationEquipment: { home: [], apartment: [], planet: [], crunch: [] }
  }
}));
homeWindow.eval(coreSource);
homeWindow.eval(equipmentSource);
homeWindow.eval(guidesSource);
homeWindow.eval(recordsSource);
homeWindow.eval(appSource);
assert.ok(homeWindow.document.querySelector('#exercisePickerList [data-pick-exercise="wall-push-up"]'));
assert.equal(homeWindow.document.querySelector('#exercisePickerList [data-pick-exercise="bench-press"]'), null);
assert.equal(homeWindow.document.querySelector('#exercisePickerList [data-pick-exercise="pull-up"]'), null);
assert.equal(homeWindow.document.getElementById("activeLocationSelect").disabled, true);
homeWindow.document.getElementById("settingsButton").click();
homeWindow.document.querySelector('[data-edit-location-equipment="home"]').click();
assert.ok(!homeWindow.document.getElementById("noEquipmentChoice").classList.contains("hidden"));
assert.ok(homeWindow.document.getElementById("noEquipmentChoice").classList.contains("active"));
homeWindow.document.querySelector('[data-close="equipmentModal"]').click();
homeWindow.document.querySelector('[data-toggle-location="apartment"]').click();
assert.ok(homeWindow.document.getElementById("equipmentModal").classList.contains("open"));
assert.ok(homeWindow.document.getElementById("noEquipmentChoice").classList.contains("hidden"));
homeWindow.document.querySelector('[data-equipment-choice="dumbbells"]').click();
homeWindow.document.getElementById("saveEquipmentButton").click();
const homeState = JSON.parse(homeWindow.localStorage.getItem("foss.workouts.v1"));
assert.deepEqual(homeState.settings.availableLocations, ["home", "apartment"]);
assert.deepEqual(homeState.settings.locationEquipment.apartment, ["dumbbells"]);
assert.equal(homeWindow.document.querySelectorAll("#activeLocationSelect option").length, 2);
homeDom.window.close();

const recordDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-records.local/",
  pretendToBeVisual: true
});
const recordWindow = recordDom.window;
recordWindow.scrollTo = function () {};
recordWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
recordWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 15,
  profile: { onboarded: true, units: "kg", standard: "female", bodyWeightKg: 70, heightCm: 170 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [],
  customExercises: [],
  settings: {
    progression: "training",
    weightedScoreMode: "one_rep_max",
    rankTargetMode: "world_record",
    locationSetupComplete: true,
    availableLocations: ["planet"],
    activeLocation: "planet"
  }
}));
recordWindow.eval(coreSource);
recordWindow.eval(equipmentSource);
recordWindow.eval(guidesSource);
recordWindow.eval(recordsSource);
recordWindow.eval(appSource);
recordWindow.document.querySelector('[data-muscle-card="chest"]').click();
assert.equal(recordWindow.document.getElementById("worldRecordValue").textContent, "167 kg");
assert.match(recordWindow.document.getElementById("worldRecordLabel").textContent, /WOMEN'S OPEN CLASSIC WORLD RECORD/);
recordWindow.document.getElementById("liftWeightInput").value = "167";
recordWindow.document.getElementById("liftRepsInput").value = "1";
recordWindow.document.getElementById("liftWeightInput").dispatchEvent(new recordWindow.Event("input", { bubbles: true }));
assert.match(recordWindow.document.getElementById("liveTier").textContent, /100% of world record/);
assert.equal(recordWindow.document.getElementById("liftRankLadderTitle").textContent, "Road to the world record");
assert.match(recordWindow.document.querySelector("#liftRankLadder .rank-ladder-row:last-child").textContent, /World class/i);
recordWindow.document.querySelector('[data-close="liftModal"]').click();
recordWindow.document.querySelector('[data-muscle-card="quads"]').click();
recordWindow.document.querySelector('[data-lift-exercise="leg-press"]').click();
assert.equal(recordWindow.document.getElementById("worldRecordValue").textContent, "Not standardized");
assert.doesNotMatch(recordWindow.document.getElementById("liftRankLadder").textContent, /World class/i);
recordWindow.document.getElementById("liftWeightInput").value = "200";
recordWindow.document.getElementById("liftRepsInput").value = "1";
recordWindow.document.getElementById("liftWeightInput").dispatchEvent(new recordWindow.Event("input", { bubbles: true }));
assert.match(recordWindow.document.getElementById("liveTier").textContent, /training scale \(no standardized record\)/);
recordWindow.document.querySelector('[data-close="liftModal"]').click();
recordWindow.document.getElementById("settingsButton").click();
assert.ok(recordWindow.document.querySelector('#rankTargetModeSetting [data-value="world_record"].active'));
recordWindow.document.querySelector('#standardSetting [data-value="male"]').click();
assert.match(recordWindow.document.getElementById("confirmMessage").textContent, /sir and stuff/i);
recordWindow.document.getElementById("confirmOkay").click();
recordWindow.document.querySelector('#settingsModal [data-close="settingsModal"]').click();
recordWindow.document.querySelector('[data-muscle-card="back"]').click();
recordWindow.document.querySelector('[data-lift-exercise="pull-up"]').click();
assert.equal(recordWindow.document.getElementById("worldRecordValue").textContent, "1,224 consecutive reps");
assert.equal(recordWindow.document.getElementById("liftRepsInput").max, "5000");
assert.match(recordWindow.document.querySelector("#liftRankLadder .rank-ladder-row:last-child").textContent, /World class.*1,224 official consecutive reps/is);
recordWindow.document.querySelector('[data-close="liftModal"]').click();
recordWindow.document.getElementById("settingsButton").click();
recordWindow.document.querySelector('#rankTargetModeSetting [data-value="training"]').click();
assert.equal(JSON.parse(recordWindow.localStorage.getItem("foss.workouts.v1")).settings.rankTargetMode, "training");
recordDom.window.close();

const scaleMigrationDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-scale-migration.local/",
  pretendToBeVisual: true
});
const scaleMigrationWindow = scaleMigrationDom.window;
scaleMigrationWindow.scrollTo = function () {};
scaleMigrationWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
scaleMigrationWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 16,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6466, heightCm: 175.26 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [],
  customExercises: [],
  settings: {
    progression: "training",
    proportionalScaleMinKg: 54.4311,
    proportionalScaleMaxKg: 136.0777,
    locationSetupComplete: true,
    availableLocations: ["home"],
    activeLocation: "home"
  }
}));
scaleMigrationWindow.eval(coreSource);
scaleMigrationWindow.eval(equipmentSource);
scaleMigrationWindow.eval(guidesSource);
scaleMigrationWindow.eval(recordsSource);
scaleMigrationWindow.eval(appSource);
scaleMigrationWindow.document.getElementById("settingsButton").click();
scaleMigrationWindow.document.getElementById("openProportionalTargetsButton").click();
assert.equal(scaleMigrationWindow.document.getElementById("proportionalScalePreset"), null);
assert.equal(scaleMigrationWindow.document.getElementById("proportionalScaleCustom"), null);
assert.equal(scaleMigrationWindow.document.getElementById("proportionalScaleMinimum"), null);
assert.equal(scaleMigrationWindow.document.getElementById("proportionalScaleMaximum"), null);
assert.equal(scaleMigrationWindow.document.getElementById("proportionalMinimumLabel").textContent, "130 lb");
assert.equal(scaleMigrationWindow.document.getElementById("proportionalMaximumLabel").textContent, "205 lb");
scaleMigrationDom.window.close();

const datedWeightDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-dated-weight.local/",
  pretendToBeVisual: true
});
const datedWeightWindow = datedWeightDom.window;
datedWeightWindow.scrollTo = function () {};
datedWeightWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
const dateDaysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();
const datedGoalDate = new Date(Date.now() + 100 * 86400000).toISOString().slice(0, 10);
datedWeightWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 19,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 90.7185, heightCm: 175.3 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [
    { id: "weight-30", date: dateDaysAgo(30), weightKg: 90.7185 },
    { id: "weight-8", date: dateDaysAgo(8), weightKg: 86.1826 },
    { id: "weight-3", date: dateDaysAgo(3), weightKg: 83.9146 },
    { id: "weight-now", date: dateDaysAgo(0), weightKg: 81.6466 }
  ],
  cardio: [],
  settings: {
    progression: "training",
    locationSetupComplete: true,
    availableLocations: ["home"],
    activeLocation: "home",
    weightGoalKg: 74.8427,
    weightGoalDate: datedGoalDate
  }
}));
datedWeightWindow.eval(coreSource);
datedWeightWindow.eval(equipmentSource);
datedWeightWindow.eval(guidesSource);
datedWeightWindow.eval(recordsSource);
datedWeightWindow.eval(appSource);
assert.match(datedWeightWindow.document.getElementById("bodyWeightChange").textContent, /^7D -10(?:\.0)? lb$/);
datedWeightWindow.document.getElementById("currentWeightViewButton").click();
assert.match(datedWeightWindow.document.getElementById("bodyWeightChange").textContent, /^GOAL -15(?:\.0)? lb$/);
datedWeightWindow.document.getElementById("currentWeightViewButton").click();
assert.match(datedWeightWindow.document.getElementById("bodyWeightChange").textContent, /^ALL -20(?:\.0)? lb$/);
datedWeightDom.window.close();

const dueDonationDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-donation-reminder.local/",
  pretendToBeVisual: true
});
const dueDonationWindow = dueDonationDom.window;
dueDonationWindow.scrollTo = function () {};
dueDonationWindow.open = function () { return null; };
dueDonationWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
dueDonationWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 19,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6, heightCm: 175.3 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [],
  cardio: [],
  settings: {
    progression: "training",
    locationSetupComplete: true,
    availableLocations: ["home"],
    activeLocation: "home",
    donationReminderNextAt: Date.now() - 1000
  }
}));
dueDonationWindow.eval(coreSource);
dueDonationWindow.eval(equipmentSource);
dueDonationWindow.eval(guidesSource);
dueDonationWindow.eval(recordsSource);
dueDonationWindow.eval(appSource);
assert.equal(dueDonationWindow.document.querySelectorAll("#donationReminder").length, 1);
assert.ok(!dueDonationWindow.document.getElementById("donationReminder").classList.contains("hidden"));
assert.equal(dueDonationWindow.document.querySelector("#donationReminderButton span").textContent, "We run on donations, tap here to donate!");
dueDonationWindow.document.getElementById("donationReminderButton").click();
assert.ok(dueDonationWindow.document.getElementById("donationModal").classList.contains("open"));
assert.ok(dueDonationWindow.document.getElementById("donationReminder").classList.contains("hidden"));
const advancedReminderState = JSON.parse(dueDonationWindow.localStorage.getItem("foss.workouts.v1"));
assert.ok(advancedReminderState.settings.donationReminderNextAt > Date.now() + 29 * 86400000);
assert.ok(dueDonationWindow.document.getElementById("donationReminderClose"));
dueDonationDom.window.close();

const dismissDonationDom = new JSDOM(html, {
  runScripts: "outside-only",
  url: "https://foss-donation-dismiss.local/",
  pretendToBeVisual: true
});
const dismissDonationWindow = dismissDonationDom.window;
dismissDonationWindow.scrollTo = function () {};
dismissDonationWindow.HTMLCanvasElement.prototype.getContext = window.HTMLCanvasElement.prototype.getContext;
dismissDonationWindow.localStorage.setItem("foss.workouts.v1", JSON.stringify({
  version: 20,
  profile: { onboarded: true, units: "lb", standard: "male", bodyWeightKg: 81.6, heightCm: 175.3 },
  lifts: [],
  plans: [],
  workouts: [],
  measurements: [],
  cardio: [],
  settings: {
    progression: "training",
    locationSetupComplete: true,
    availableLocations: ["home"],
    activeLocation: "home",
    donationReminderNextAt: Date.now() - 1000
  }
}));
dismissDonationWindow.eval(coreSource);
dismissDonationWindow.eval(equipmentSource);
dismissDonationWindow.eval(guidesSource);
dismissDonationWindow.eval(recordsSource);
dismissDonationWindow.eval(appSource);
dismissDonationWindow.document.getElementById("donationReminderClose").click();
assert.ok(dismissDonationWindow.document.getElementById("donationReminder").classList.contains("hidden"));
assert.ok(!dismissDonationWindow.document.getElementById("donationModal").classList.contains("open"));
assert.ok(JSON.parse(dismissDonationWindow.localStorage.getItem("foss.workouts.v1")).settings.donationReminderNextAt > Date.now() + 29 * 86400000);
dismissDonationDom.window.close();

console.log("Foss Gym UI smoke test passed");

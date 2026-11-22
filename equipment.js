(function (root) {
  "use strict";

  const SOURCES = {
    planet_clubs: "https://www.planetfitness.com/our-clubs",
    planet_circuit: "https://www.planetfitness.com/blog/articles/beginner-basics-30-minute-gym-machine-workout-routine",
    planet_location: "https://www.planetfitness.com/gyms/tigard-or/",
    crunch_equipment: "https://www.crunch.com/thehub/what-equipment-does-crunch-fitness-provide/",
    crunch_signature: "https://www.crunch.com/thehub/crunch-signature-gyms-where-fitness-is-a-lifestyle/",
    crunch_location: "https://www.crunch.com/locations/w-54th-st",
    crunch_about: "https://www.crunch.com/about"
  };

  const ITEMS = [
    { id: "dumbbells", name: "Dumbbells", category: "Free weights", kind: "free_weights", planet: "chain", crunch: "chain" },
    { id: "fixed-barbells", name: "Fixed or standard barbells", category: "Free weights", kind: "free_weights", planet: "chain", crunch: "chain" },
    { id: "olympic-barbell", name: "Olympic barbells", category: "Free weights", kind: "free_weights", planet: "select", crunch: "chain" },
    { id: "ez-curl-bar", name: "EZ curl bars", category: "Free weights", kind: "free_weights", planet: "common", crunch: "common" },
    { id: "weight-plates", name: "Weight plates", category: "Free weights", kind: "free_weights", planet: "common", crunch: "chain" },
    { id: "bumper-plates", name: "Bumper plates", category: "Free weights", kind: "free_weights", planet: null, crunch: "select" },
    { id: "flat-bench", name: "Flat bench", category: "Benches and racks", kind: "accessory", planet: "chain", crunch: "chain" },
    { id: "adjustable-bench", name: "Adjustable bench", category: "Benches and racks", kind: "accessory", planet: "chain", crunch: "chain" },
    { id: "preacher-bench", name: "Preacher curl bench", category: "Benches and racks", kind: "accessory", planet: "common", crunch: "common" },
    { id: "squat-rack", name: "Squat or power rack", category: "Benches and racks", kind: "free_weights", planet: null, crunch: "chain" },
    { id: "olympic-platform", name: "Olympic half rack and lifting platform", category: "Benches and racks", kind: "free_weights", planet: null, crunch: "chain" },
    { id: "smith-machine", name: "Smith machine", category: "Machines", kind: "machine", planet: "chain", crunch: "common" },
    { id: "fitbench", name: "FITBENCH training station", category: "Functional training", kind: "functional", planet: "chain", crunch: null },
    { id: "cable-tower", name: "Cable tower", category: "Machines", kind: "machine", planet: "chain", crunch: "chain" },
    { id: "dual-adjustable-pulley", name: "Dual adjustable pulley", category: "Machines", kind: "machine", planet: "chain", crunch: "common" },
    { id: "lat-pulldown-machine", name: "Lat pulldown machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "seated-row-machine", name: "Seated row machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "t-bar-row-machine", name: "T-bar row or landmine row station", category: "Machines", kind: "machine", planet: "select", crunch: "common" },
    { id: "chest-press-machine", name: "Chest press machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "supine-bench-press-machine", name: "Plate-loaded supine bench press", category: "Machines", kind: "machine", planet: "select", crunch: "select" },
    { id: "shoulder-press-machine", name: "Shoulder press machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "pec-deck", name: "Pec deck and rear delt machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "assisted-pullup-dip", name: "Assisted pull-up and dip machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "biceps-curl-machine", name: "Biceps curl machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "triceps-extension-machine", name: "Triceps extension machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "ab-crunch-machine", name: "Ab crunch machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "torso-rotation-machine", name: "Torso rotation machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "back-extension-machine", name: "Back extension machine or Roman chair", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "reverse-hyper-machine", name: "Reverse hyperextension machine", category: "Machines", kind: "machine", planet: null, crunch: "select" },
    { id: "leg-press-machine", name: "Leg press machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "hack-squat-machine", name: "Hack squat machine", category: "Machines", kind: "machine", planet: "select", crunch: "common" },
    { id: "leg-extension-machine", name: "Leg extension machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "leg-curl-machine", name: "Seated or lying leg curl machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "hip-abductor-adductor", name: "Hip abductor and adductor machine", category: "Machines", kind: "machine", planet: "common", crunch: "common" },
    { id: "standing-calf-machine", name: "Standing calf raise machine", category: "Machines", kind: "machine", planet: "select", crunch: "common" },
    { id: "seated-calf-machine", name: "Seated calf raise machine", category: "Machines", kind: "machine", planet: "select", crunch: "common" },
    { id: "hip-thrust-machine", name: "Hip thrust or Booty Builder machine", category: "Machines", kind: "machine", planet: null, crunch: "select" },
    { id: "circuit-machines", name: "30-minute selectorized circuit", category: "Machines", kind: "machine", planet: "chain", crunch: "common" },
    { id: "pullup-bar", name: "Pull-up bar", category: "Functional training", kind: "functional", planet: "common", crunch: "common" },
    { id: "dip-bars", name: "Parallel dip bars", category: "Functional training", kind: "functional", planet: "select", crunch: "common" },
    { id: "kettlebells", name: "Kettlebells", category: "Functional training", kind: "free_weights", planet: "chain", crunch: "chain" },
    { id: "resistance-bands", name: "Resistance bands", category: "Functional training", kind: "functional", planet: "chain", crunch: "chain" },
    { id: "medicine-balls", name: "Medicine balls", category: "Functional training", kind: "functional", planet: "chain", crunch: "chain" },
    { id: "battle-ropes", name: "Battle ropes", category: "Functional training", kind: "functional", planet: "chain", crunch: "chain" },
    { id: "trx", name: "TRX suspension trainer", category: "Functional training", kind: "functional", planet: "chain", crunch: "chain" },
    { id: "bosu", name: "BOSU balance trainer", category: "Functional training", kind: "functional", planet: "chain", crunch: "common" },
    { id: "plyo-box", name: "Plyometric box or step platform", category: "Functional training", kind: "functional", planet: "common", crunch: "chain" },
    { id: "sled", name: "Push and pull sled", category: "Functional training", kind: "functional", planet: null, crunch: "chain" },
    { id: "turf", name: "Functional turf lane", category: "Functional training", kind: "functional", planet: null, crunch: "select" },
    { id: "boxing-bag", name: "Heavy bag or boxing station", category: "Functional training", kind: "functional", planet: null, crunch: "select" },
    { id: "exercise-mat", name: "Exercise mat", category: "Home and accessories", kind: "accessory", planet: "chain", crunch: "chain" },
    { id: "ab-wheel", name: "Ab wheel", category: "Home and accessories", kind: "accessory", planet: "select", crunch: "select" },
    { id: "hand-gripper", name: "Adjustable hand gripper", category: "Home and accessories", kind: "accessory", planet: null, crunch: null },
    { id: "sliders", name: "Exercise sliders or smooth towel", category: "Home and accessories", kind: "accessory", planet: null, crunch: null },
    { id: "stability-ball", name: "Stability ball", category: "Home and accessories", kind: "functional", planet: "select", crunch: "common" },
    { id: "foam-roller", name: "Foam roller", category: "Recovery", kind: "recovery", planet: "common", crunch: "chain" },
    { id: "massage-gun", name: "Massage gun", category: "Recovery", kind: "recovery", planet: null, crunch: "chain" },
    { id: "compression-sleeves", name: "Compression recovery sleeves", category: "Recovery", kind: "recovery", planet: null, crunch: "chain" },
    { id: "lifting-belt", name: "Lifting belt", category: "Home and accessories", kind: "accessory", planet: null, crunch: "chain" },
    { id: "lifting-gloves", name: "Lifting gloves", category: "Home and accessories", kind: "accessory", planet: null, crunch: "chain" },
    { id: "treadmill", name: "Treadmill", category: "Cardio", kind: "cardio", planet: "chain", crunch: "chain" },
    { id: "woodway-treadmill", name: "Woodway treadmill", category: "Cardio", kind: "cardio", planet: null, crunch: "select" },
    { id: "elliptical", name: "Elliptical", category: "Cardio", kind: "cardio", planet: "chain", crunch: "chain" },
    { id: "rower", name: "Rower", category: "Cardio", kind: "cardio", planet: "chain", crunch: "common" },
    { id: "upright-bike", name: "Upright stationary bike", category: "Cardio", kind: "cardio", planet: "chain", crunch: "common" },
    { id: "recumbent-bike", name: "Recumbent bike", category: "Cardio", kind: "cardio", planet: "chain", crunch: "common" },
    { id: "recumbent-stepper", name: "Recumbent stepper", category: "Cardio", kind: "cardio", planet: "chain", crunch: null },
    { id: "stepmill", name: "Stepmill or stair climber", category: "Cardio", kind: "cardio", planet: "chain", crunch: "chain" },
    { id: "arc-trainer", name: "Arc trainer", category: "Cardio", kind: "cardio", planet: "chain", crunch: "common" },
    { id: "upper-body-ergometer", name: "Upper body ergometer", category: "Cardio", kind: "cardio", planet: "chain", crunch: "select" }
  ];

  const REQUIREMENTS = {
    "bench-press": [["olympic-barbell", "weight-plates", "flat-bench", "squat-rack"], ["smith-machine", "flat-bench"], ["supine-bench-press-machine"]],
    "incline-bench": [["olympic-barbell", "weight-plates", "adjustable-bench", "squat-rack"], ["smith-machine", "adjustable-bench"]],
    "dumbbell-bench": [["dumbbells", "flat-bench"]],
    "dumbbell-fly": [["dumbbells", "flat-bench"]],
    "bent-row": [["olympic-barbell", "weight-plates"], ["fixed-barbells"], ["smith-machine"]],
    "lat-pulldown": [["lat-pulldown-machine"], ["cable-tower"]],
    "t-bar-row": [["t-bar-row-machine"], ["olympic-barbell", "weight-plates"]],
    "seated-cable-row": [["seated-row-machine"], ["cable-tower"]],
    "pull-up": [["pullup-bar"], ["assisted-pullup-dip"]],
    "chin-up": [["pullup-bar"], ["assisted-pullup-dip"]],
    "inverted-row": [["smith-machine"], ["trx"]],
    "overhead-press": [["olympic-barbell", "weight-plates", "squat-rack"], ["fixed-barbells"], ["smith-machine"]],
    "seated-press": [["olympic-barbell", "weight-plates", "adjustable-bench", "squat-rack"], ["smith-machine", "adjustable-bench"]],
    "dumbbell-shoulder-press": [["dumbbells", "adjustable-bench"]],
    "arnold-press": [["dumbbells", "adjustable-bench"]],
    "lateral-raise": [["dumbbells"], ["cable-tower"]],
    "barbell-shrug": [["olympic-barbell", "weight-plates"], ["fixed-barbells"], ["smith-machine"]],
    "dumbbell-shrug": [["dumbbells"]],
    "upright-row": [["fixed-barbells"], ["olympic-barbell", "weight-plates"], ["cable-tower"]],
    "scapular-pull-up": [["pullup-bar"]],
    "barbell-curl": [["fixed-barbells"], ["ez-curl-bar", "weight-plates"], ["olympic-barbell", "weight-plates"]],
    "preacher-curl": [["preacher-bench", "ez-curl-bar", "weight-plates"], ["biceps-curl-machine"]],
    "dumbbell-curl": [["dumbbells"]],
    "hammer-curl": [["dumbbells"]],
    "close-grip-bench": [["olympic-barbell", "weight-plates", "flat-bench", "squat-rack"], ["smith-machine", "flat-bench"]],
    "tricep-extension": [["ez-curl-bar", "weight-plates", "flat-bench"], ["dumbbells", "flat-bench"]],
    "tricep-pushdown": [["cable-tower"], ["triceps-extension-machine"]],
    "parallel-dip": [["dip-bars"], ["assisted-pullup-dip"]],
    "bench-dip": [["flat-bench"], ["adjustable-bench"]],
    "wrist-curl": [["dumbbells"], ["fixed-barbells"], ["ez-curl-bar", "weight-plates"]],
    "reverse-wrist-curl": [["dumbbells"], ["fixed-barbells"], ["ez-curl-bar", "weight-plates"]],
    "reverse-barbell-curl": [["fixed-barbells"], ["ez-curl-bar", "weight-plates"]],
    "finger-curl": [["dumbbells"], ["fixed-barbells"]],
    "hand-gripper": [["hand-gripper"]],
    "cable-crunch": [["cable-tower"], ["ab-crunch-machine"]],
    "weighted-situp": [["dumbbells"], ["medicine-balls"], ["weight-plates"]],
    "hanging-knee-raise": [["pullup-bar"]],
    "hanging-leg-raise": [["pullup-bar"]],
    "ab-wheel-rollout": [["ab-wheel"]],
    "cable-wood-chop": [["cable-tower"], ["torso-rotation-machine"]],
    "dumbbell-side-bend": [["dumbbells"]],
    "deadlift": [["olympic-barbell", "weight-plates"]],
    "reverse-hyper": [["reverse-hyper-machine"]],
    "back-extension": [["back-extension-machine"]],
    "back-squat": [["olympic-barbell", "weight-plates", "squat-rack"], ["smith-machine"]],
    "front-squat": [["olympic-barbell", "weight-plates", "squat-rack"], ["smith-machine"]],
    "leg-press": [["leg-press-machine"]],
    "calf-press": [["leg-press-machine"]],
    "bulgarian-split-squat": [["flat-bench"], ["adjustable-bench"], ["plyo-box"]],
    "step-up": [["plyo-box"], ["flat-bench"]],
    "romanian-deadlift": [["olympic-barbell", "weight-plates"], ["dumbbells"], ["smith-machine"]],
    "good-morning": [["olympic-barbell", "weight-plates", "squat-rack"], ["smith-machine"]],
    "lying-leg-curl": [["leg-curl-machine"]],
    "nordic-curl": [["flat-bench"], ["olympic-platform"]],
    "sliding-leg-curl": [["sliders"]],
    "sumo-squat": [["dumbbells"], ["kettlebells"], ["olympic-barbell", "weight-plates"], ["smith-machine"]],
    "adductor-machine": [["hip-abductor-adductor"]],
    "hip-thrust": [["hip-thrust-machine"], ["olympic-barbell", "weight-plates", "flat-bench"], ["smith-machine", "flat-bench"]],
    "sumo-deadlift": [["olympic-barbell", "weight-plates"]],
    "cable-kickback": [["cable-tower"]],
    "standing-calf-raise": [["standing-calf-machine"], ["smith-machine"], ["dumbbells"]],
    "seated-calf-raise": [["seated-calf-machine"], ["dumbbells", "flat-bench"]]
  };

  ITEMS.forEach(function (item) {
    item.sources = [];
    if (item.planet) item.sources.push(item.id === "circuit-machines" ? SOURCES.planet_circuit : item.planet === "chain" ? SOURCES.planet_clubs : SOURCES.planet_location);
    if (item.crunch) item.sources.push(item.crunch === "chain" ? SOURCES.crunch_equipment : item.crunch === "common" ? SOURCES.crunch_location : SOURCES.crunch_signature);
  });

  function items() {
    return ITEMS.map(function (item) { return Object.assign({}, item, { sources: item.sources.slice() }); });
  }

  function itemById(id) {
    const found = ITEMS.find(function (item) { return item.id === id; });
    return found ? Object.assign({}, found, { sources: found.sources.slice() }) : null;
  }

  function defaultEquipment(locationId) {
    if (locationId !== "planet" && locationId !== "crunch") return [];
    return ITEMS.filter(function (item) {
      return item[locationId] === "chain" || item[locationId] === "common";
    }).map(function (item) { return item.id; });
  }

  function requirements(exerciseId) {
    return (REQUIREMENTS[exerciseId] || []).map(function (option) { return option.slice(); });
  }

  root.FossEquipment = {
    sources: Object.assign({}, SOURCES),
    items: items,
    itemById: itemById,
    defaultEquipment: defaultEquipment,
    requirements: requirements,
    allRequirements: function () {
      const copy = {};
      Object.keys(REQUIREMENTS).forEach(function (id) { copy[id] = requirements(id); });
      return copy;
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : this);

(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.FossCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const KG_TO_LB = 2.2046226218;
  const CM_TO_IN = 0.3937007874;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value, digits) {
    const factor = Math.pow(10, digits || 0);
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  }

  function kgToDisplay(kg, units) {
    return units === "kg" ? Number(kg) : Number(kg) * KG_TO_LB;
  }

  function displayToKg(value, units) {
    return units === "kg" ? Number(value) : Number(value) / KG_TO_LB;
  }

  function cmToDisplay(cm, units) {
    return units === "kg" ? Number(cm) : Number(cm) * CM_TO_IN;
  }

  function displayToCm(value, units) {
    return units === "kg" ? Number(value) : Number(value) / CM_TO_IN;
  }

  function interpolate(x, x1, x2, y1, y2) {
    if (x2 === x1) return y2;
    const t = clamp((x - x1) / (x2 - x1), 0, 1);
    return y1 + (y2 - y1) * t;
  }

  function percentileForRatio(ratio, standards) {
    const points = [
      [0, 1],
      [standards[0], 20],
      [standards[1], 40],
      [standards[2], 60],
      [standards[3], 80],
      [standards[4], 95],
      [standards[4] * 1.25, 99]
    ];
    const safeRatio = Math.max(0, Number(ratio) || 0);
    for (let i = 1; i < points.length; i += 1) {
      if (safeRatio <= points[i][0]) {
        return round(interpolate(safeRatio, points[i - 1][0], points[i][0], points[i - 1][1], points[i][1]), 1);
      }
    }
    return 99;
  }

  function valueForPercentile(percentile, standards) {
    if (!Array.isArray(standards) || standards.length < 5) return 0;
    const points = [
      [1, 0],
      [20, standards[0]],
      [40, standards[1]],
      [60, standards[2]],
      [80, standards[3]],
      [95, standards[4]],
      [99, standards[4] * 1.25]
    ];
    const target = clamp(Number(percentile) || 1, 1, 99);
    for (let i = 1; i < points.length; i += 1) {
      if (target <= points[i][0]) {
        return interpolate(target, points[i - 1][0], points[i][0], points[i - 1][1], points[i][1]);
      }
    }
    return points[points.length - 1][1];
  }

  function fossaPoints(score) {
    return Math.round(clamp(Number(score) || 0, 0, 99) * 100);
  }

  function bakiPoints(score) {
    const points = Math.max(0, Number(score) || 0) * 100;
    return points > 0 ? Math.round(Math.pow(points, 3) * 1000) : 0;
  }

  function progressionTargetPercentile(stepScore, schemeId) {
    if (schemeId === "baki") return Math.max(0, Number(stepScore) || 0);
    const step = clamp(Number(stepScore) || 1, 1, 99);
    return step;
  }

  function rankLift(liftedWeightKg, bodyWeightKg, standards) {
    const max = Number(liftedWeightKg);
    const body = Number(bodyWeightKg);
    if (!Number.isFinite(max) || max <= 0 || !Number.isFinite(body) || body <= 0 || !standards) {
      return { percentile: 0, ratio: 0, tier: "Not tested", color: "#3B433F", progression: null };
    }
    const ratio = max / body;
    const percentile = percentileForRatio(ratio, standards);
    let tier = "Starter";
    let color = "#FF5C5C";
    if (percentile >= 95) {
      tier = "Elite";
      color = "#2DE2B6";
    } else if (percentile >= 80) {
      tier = "Advanced";
      color = "#62E66F";
    } else if (percentile >= 60) {
      tier = "Intermediate";
      color = "#B9F64A";
    } else if (percentile >= 40) {
      tier = "Novice";
      color = "#FFD15C";
    } else if (percentile >= 20) {
      tier = "Beginner";
      color = "#FF9E55";
    }
    return { percentile: percentile, ratio: ratio, tier: tier, color: color, progression: rankProgress(percentile) };
  }

  function rankReps(reps, standards) {
    const count = Math.round(Number(reps));
    if (!Number.isFinite(count) || count <= 0 || !standards) {
      return { percentile: 0, reps: 0, tier: "Not tested", color: "#3B433F", progression: null };
    }
    const percentile = percentileForRatio(count, standards);
    let tier = "Starter";
    let color = "#FF5C5C";
    if (percentile >= 95) {
      tier = "Elite";
      color = "#2DE2B6";
    } else if (percentile >= 80) {
      tier = "Advanced";
      color = "#62E66F";
    } else if (percentile >= 60) {
      tier = "Intermediate";
      color = "#B9F64A";
    } else if (percentile >= 40) {
      tier = "Novice";
      color = "#FFD15C";
    } else if (percentile >= 20) {
      tier = "Beginner";
      color = "#FF9E55";
    }
    return { percentile: percentile, reps: count, tier: tier, color: color, progression: rankProgress(percentile) };
  }

  function rankProgress(score) {
    const percentile = clamp(Number(score) || 1, 1, 99);
    const totalRanks = 11 * 70;
    const position = Math.round((percentile - 1) / 98 * (totalRanks - 1)) + 1;
    const prestige = Math.floor((position - 1) / 70);
    const level = (position - 1) % 70 + 1;
    const names = [
      "Recruit",
      "Operator",
      "Enforcer",
      "Specialist",
      "Veteran",
      "Commander",
      "Warlord",
      "Apex",
      "Legendary",
      "Master",
      "Elite"
    ];
    const isMaximum = prestige === 10 && level === 70;
    return {
      prestige: prestige,
      level: level,
      badge: "P" + prestige,
      prestigeLabel: prestige === 0 ? "No Prestige" : "Prestige " + prestige,
      title: isMaximum ? "Maximum Elite" : names[prestige],
      isMaximum: isMaximum,
      position: position,
      totalRanks: totalRanks
    };
  }

  const PROGRESSION_SCHEMES = [
    {
      id: "cod",
      name: "Prestige",
      description: "70 levels across 10 prestiges, ending at Maximum Elite."
    },
    {
      id: "tiers",
      name: "Tier Scale",
      description: "A simple ladder from F tier through S tier."
    },
    {
      id: "rpg",
      name: "RPG levels",
      description: "Level 1 to 99 with fantasy character classes."
    },
    {
      id: "competitive",
      name: "Competitive",
      description: "Iron through Apex with familiar ranked divisions."
    },
    {
      id: "dragonball",
      name: "Dragon Ball",
      description: "A just-for-fun Dragon Ball character equivalent."
    },
    {
      id: "souls",
      name: "Soulslike",
      description: "A dark-fantasy path from Hollow to Elden."
    },
    {
      id: "power",
      name: "Power class",
      description: "Civilian through Omega power classifications."
    },
    {
      id: "rarity",
      name: "Loot rarity",
      description: "Common through Ascendant achievement rarity."
    },
    {
      id: "boss",
      name: "Boss ranks",
      description: "Minion through World Boss."
    },
    {
      id: "csgo_knives",
      name: "CS:GO knife rating",
      description: "A just-for-fun community-style ladder across all 20 knife models, from Navaja to Karambit."
    },
    {
      id: "ex_scale",
      name: "Infinite Ammo",
      description: "One brutal line until the top rank makes you the ex."
    },
    {
      id: "baki",
      name: "Baki logic",
      description: "A parody character ladder with impossible exercise targets, ridiculous feats, and completely stupid XP."
    },
    {
      id: "training",
      name: "Training level",
      description: "Plain-language lifting levels from untrained to world class."
    }
  ];

  const TIER_SCHEMES = {
    tiers: [
      [1, "F", "Untrained"],
      [10, "D", "Beginner"],
      [25, "C", "Novice"],
      [40, "B", "Intermediate"],
      [55, "A", "Advanced"],
      [70, "S", "Elite"]
    ],
    rpg: [
      [1, "LV 1", "Novice"],
      [11, "LV 11", "Adventurer"],
      [21, "LV 21", "Warrior"],
      [31, "LV 31", "Champion"],
      [41, "LV 41", "Hero"],
      [51, "LV 51", "Legend"],
      [61, "LV 61", "Mythic"],
      [71, "LV 71", "Ascendant"],
      [81, "LV 81", "Titan"],
      [91, "LV 91", "Godlike"]
    ],
    competitive: [
      [1, "IRON III", "Iron III"], [5, "IRON II", "Iron II"], [9, "IRON I", "Iron I"],
      [13, "BRONZE III", "Bronze III"], [17, "BRONZE II", "Bronze II"], [21, "BRONZE I", "Bronze I"],
      [25, "SILVER III", "Silver III"], [29, "SILVER II", "Silver II"], [33, "SILVER I", "Silver I"],
      [37, "GOLD III", "Gold III"], [41, "GOLD II", "Gold II"], [45, "GOLD I", "Gold I"],
      [49, "PLAT III", "Platinum III"], [53, "PLAT II", "Platinum II"], [57, "PLAT I", "Platinum I"],
      [61, "DIAMOND III", "Diamond III"], [65, "DIAMOND II", "Diamond II"], [69, "DIAMOND I", "Diamond I"],
      [73, "MASTER III", "Master III"], [77, "MASTER II", "Master II"], [81, "MASTER I", "Master I"],
      [85, "GRAND III", "Grandmaster III"], [89, "GRAND II", "Grandmaster II"], [93, "GRAND I", "Grandmaster I"],
      [97, "APEX", "Apex"]
    ],
    dragonball: [
      [1, "MR. SATAN", "Mr. Satan equivalent"],
      [8, "YAMCHA", "Yamcha equivalent"],
      [16, "ROSHI", "Master Roshi equivalent"],
      [24, "KRILLIN", "Krillin equivalent"],
      [32, "TIEN", "Tien equivalent"],
      [40, "ANDROID 18", "Android 18 equivalent"],
      [49, "PICCOLO", "Piccolo equivalent"],
      [58, "GOHAN", "Gohan equivalent"],
      [67, "VEGETA", "Vegeta equivalent"],
      [76, "GOKU", "Goku equivalent"],
      [85, "BROLY", "Broly equivalent"],
      [92, "BEERUS", "Beerus equivalent"],
      [97, "WHIS", "Whis equivalent"],
      [99, "ZENO", "Zeno equivalent"]
    ],
    souls: [
      [1, "HOLLOW", "Hollow"], [14, "TARNISHED", "Tarnished"], [27, "ASHEN", "Ashen"],
      [40, "KNIGHT", "Knight"], [54, "CHAMPION", "Champion"], [68, "LORD", "Lord"],
      [82, "DEMIGOD", "Demigod"], [95, "ELDEN", "Elden"]
    ],
    power: [
      [1, "CIVILIAN", "Civilian"], [14, "INITIATE", "Initiate"], [27, "FIGHTER", "Fighter"],
      [40, "WARRIOR", "Warrior"], [54, "CHAMPION", "Champion"], [68, "MASTER", "Master"],
      [82, "TITAN", "Titan"], [95, "OMEGA", "Omega"]
    ],
    rarity: [
      [1, "COMMON", "Common"], [16, "UNCOMMON", "Uncommon"], [31, "RARE", "Rare"],
      [46, "EPIC", "Epic"], [61, "LEGENDARY", "Legendary"], [76, "MYTHIC", "Mythic"],
      [91, "ASCENDANT", "Ascendant"]
    ],
    boss: [
      [1, "MINION", "Minion"], [14, "GRUNT", "Grunt"], [27, "ENFORCER", "Enforcer"],
      [40, "CAPTAIN", "Captain"], [54, "WARLORD", "Warlord"], [68, "BOSS", "Boss"],
      [82, "RAID BOSS", "Raid Boss"], [95, "WORLD BOSS", "World Boss"]
    ],
    csgo_knives: [
      [1, "NAVAJA", "Navaja Knife"], [6, "DAGGERS", "Shadow Daggers"],
      [11, "GUT", "Gut Knife"], [16, "SURVIVAL", "Survival Knife"],
      [21, "FALCHION", "Falchion Knife"], [26, "URSUS", "Ursus Knife"],
      [31, "BOWIE", "Bowie Knife"], [36, "NOMAD", "Nomad Knife"],
      [41, "PARACORD", "Paracord Knife"], [46, "CLASSIC", "Classic Knife"],
      [51, "HUNTSMAN", "Huntsman Knife"], [56, "FLIP", "Flip Knife"],
      [61, "KUKRI", "Kukri Knife"], [66, "BAYONET", "Bayonet"],
      [71, "STILETTO", "Stiletto Knife"], [76, "SKELETON", "Skeleton Knife"],
      [81, "TALON", "Talon Knife"], [86, "M9", "M9 Bayonet"],
      [94, "BUTTERFLY", "Butterfly Knife"], [99, "KARAMBIT", "Karambit"]
    ],
    ex_scale: [
      [1, "SHE SAID, \"YOU LOOK LIKE MY EX, JUST SMALLER.\"", "She said, \"You look like my ex, just smaller.\""],
      [99, "YOU ARE THE EX.", "You are the ex."]
    ],
    baki: [
      [100, "SUEDO", "Card pinch"],
      [250, "DOPPO", "Coin folder"],
      [500, "SHIBUKAWA", "Human catapult"],
      [1000, "HANAYAMA", "Full-deck destroyer"],
      [2500, "RETSU", "Chain breaker"],
      [5000, "KAKU KAIOH", "Concrete eraser"],
      [10000, "OLIVA", "Steel-door opener"],
      [25000, "JACK", "Car stopper"],
      [50000, "PICKLE", "Dinosaur problem"],
      [100000, "BAKI", "Earthquake argument"],
      [1000000, "YUJIRO", "Physics resigns"]
    ],
    training: [
      [1, "UNTRAINED", "Untrained"], [10, "BEGINNER", "Beginner"], [20, "NOVICE", "Novice"],
      [30, "RECREATIONAL", "Recreational lifter"], [42, "TRAINED", "Trained lifter"],
      [55, "ATHLETE", "Athlete"], [68, "COMPETITOR", "Competitive athlete"],
      [80, "ADVANCED", "Advanced athlete"], [90, "ELITE", "Elite athlete"],
      [98, "WORLD CLASS", "World class"]
    ]
  };

  function progressionSchemes() {
    return PROGRESSION_SCHEMES.map(function (scheme) {
      return { id: scheme.id, name: scheme.name, description: scheme.description };
    });
  }

  function progressionSteps(schemeId) {
    const selected = PROGRESSION_SCHEMES.find(function (scheme) { return scheme.id === schemeId; }) || PROGRESSION_SCHEMES[0];
    if (selected.id === "cod") {
      const steps = [];
      let previousPrestige = -1;
      for (let score = 1; score <= 99; score += 1) {
        const rank = rankProgress(score);
        if (rank.prestige !== previousPrestige || score === 99) {
          steps.push({ at: score, primary: rank.badge, title: rank.title, detail: score === 99 ? "Level 70" : "Prestige " + rank.prestige });
          previousPrestige = rank.prestige;
        }
      }
      return steps;
    }
    const tiers = TIER_SCHEMES[selected.id] || TIER_SCHEMES.tiers;
    return tiers.map(function (tier) {
      return {
        at: tier[0],
        primary: selected.id === "rpg" ? "LV " + tier[0] : tier[1],
        title: tier[2],
        detail: selected.name
      };
    });
  }

  function progressionForScore(score, schemeId) {
    const selected = PROGRESSION_SCHEMES.find(function (scheme) { return scheme.id === schemeId; }) || PROGRESSION_SCHEMES[0];
    const basePercentile = selected.id === "baki"
      ? round(clamp(Number(score) || 0, 0, 1000000), 3)
      : clamp(Math.round(Number(score) || 1), 1, 99);
    const percentile = basePercentile;
    if (selected.id === "baki") {
      const tiers = TIER_SCHEMES.baki;
      let index = -1;
      for (let i = 0; i < tiers.length; i += 1) {
        if (percentile >= tiers[i][0]) index = i;
      }
      const current = index >= 0 ? tiers[index] : [0, "HUMAN", "Below Suedo"];
      const next = tiers[index + 1] || null;
      const distance = next ? next[0] - current[0] : 1;
      const progress = next ? clamp((percentile - current[0]) / distance * 100, 0, 99) : 100;
      return {
        schemeId: selected.id,
        schemeName: selected.name,
        primary: current[1],
        shortLabel: current[1],
        title: current[2],
        detail: "Baki character scale",
        nextTitle: next ? next[1] + " · " + next[2] : null,
        nextAt: next ? next[0] : null,
        currentAt: current[0],
        progressToNext: round(progress, 1),
        percentile: percentile,
        basePercentile: basePercentile,
        isMaximum: !next
      };
    }
    if (selected.id === "cod") {
      const cod = rankProgress(percentile);
      const scoreIsMaximum = percentile >= 99;
      const nextScore = scoreIsMaximum ? null : Math.min(99, Math.floor(percentile) + 1);
      const nextCod = nextScore ? rankProgress(nextScore) : null;
      return {
        schemeId: selected.id,
        schemeName: selected.name,
        primary: cod.badge,
        shortLabel: cod.badge + " L" + cod.level,
        title: cod.title,
        detail: "Level " + cod.level,
        nextTitle: nextCod ? nextCod.title + " (" + nextCod.badge + " L" + nextCod.level + ")" : null,
        nextAt: nextScore,
        currentAt: percentile,
        progressToNext: scoreIsMaximum ? 100 : round((percentile - Math.floor(percentile)) * 100, 1),
        percentile: percentile,
        basePercentile: basePercentile,
        isMaximum: scoreIsMaximum
      };
    }

    const tiers = TIER_SCHEMES[selected.id] || TIER_SCHEMES.tiers;
    let index = 0;
    for (let i = 0; i < tiers.length; i += 1) {
      if (percentile >= tiers[i][0]) index = i;
    }
    const current = tiers[index];
    const next = tiers[index + 1] || null;
    const primary = selected.id === "rpg" ? "LV " + Math.round(percentile) : current[1];
    const shortLabel = selected.id === "ex_scale"
      ? (next ? "JUST SMALLER" : "THE EX")
      : primary;
    const distance = next ? next[0] - current[0] : 1;
    const progress = next ? clamp((percentile - current[0]) / distance * 100, 0, 99) : 100;
    return {
      schemeId: selected.id,
      schemeName: selected.name,
      primary: primary,
      shortLabel: shortLabel,
      title: current[2],
      detail: selected.name,
      nextTitle: next ? next[2] : null,
      nextAt: next ? next[0] : null,
      currentAt: current[0],
      progressToNext: round(progress, 1),
      percentile: percentile,
      basePercentile: basePercentile,
      isMaximum: !next
    };
  }

  function ordinal(value) {
    const n = Math.round(Number(value) || 0);
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 13) return n + "th";
    if (n % 10 === 1) return n + "st";
    if (n % 10 === 2) return n + "nd";
    if (n % 10 === 3) return n + "rd";
    return n + "th";
  }

  function calculateBMI(weightKg, heightCm) {
    const weight = Number(weightKg);
    const heightMeters = Number(heightCm) / 100;
    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(heightMeters) || heightMeters <= 0) return 0;
    return round(weight / (heightMeters * heightMeters), 1);
  }

  function bmiCategory(bmi) {
    const value = Number(bmi);
    if (!Number.isFinite(value) || value <= 0) return "Not available";
    if (value < 18.5) return "Underweight";
    if (value < 25) return "Healthy weight";
    if (value < 30) return "Overweight";
    if (value < 35) return "Obesity, class 1";
    if (value < 40) return "Obesity, class 2";
    return "Obesity, class 3";
  }

  function estimateTapeBodyFat(standard, heightCm, waistCm, neckCm, hipCm) {
    const heightIn = Number(heightCm) * CM_TO_IN;
    const waistIn = Number(waistCm) * CM_TO_IN;
    const neckIn = Number(neckCm) * CM_TO_IN;
    const hipIn = Number(hipCm) * CM_TO_IN;
    if (![heightIn, waistIn, neckIn].every((value) => Number.isFinite(value) && value > 0)) return 0;
    let estimate = 0;
    if (standard === "female") {
      if (!Number.isFinite(hipIn) || hipIn <= 0 || waistIn + hipIn <= neckIn) return 0;
      estimate = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    } else {
      if (waistIn <= neckIn) return 0;
      estimate = 86.01 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
    }
    return round(clamp(estimate, 2, 70), 1);
  }

  return {
    KG_TO_LB,
    CM_TO_IN,
    clamp,
    round,
    kgToDisplay,
    displayToKg,
    cmToDisplay,
    displayToCm,
    percentileForRatio,
    valueForPercentile,
    fossaPoints,
    bakiPoints,
    progressionTargetPercentile,
    rankLift,
    rankReps,
    rankProgress,
    progressionSchemes,
    progressionSteps,
    progressionForScore,
    ordinal,
    calculateBMI,
    bmiCategory,
    estimateTapeBodyFat
  };
});

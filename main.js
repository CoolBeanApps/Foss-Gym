(function () {
  "use strict";

  const core = window.FossCore;
  const equipment = window.FossEquipment;
  const STORAGE_KEY = "foss.workouts.v1";

  const LOCATIONS = [
    { id: "planet", name: "Planet Fitness", setupName: "Planet Fitness", icon: "P", help: "Typical club inventory" },
    { id: "crunch", name: "Crunch Fitness", setupName: "Crunch Fitness", icon: "C", help: "Typical club inventory" },
    { id: "apartment", name: "Apartment", setupName: "Apartment", icon: "A", help: "Match your complex gym" },
    { id: "home", name: "Home", setupName: "Home Gym", icon: "H", help: "Your equipment or no equipment" }
  ];

  const GROUPS = [
    { id: "chest", name: "Chest", defaultExercise: "bench-press" },
    { id: "back", name: "Back", defaultExercise: "bent-row" },
    { id: "shoulders", name: "Shoulders", defaultExercise: "overhead-press" },
    { id: "traps", name: "Traps", defaultExercise: "barbell-shrug" },
    { id: "biceps", name: "Biceps", defaultExercise: "barbell-curl" },
    { id: "triceps", name: "Triceps", defaultExercise: "close-grip-bench" },
    { id: "forearms", name: "Forearms", defaultExercise: "hand-gripper" },
    { id: "core", name: "Abs", defaultExercise: "cable-crunch" },
    { id: "obliques", name: "Obliques", defaultExercise: "cable-wood-chop" },
    { id: "lower-back", name: "Lower Back", defaultExercise: "deadlift" },
    { id: "quads", name: "Quads", defaultExercise: "back-squat" },
    { id: "hamstrings", name: "Hamstrings", defaultExercise: "romanian-deadlift" },
    { id: "adductors", name: "Adductors", defaultExercise: "sumo-squat" },
    { id: "glutes", name: "Glutes", defaultExercise: "hip-thrust" },
    { id: "calves", name: "Calves", defaultExercise: "standing-calf-raise" }
  ];

  const EXERCISES = [
    { id: "bench-press", name: "Bench Press", group: "chest", motion: "press", male: [0.5, 1, 1.25, 1.5, 2], female: [0.3, 0.5, 0.75, 1.1, 1.45] },
    { id: "incline-bench", name: "Incline Bench Press", group: "chest", motion: "press", male: [0.5, 0.75, 1, 1.5, 1.75], female: [0.25, 0.4, 0.65, 0.95, 1.25] },
    { id: "dumbbell-bench", name: "Dumbbell Bench Press (total)", group: "chest", motion: "press", male: [0.4, 0.7, 1, 1.4, 1.8], female: [0.2, 0.4, 0.6, 0.9, 1.2] },
    { id: "dumbbell-fly", name: "Dumbbell Fly (total)", group: "chest", motion: "press", male: [0.2, 0.4, 0.6, 0.9, 1.2], female: [0.1, 0.2, 0.4, 0.5, 0.7] },
    { id: "push-up", name: "Push-Up", group: "chest", motion: "pushup", type: "bodyweight", male: [5, 15, 30, 50, 75], female: [3, 10, 20, 35, 55] },
    { id: "decline-push-up", name: "Decline Push-Up", group: "chest", motion: "pushup", type: "bodyweight", male: [3, 10, 20, 35, 55], female: [2, 7, 15, 27, 42] },
    { id: "wide-push-up", name: "Wide Push-Up", group: "chest", motion: "pushup", type: "bodyweight", male: [4, 12, 25, 42, 65], female: [3, 9, 18, 32, 50] },
    { id: "wall-push-up", name: "Wall Push-Up", group: "chest", motion: "pushup", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },

    { id: "bent-row", name: "Bent-Over Row", group: "back", motion: "row", male: [0.5, 0.75, 1, 1.5, 1.75], female: [0.3, 0.45, 0.7, 0.95, 1.25] },
    { id: "lat-pulldown", name: "Lat Pulldown", group: "back", motion: "pull", male: [0.5, 0.75, 1, 1.5, 1.75], female: [0.35, 0.5, 0.75, 0.95, 1.25] },
    { id: "t-bar-row", name: "T-Bar Row", group: "back", motion: "row", male: [0.5, 0.75, 1, 1.5, 2], female: [0.25, 0.4, 0.7, 1, 1.35] },
    { id: "seated-cable-row", name: "Seated Cable Row", group: "back", motion: "row", male: [0.5, 0.75, 1, 1.5, 1.75], female: [0.35, 0.5, 0.75, 1, 1.3] },
    { id: "pull-up", name: "Pull-Up", group: "back", motion: "pull", type: "bodyweight", equipment: "Pull-up bar", male: [1, 5, 10, 16, 25], female: [1, 3, 7, 12, 19] },
    { id: "chin-up", name: "Chin-Up", group: "back", motion: "pull", type: "bodyweight", equipment: "Pull-up bar", male: [2, 6, 11, 18, 27], female: [1, 4, 8, 14, 21] },
    { id: "inverted-row", name: "Inverted Row", group: "back", motion: "row", type: "bodyweight", equipment: "Bar or table", male: [4, 10, 18, 30, 45], female: [3, 8, 15, 25, 38] },
    { id: "superman-pull", name: "Superman Pull", group: "back", motion: "bridge", type: "bodyweight", male: [5, 15, 30, 45, 65], female: [4, 12, 25, 40, 58] },

    { id: "overhead-press", name: "Overhead Press", group: "shoulders", motion: "shoulder", male: [0.35, 0.55, 0.8, 1.05, 1.35], female: [0.2, 0.35, 0.5, 0.7, 0.95] },
    { id: "seated-press", name: "Seated Barbell Press", group: "shoulders", motion: "shoulder", male: [0.35, 0.55, 0.8, 1.05, 1.35], female: [0.2, 0.35, 0.5, 0.7, 0.95] },
    { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press (total)", group: "shoulders", motion: "shoulder", male: [0.3, 0.5, 0.8, 1.1, 1.4], female: [0.2, 0.3, 0.5, 0.7, 0.9] },
    { id: "arnold-press", name: "Arnold Press (total)", group: "shoulders", motion: "shoulder", male: [0.2, 0.4, 0.6, 0.9, 1.1], female: [0.2, 0.3, 0.4, 0.5, 0.7] },
    { id: "lateral-raise", name: "Lateral Raise (total)", group: "shoulders", motion: "shoulder", male: [0.1, 0.2, 0.4, 0.6, 0.9], female: [0.1, 0.2, 0.3, 0.4, 0.6] },
    { id: "pike-push-up", name: "Pike Push-Up", group: "shoulders", motion: "pushup", type: "bodyweight", male: [2, 8, 15, 25, 40], female: [1, 5, 11, 19, 31] },
    { id: "handstand-push-up", name: "Handstand Push-Up", group: "shoulders", motion: "pushup", type: "bodyweight", male: [1, 3, 7, 12, 20], female: [1, 2, 5, 9, 15] },
    { id: "wall-walk", name: "Wall Walk", group: "shoulders", motion: "pushup", type: "bodyweight", male: [1, 3, 6, 10, 16], female: [1, 2, 4, 8, 13] },

    { id: "barbell-shrug", name: "Barbell Shrug", group: "traps", motion: "shrug", male: [0.5, 1, 1.5, 2.25, 3], female: [0.25, 0.5, 1, 1.5, 2.25] },
    { id: "dumbbell-shrug", name: "Dumbbell Shrug (total)", group: "traps", motion: "shrug", male: [0.4, 0.7, 1.1, 1.6, 2.2], female: [0.2, 0.4, 0.8, 1.2, 1.7] },
    { id: "upright-row", name: "Upright Row", group: "traps", motion: "row", male: [0.25, 0.45, 0.75, 1.05, 1.45], female: [0.2, 0.3, 0.5, 0.7, 0.95] },
    { id: "scapular-pull-up", name: "Scapular Pull-Up", group: "traps", motion: "pull", type: "bodyweight", equipment: "Pull-up bar", male: [3, 8, 15, 25, 40], female: [2, 6, 12, 21, 34] },
    { id: "prone-y-raise", name: "Prone Y Raise", group: "traps", motion: "shoulder", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [6, 16, 30, 48, 72] },

    { id: "barbell-curl", name: "Barbell Curl", group: "biceps", motion: "curl", male: [0.25, 0.4, 0.6, 0.8, 1.05], female: [0.1, 0.25, 0.4, 0.55, 0.75] },
    { id: "preacher-curl", name: "Preacher Curl", group: "biceps", motion: "curl", male: [0.25, 0.4, 0.55, 0.8, 1.05], female: [0.15, 0.25, 0.4, 0.55, 0.75] },
    { id: "dumbbell-curl", name: "Dumbbell Curl (total)", group: "biceps", motion: "curl", male: [0.2, 0.3, 0.6, 0.8, 1.1], female: [0.1, 0.2, 0.4, 0.6, 0.8] },
    { id: "hammer-curl", name: "Hammer Curl (total)", group: "biceps", motion: "curl", male: [0.2, 0.4, 0.6, 0.8, 1.1], female: [0.2, 0.3, 0.4, 0.5, 0.7] },
    { id: "bodyweight-bicep-curl", name: "Bodyweight Bicep Curl", group: "biceps", motion: "row", type: "bodyweight", male: [2, 6, 12, 20, 30], female: [1, 4, 9, 16, 24] },
    { id: "self-resisted-curl", name: "Self-Resisted Bicep Curl (total)", group: "biceps", motion: "curl", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [6, 16, 30, 48, 72] },

    { id: "close-grip-bench", name: "Close-Grip Bench", group: "triceps", motion: "press", male: [0.5, 0.75, 1.25, 1.5, 2], female: [0.3, 0.5, 0.75, 1.05, 1.35] },
    { id: "tricep-extension", name: "Lying Tricep Extension", group: "triceps", motion: "triceps", male: [0.2, 0.35, 0.55, 0.75, 1], female: [0.1, 0.2, 0.3, 0.5, 0.65] },
    { id: "tricep-pushdown", name: "Tricep Pushdown", group: "triceps", motion: "triceps", male: [0.25, 0.45, 0.7, 1.05, 1.4], female: [0.15, 0.25, 0.45, 0.7, 0.95] },
    { id: "parallel-dip", name: "Parallel Bar Dip", group: "triceps", motion: "dip", type: "bodyweight", equipment: "Dip bars", male: [2, 8, 15, 25, 40], female: [1, 5, 11, 19, 31] },
    { id: "bench-dip", name: "Bench Dip", group: "triceps", motion: "dip", type: "bodyweight", equipment: "Bench", male: [5, 15, 30, 50, 75], female: [3, 10, 22, 38, 58] },
    { id: "diamond-push-up", name: "Diamond Push-Up", group: "triceps", motion: "pushup", type: "bodyweight", male: [3, 10, 20, 35, 55], female: [2, 7, 15, 26, 42] },
    { id: "sphinx-push-up", name: "Sphinx Push-Up", group: "triceps", motion: "pushup", type: "bodyweight", male: [2, 8, 15, 25, 40], female: [1, 5, 11, 19, 31] },

    { id: "wrist-curl", name: "Wrist Curl", group: "forearms", motion: "curl", male: [0.1, 0.25, 0.55, 0.95, 1.45], female: [0.03, 0.15, 0.35, 0.7, 1.15] },
    { id: "reverse-wrist-curl", name: "Reverse Wrist Curl", group: "forearms", motion: "curl", male: [0.05, 0.1, 0.17, 0.25, 0.35], female: [0.03, 0.06, 0.1, 0.16, 0.23] },
    { id: "reverse-barbell-curl", name: "Reverse Barbell Curl", group: "forearms", motion: "curl", male: [0.1, 0.18, 0.28, 0.38, 0.5], female: [0.05, 0.1, 0.16, 0.23, 0.32] },
    { id: "finger-curl", name: "Finger Curl", group: "forearms", motion: "curl", male: [0.1, 0.2, 0.32, 0.45, 0.6], female: [0.05, 0.11, 0.18, 0.27, 0.38] },
    { id: "hand-gripper", name: "Adjustable Hand Gripper", group: "forearms", motion: "grip", equipment: "Hand gripper", male: [0.15, 0.25, 0.4, 0.6, 0.85], female: [0.08, 0.15, 0.25, 0.38, 0.55] },
    { id: "fingertip-push-up", name: "Fingertip Push-Up", group: "forearms", motion: "pushup", type: "bodyweight", male: [1, 4, 9, 16, 25], female: [1, 3, 7, 12, 20] },
    { id: "knuckle-push-up", name: "Knuckle Push-Up", group: "forearms", motion: "pushup", type: "bodyweight", male: [3, 10, 20, 35, 55], female: [2, 7, 15, 27, 42] },

    { id: "cable-crunch", name: "Cable Crunch", group: "core", motion: "core", male: [0.25, 0.5, 0.75, 1.25, 1.75], female: [0.25, 0.5, 0.75, 1.25, 1.5] },
    { id: "weighted-situp", name: "Weighted Sit-Up", group: "core", motion: "core", male: [0.1, 0.2, 0.35, 0.5, 0.7], female: [0.05, 0.12, 0.22, 0.34, 0.48] },
    { id: "crunch", name: "Crunch", group: "core", motion: "core", type: "bodyweight", male: [10, 25, 40, 60, 90], female: [8, 20, 35, 55, 80] },
    { id: "sit-up", name: "Sit-Up", group: "core", motion: "core", type: "bodyweight", male: [8, 20, 35, 50, 75], female: [6, 16, 28, 43, 65] },
    { id: "reverse-crunch", name: "Reverse Crunch", group: "core", motion: "legraise", type: "bodyweight", male: [5, 12, 20, 30, 45], female: [4, 10, 18, 28, 42] },
    { id: "lying-leg-raise", name: "Lying Leg Raise", group: "core", motion: "legraise", type: "bodyweight", male: [3, 10, 20, 30, 45], female: [3, 8, 17, 27, 40] },
    { id: "hanging-knee-raise", name: "Hanging Knee Raise", group: "core", motion: "legraise", type: "bodyweight", equipment: "Pull-up bar", male: [3, 8, 15, 25, 40], female: [2, 6, 12, 21, 34] },
    { id: "hanging-leg-raise", name: "Hanging Leg Raise", group: "core", motion: "legraise", type: "bodyweight", equipment: "Pull-up bar", male: [1, 5, 10, 15, 25], female: [1, 3, 7, 12, 20] },
    { id: "v-up", name: "V-Up", group: "core", motion: "core", type: "bodyweight", male: [3, 10, 20, 35, 50], female: [2, 8, 17, 30, 45] },
    { id: "bicycle-crunch", name: "Bicycle Crunch (total)", group: "core", motion: "core", type: "bodyweight", male: [15, 30, 50, 75, 100], female: [12, 25, 45, 68, 92] },
    { id: "dead-bug", name: "Dead Bug (total)", group: "core", motion: "core", type: "bodyweight", male: [10, 20, 30, 45, 60], female: [8, 17, 28, 42, 58] },
    { id: "hollow-rock", name: "Hollow Rock", group: "core", motion: "core", type: "bodyweight", male: [5, 15, 30, 45, 60], female: [4, 12, 25, 40, 55] },
    { id: "heel-tap", name: "Heel Tap (total)", group: "core", motion: "core", type: "bodyweight", male: [20, 40, 60, 90, 120], female: [16, 34, 55, 82, 110] },
    { id: "mountain-climber", name: "Mountain Climber (total)", group: "core", motion: "pushup", type: "bodyweight", male: [20, 40, 60, 90, 130], female: [16, 34, 55, 82, 118] },
    { id: "straight-leg-sit-up", name: "Straight-Leg Sit-Up", group: "core", motion: "core", type: "bodyweight", male: [5, 15, 25, 40, 60], female: [4, 12, 22, 36, 55] },
    { id: "toe-touch", name: "Toe Touch", group: "core", motion: "core", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [6, 16, 30, 48, 72] },
    { id: "flutter-kick", name: "Flutter Kick (total)", group: "core", motion: "legraise", type: "bodyweight", male: [20, 40, 70, 100, 150], female: [16, 35, 60, 90, 135] },
    { id: "scissor-kick", name: "Scissor Kick (total)", group: "core", motion: "legraise", type: "bodyweight", male: [15, 30, 50, 75, 110], female: [12, 25, 45, 68, 100] },
    { id: "shoulder-tap", name: "Plank Shoulder Tap (total)", group: "core", motion: "pushup", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 20, 40, 62, 90] },
    { id: "plank-jack", name: "Plank Jack", group: "core", motion: "pushup", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [6, 16, 30, 48, 72] },
    { id: "ab-wheel-rollout", name: "Ab-Wheel Rollout", group: "core", motion: "core", type: "bodyweight", equipment: "Ab wheel", male: [1, 5, 10, 18, 30], female: [1, 3, 7, 13, 22] },
    { id: "windshield-wiper", name: "Windshield Wiper (total)", group: "core", motion: "legraise", type: "bodyweight", male: [2, 8, 15, 25, 40], female: [1, 6, 12, 21, 34] },
    { id: "dragon-flag", name: "Dragon Flag", group: "core", motion: "legraise", type: "bodyweight", male: [1, 3, 6, 10, 16], female: [1, 2, 4, 8, 13] },
    { id: "cross-body-mountain-climber", name: "Cross-Body Mountain Climber (total)", group: "core", motion: "pushup", type: "bodyweight", male: [16, 35, 60, 90, 130], female: [12, 30, 52, 80, 116] },

    { id: "cable-wood-chop", name: "Cable Wood Chop", group: "obliques", motion: "core", male: [0.12, 0.22, 0.35, 0.5, 0.68], female: [0.07, 0.14, 0.24, 0.36, 0.5] },
    { id: "dumbbell-side-bend", name: "Dumbbell Side Bend", group: "obliques", motion: "core", male: [0.15, 0.28, 0.42, 0.58, 0.78], female: [0.08, 0.17, 0.28, 0.4, 0.56] },
    { id: "side-crunch", name: "Side Crunch (total)", group: "obliques", motion: "core", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [7, 18, 32, 50, 72] },
    { id: "side-plank-hip-dip", name: "Side Plank Hip Dip (total)", group: "obliques", motion: "core", type: "bodyweight", male: [6, 16, 30, 48, 70], female: [5, 14, 27, 44, 65] },
    { id: "russian-twist", name: "Russian Twist (total)", group: "obliques", motion: "core", type: "bodyweight", male: [10, 25, 40, 60, 90], female: [8, 20, 35, 55, 80] },

    { id: "deadlift", name: "Conventional Deadlift", group: "lower-back", motion: "hinge", male: [1, 1.5, 2, 2.5, 3.25], female: [0.75, 1, 1.5, 2, 2.5] },
    { id: "reverse-hyper", name: "Reverse Hyperextension", group: "lower-back", motion: "hinge", male: [0.2, 0.4, 0.65, 0.9, 1.2], female: [0.12, 0.26, 0.45, 0.65, 0.9] },
    { id: "back-extension", name: "Back Extension", group: "lower-back", motion: "hinge", type: "bodyweight", male: [5, 15, 30, 50, 75], female: [4, 12, 25, 43, 65] },
    { id: "superman", name: "Superman", group: "lower-back", motion: "bridge", type: "bodyweight", male: [5, 15, 30, 45, 65], female: [4, 12, 25, 40, 58] },
    { id: "bird-dog", name: "Bird Dog (total)", group: "lower-back", motion: "core", type: "bodyweight", male: [10, 20, 30, 45, 60], female: [8, 17, 28, 42, 58] },
    { id: "swimmer", name: "Swimmer (total)", group: "lower-back", motion: "bridge", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 20, 40, 62, 90] },

    { id: "back-squat", name: "Back Squat", group: "quads", motion: "squat", male: [0.75, 1.25, 1.75, 2.25, 2.75], female: [0.5, 0.75, 1.25, 1.75, 2.25] },
    { id: "front-squat", name: "Front Squat", group: "quads", motion: "squat", male: [0.75, 1, 1.25, 1.75, 2.25], female: [0.5, 0.75, 1, 1.25, 1.5] },
    { id: "leg-press", name: "Leg Press", group: "quads", motion: "squat", male: [1.25, 2, 2.75, 4, 5.25], female: [0.75, 1.5, 2.25, 3.25, 4.5] },
    { id: "bodyweight-squat", name: "Bodyweight Squat", group: "quads", motion: "squat", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },
    { id: "walking-lunge", name: "Walking Lunge (total)", group: "quads", motion: "lunge", type: "bodyweight", male: [8, 20, 36, 55, 80], female: [7, 18, 32, 50, 72] },
    { id: "bulgarian-split-squat", name: "Bulgarian Split Squat (total)", group: "quads", motion: "lunge", type: "bodyweight", male: [4, 12, 24, 40, 60], female: [4, 10, 21, 36, 54] },
    { id: "step-up", name: "Step-Up (total)", group: "quads", motion: "lunge", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [7, 18, 32, 50, 72] },
    { id: "reverse-lunge", name: "Reverse Lunge (total)", group: "quads", motion: "lunge", type: "bodyweight", male: [8, 20, 36, 55, 80], female: [7, 18, 32, 50, 72] },
    { id: "squat-pulse", name: "Squat Pulse", group: "quads", motion: "squat", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },

    { id: "romanian-deadlift", name: "Romanian Deadlift", group: "hamstrings", motion: "hinge", male: [0.75, 1, 1.5, 2, 2.75], female: [0.5, 0.75, 1, 1.5, 2] },
    { id: "good-morning", name: "Good Morning", group: "hamstrings", motion: "hinge", male: [0.3, 0.5, 0.75, 1, 1.25], female: [0.18, 0.34, 0.52, 0.72, 0.94] },
    { id: "lying-leg-curl", name: "Lying Leg Curl", group: "hamstrings", motion: "hinge", male: [0.25, 0.45, 0.65, 0.88, 1.15], female: [0.16, 0.3, 0.47, 0.66, 0.88] },
    { id: "nordic-curl", name: "Nordic Hamstring Curl", group: "hamstrings", motion: "hinge", type: "bodyweight", equipment: "Anchor", male: [1, 3, 7, 12, 20], female: [1, 2, 5, 9, 15] },
    { id: "sliding-leg-curl", name: "Sliding Leg Curl", group: "hamstrings", motion: "bridge", type: "bodyweight", equipment: "Towel or sliders", male: [3, 8, 15, 25, 40], female: [2, 6, 12, 21, 34] },
    { id: "hamstring-walkout", name: "Hamstring Walkout", group: "hamstrings", motion: "bridge", type: "bodyweight", male: [3, 8, 15, 25, 40], female: [2, 6, 12, 21, 34] },
    { id: "single-leg-bodyweight-rdl", name: "Single-Leg Bodyweight RDL (total)", group: "hamstrings", motion: "hinge", type: "bodyweight", male: [6, 16, 30, 48, 70], female: [5, 14, 27, 44, 65] },

    { id: "sumo-squat", name: "Sumo Squat", group: "adductors", motion: "squat", male: [0.45, 0.75, 1.05, 1.4, 1.75], female: [0.3, 0.52, 0.78, 1.05, 1.35] },
    { id: "adductor-machine", name: "Adductor Machine", group: "adductors", motion: "squat", male: [0.3, 0.55, 0.85, 1.2, 1.6], female: [0.22, 0.42, 0.68, 0.98, 1.35] },
    { id: "side-lunge", name: "Side Lunge (total)", group: "adductors", motion: "lunge", type: "bodyweight", male: [6, 16, 30, 48, 70], female: [5, 14, 27, 44, 65] },
    { id: "copenhagen-hip-lift", name: "Copenhagen Hip Lift (total)", group: "adductors", motion: "bridge", type: "bodyweight", male: [2, 6, 12, 20, 32], female: [2, 5, 10, 17, 28] },
    { id: "cossack-squat", name: "Cossack Squat (total)", group: "adductors", motion: "lunge", type: "bodyweight", male: [4, 10, 20, 34, 50], female: [4, 9, 18, 30, 45] },
    { id: "bodyweight-sumo-squat", name: "Bodyweight Sumo Squat", group: "adductors", motion: "squat", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },

    { id: "hip-thrust", name: "Hip Thrust", group: "glutes", motion: "hinge", male: [0.5, 1, 1.75, 2.5, 3.5], female: [0.5, 1, 1.5, 2.25, 3] },
    { id: "sumo-deadlift", name: "Sumo Deadlift", group: "glutes", motion: "hinge", male: [1, 1.5, 2, 2.75, 3.25], female: [0.5, 0.75, 1.25, 1.75, 2.25] },
    { id: "cable-kickback", name: "Cable Kickback", group: "glutes", motion: "bridge", male: [0.12, 0.22, 0.35, 0.5, 0.68], female: [0.08, 0.16, 0.27, 0.4, 0.56] },
    { id: "glute-bridge", name: "Glute Bridge", group: "glutes", motion: "bridge", type: "bodyweight", male: [8, 20, 35, 55, 80], female: [7, 18, 32, 50, 72] },
    { id: "single-leg-glute-bridge", name: "Single-Leg Glute Bridge (total)", group: "glutes", motion: "bridge", type: "bodyweight", male: [4, 12, 24, 40, 60], female: [4, 10, 21, 36, 54] },
    { id: "donkey-kick", name: "Donkey Kick (total)", group: "glutes", motion: "bridge", type: "bodyweight", male: [10, 24, 40, 60, 90], female: [8, 20, 36, 55, 82] },
    { id: "fire-hydrant", name: "Fire Hydrant (total)", group: "glutes", motion: "bridge", type: "bodyweight", male: [10, 24, 40, 60, 90], female: [8, 20, 36, 55, 82] },
    { id: "frog-pump", name: "Frog Pump", group: "glutes", motion: "bridge", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },

    { id: "standing-calf-raise", name: "Standing Calf Raise", group: "calves", motion: "calf", male: [0.4, 0.75, 1.2, 1.8, 2.4], female: [0.28, 0.52, 0.85, 1.3, 1.8] },
    { id: "seated-calf-raise", name: "Seated Calf Raise", group: "calves", motion: "calf", male: [0.3, 0.6, 1, 1.5, 2], female: [0.2, 0.42, 0.7, 1.05, 1.48] },
    { id: "calf-press", name: "Calf Press", group: "calves", motion: "calf", male: [0.75, 1.25, 2, 3, 4], female: [0.5, 0.9, 1.45, 2.2, 3] },
    { id: "bodyweight-calf-raise", name: "Bodyweight Calf Raise", group: "calves", motion: "calf", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] },
    { id: "single-leg-calf-raise", name: "Single-Leg Calf Raise (total)", group: "calves", motion: "calf", type: "bodyweight", male: [6, 16, 30, 50, 75], female: [5, 14, 27, 45, 68] },
    { id: "bent-knee-calf-raise", name: "Bent-Knee Calf Raise", group: "calves", motion: "calf", type: "bodyweight", male: [10, 25, 45, 70, 100], female: [8, 22, 40, 65, 92] }
  ];

  const MEASUREMENTS = [
    { key: "heightCm", label: "Height", kind: "length" },
    { key: "bodyFat", label: "Body fat", kind: "percent" },
    { key: "waistCm", label: "Waist", kind: "length" },
    { key: "neckCm", label: "Neck", kind: "length" },
    { key: "hipCm", label: "Hips", kind: "length" },
    { key: "shoulderCm", label: "Shoulders", kind: "length" },
    { key: "wristCm", label: "Wrist", kind: "length" },
    { key: "chestCm", label: "Chest", kind: "length" },
    { key: "armCm", label: "Upper arm", kind: "length" },
    { key: "forearmCm", label: "Forearm", kind: "length" },
    { key: "thighCm", label: "Thigh", kind: "length" },
    { key: "calfCm", label: "Calf", kind: "length" }
  ];

  const CARDIO_ACTIVITIES = [
    { id: "longest-run", name: "Longest Run", kind: "distance", distanceLabel: "Run distance" },
    { id: "fastest-mile", name: "Fastest Mile", kind: "time", distanceMeters: 1609.344 },
    { id: "forty-yard-dash", name: "40-Yard Dash", kind: "time", distanceMeters: 36.576 },
    { id: "hundred-meter-dash", name: "100-Meter Dash", kind: "time", distanceMeters: 100 },
    { id: "four-hundred-meter-run", name: "400-Meter Run", kind: "time", distanceMeters: 400 },
    { id: "five-k-run", name: "5K Run", kind: "time", distanceMeters: 5000 },
    { id: "ten-k-run", name: "10K Run", kind: "time", distanceMeters: 10000 },
    { id: "half-marathon", name: "Half Marathon", kind: "time", distanceMeters: 21097.5 },
    { id: "marathon", name: "Marathon", kind: "time", distanceMeters: 42195 },
    { id: "five-hundred-meter-row", name: "500-Meter Row", kind: "time", distanceMeters: 500 },
    { id: "two-k-row", name: "2K Row", kind: "time", distanceMeters: 2000 },
    { id: "five-k-bike", name: "5K Bike", kind: "time", distanceMeters: 5000 },
    { id: "hundred-floor-climb", name: "100-Floor Stair Climb", kind: "time", distanceMeters: 0 }
  ];

  const DONATION_REMINDER_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;
  const MONTHLY_DONATIONS = [
    { id: "monthly_050", amount: 0.5, label: "$0.50", url: "https://buy.stripe.com/9B6eVd9NM4dKgrr8d6f7i07" },
    { id: "monthly_075", amount: 0.75, label: "$0.75", url: "https://donate.stripe.com/eVq4gz5xw4dK3EF792f7i08" },
    { id: "monthly_100", amount: 1, label: "$1.00", url: "https://donate.stripe.com/bJedR94tsaC82AB792f7i09" },
    { id: "monthly_300", amount: 3, label: "$3.00", url: "https://donate.stripe.com/28E7sLgcaaC8ejjgJCf7i0a" },
    { id: "monthly_500", amount: 5, label: "$5.00", url: "https://donate.stripe.com/dRmaEXcZY8u02ABctmf7i0b" }
  ];
  const ONE_TIME_DONATION = {
    id: "one_time",
    url: "https://donate.stripe.com/7sYdR97FE4dK4IJdxqf7i06"
  };

  const DEFAULT_WEIGHT_DISPLAY = {
    currentWeight: true,
    change: true,
    trendline: true,
    startDate: true,
    endDate: true,
    xAxis: true,
    yAxis: true,
    goalGap: true,
    dailyRate: false,
    weeklyRate: true
  };

  const MEASUREMENT_GUIDES = {
    weightKg: { label: "Body weight", copy: "Use the same scale on the same hard surface at a similar time of day. Morning after using the bathroom and before eating is easiest to repeat." },
    heightCm: { label: "Height", copy: "Stand barefoot against a wall with your heels down and eyes level. Measure from the floor to the highest point of your head." },
    bodyFat: { label: "Body fat", copy: "Use the same method each time, such as calipers, a smart scale, or a professional scan. Leave it blank if you do not have a repeatable method; Foss Gym can show a separate tape estimate." },
    waistCm: { label: "Waist", copy: "Stand relaxed after a normal exhale. Keep the tape level around the navel without pulling it into the skin, and use this same site for every entry." },
    neckCm: { label: "Neck", copy: "Look straight ahead and wrap the tape just below the Adam's apple, angled slightly down toward the front. Keep your neck relaxed." },
    hipCm: { label: "Hips", copy: "Stand with your feet together and measure level around the widest point of the buttocks without squeezing the tape." },
    shoulderCm: { label: "Shoulders", copy: "With your arms relaxed, have a helper wrap the tape around the broadest part of both shoulders and upper back. Keep it level and do not flare your lats." },
    wristCm: { label: "Wrist", copy: "Measure around the narrowest point just below the wrist bone with your hand relaxed." },
    chestCm: { label: "Chest", copy: "Stand relaxed and measure level around the fullest part of the chest, usually across the nipple line, after a normal exhale." },
    armCm: { label: "Upper arm", copy: "Raise and flex the arm, then measure around the largest point of the biceps and triceps. Use the same arm every time." },
    forearmCm: { label: "Forearm", copy: "Keep your hand lightly closed and measure around the widest point of the forearm without squeezing the tape." },
    thighCm: { label: "Thigh", copy: "Stand with your weight even on both feet and measure around the largest point of one upper thigh. Record the same leg and location each time." },
    calfCm: { label: "Calf", copy: "Stand normally and measure around the widest point of one calf. Keep the tape level and use the same leg every time." }
  };

  const PROPORTIONAL_PHYSIQUES = [
    { id: "golden", name: "Golden Ratio / V-Taper", anchor: "waist", bodyFatTargetMale: 12, bodyFatTargetFemale: 20, description: "Shoulders 1.61× waist, chest 1.45×, arms and calves 0.50×, thighs 0.725×." },
    { id: "grecian", name: "Grecian Ideal", anchor: "wrist", bodyFatTargetMale: 12, bodyFatTargetFemale: 20, description: "Frame-based targets from wrist circumference, using the midpoint where a range was supplied." },
    { id: "lean_af", name: "Lean AF", anchor: "height", referenceWeightLb: 152, bodyFatTargetMale: 10, bodyFatTargetFemale: 18, shortReferenceName: "Lean AF", description: "A lean, athletic reference near 152 lb at 5 ft 9 in, with a 28.5 to 30 in waist and balanced measurements, scaled to your height." },
    { id: "guts", name: "Guts", anchor: "height", referenceWeightLb: 227.5, bodyFatTarget: 9.5, shortReferenceName: "Guts", description: "A broad, muscular reference near 220 to 235 lb at roughly 6 ft 4 in, with an estimated visual body-fat equivalent around 8 to 11%, scaled to your height." },
    { id: "baki", name: "Baki logic (gag)", anchor: "height", referenceWeightLb: 350, bodyFatTarget: 2, shortReferenceName: "Baki", gag: true, description: "A parody preset with impossible anime proportions. This is deliberately ridiculous and is not a real training, health, or body-composition target." },
    { id: "reeves", name: "Steve Reeves", anchor: "height", referenceWeightLb: 215, bodyFatTargetMale: 10, bodyFatTargetFemale: 18, shortReferenceName: "Reeves", description: "48 in chest, 29 in waist, 18 in arms and calves, and 26 in thighs at 6 ft 1 in, scaled to your height." },
    { id: "arnold", name: "Arnold Schwarzenegger", anchor: "height", referenceWeightLb: 235, bodyFatTargetMale: 8, bodyFatTargetFemale: 16, shortReferenceName: "Arnold", description: "57 in chest, 34 in waist, 22 in arms, 28.5 in thighs, and 20 in calves at 6 ft 2 in, scaled to your height." },
    { id: "walker", name: "Clint Walker (Cheyenne)", anchor: "height", referenceWeightLb: 245, bodyFatTargetMale: 12, bodyFatTargetFemale: 20, shortReferenceName: "Walker", description: "48 in chest, 32 in waist, and 18 in arms at 6 ft 6 in, scaled to your height." },
    { id: "old_school", name: "Old-School Symmetry Rules", anchor: "symmetry", bodyFatTargetMale: 12, bodyFatTargetFemale: 20, description: "Arms, neck, and calves match; chest is 2.85× arms and thighs are 1.45× arms." }
  ];

  const CUSTOM_RATIO_FIELDS = [
    { key: "shoulderCm", label: "Shoulders", defaultValue: 1.61 },
    { key: "chestCm", label: "Chest", defaultValue: 1.45 },
    { key: "neckCm", label: "Neck", defaultValue: 0.48 },
    { key: "armCm", label: "Upper arm", defaultValue: 0.5 },
    { key: "forearmCm", label: "Forearm", defaultValue: 0.42 },
    { key: "wristCm", label: "Wrist", defaultValue: 0.2 },
    { key: "hipCm", label: "Hips", defaultValue: 1.08 },
    { key: "thighCm", label: "Thigh", defaultValue: 0.725 },
    { key: "calfCm", label: "Calf", defaultValue: 0.5 }
  ];

  const THEMES = [
    { id: "lime", name: "Foss Lime", color: "#B9F64A" },
    { id: "electric", name: "Electric Blue", color: "#59A8FF" },
    { id: "ember", name: "Ember", color: "#FF8A4C" },
    { id: "violet", name: "Violet", color: "#A987FF" },
    { id: "crimson", name: "Crimson", color: "#FF626D" },
    { id: "aqua", name: "Aqua", color: "#36D9C4" }
  ];

  const LOGO_OPTIONS = [
    { id: "f", name: "Foss F" },
    { id: "barbell", name: "Barbell" },
    { id: "bolt", name: "Power bolt" },
    { id: "flame", name: "Flame" },
    { id: "trophy", name: "Trophy" }
  ];

  const POINT_LABEL_OPTIONS = [
    { id: "xp", name: "XP", unit: "XP" },
    { id: "gym", name: "Gym Points", unit: "GP" },
    { id: "points", name: "Points", unit: "points" },
    { id: "power", name: "Power Points", unit: "PP" },
    { id: "custom", name: "Custom", unit: "Points" }
  ];

  const PLAN_ICONS = [
    { id: "full-body", name: "Full body", motion: "squat" },
    { id: "chest", name: "Chest", motion: "press" },
    { id: "back", name: "Back", motion: "row" },
    { id: "shoulders", name: "Shoulders", motion: "shoulder" },
    { id: "arms", name: "Arms", motion: "curl" },
    { id: "core", name: "Core", motion: "core" },
    { id: "legs", name: "Legs", motion: "lunge" },
    { id: "bodyweight", name: "Bodyweight", motion: "pushup" }
  ];

  const EXERCISE_ICON_OPTIONS = [
    { id: "press", name: "Press" }, { id: "row", name: "Row" },
    { id: "pull", name: "Pull" }, { id: "shoulder", name: "Shoulder" },
    { id: "curl", name: "Arms" }, { id: "core", name: "Core" },
    { id: "squat", name: "Squat" }, { id: "lunge", name: "Lunge" },
    { id: "hinge", name: "Hinge" }, { id: "bridge", name: "Bridge" },
    { id: "calf", name: "Calf" }, { id: "pushup", name: "Bodyweight" },
    { id: "grip", name: "Grip" }
  ];

  let state = loadState();
  let activeLiftGroup = "chest";
  let activeExerciseId = "bench-press";
  let editingPlan = null;
  let planEditorBaseline = null;
  let selectedPlanId = null;
  let dashboardChartMode = "strength";
  let bodyWeightView = "recent";
  let cardioChartMode = "longest-run";
  let activeCardioGoalId = "longest-run";
  let donationTab = "monthly";
  let donationMonthlyIndex = 2;
  let donationReminderTimer = null;
  let toastTimer = null;
  let feedbackBannerTimer = null;
  let widgetSyncTimer = null;
  let pendingConfirm = null;
  let setupIsEdit = false;
  let setupCurrentStep = 1;
  let setupLocationDraft = [];
  let setupLocationEquipmentDraft = {};
  let setupCustomEquipmentDraft = [];
  let setupEquipmentPreferenceDraft = "none";
  let liftScoresExpanded = false;
  let equipmentEditorLocation = "home";
  let equipmentEditorFromSetup = false;
  let equipmentEditorDraft = [];
  let equipmentEditorCustomDraft = [];
  let equipmentSearchQuery = "";
  let pendingLocationActivation = null;
  let currentTab = "strength";
  let backGuardArmed = false;
  let workoutHighScoresOpen = false;
  let dashboardAllScoresOpen = false;
  let activeQuickMeasurementKey = null;
  let activeMeasurementHistoryId = null;
  let measurementHoldTimer = null;
  let suppressMeasurementClick = false;
  let restDuration = Number(state.settings.restSeconds) || 60;
  let restRemaining = restDuration;
  let restTimerId = null;
  let restEndsAt = 0;
  let restIsRunning = false;
  let cooldownHoldTimer = null;
  let cooldownIdleTimer = null;
  let cooldownPositioning = false;
  let cooldownDragging = false;
  let cooldownPointerId = null;
  let cooldownPointerStartX = 0;
  let cooldownPointerStartY = 0;
  let cooldownDockStartLeft = 0;
  let cooldownDockStartTop = 0;
  let suppressCooldownClick = false;
  let pendingImportState = null;
  let workoutLibraryFilter = "all";
  let workoutGroupFilter = "all";
  let exerciseLibraryFilter = "all";
  let exerciseGroupFilter = "all";
  let colorPickerHue = 90;
  let colorPickerSaturation = 70;
  let colorPickerValue = 96;
  let colorSpectrumDragging = false;
  let iconDrawingStrokes = [];
  let activeIconStroke = null;
  let iconDrawingActive = false;
  let activeIconEraserPoint = null;
  let activeIconDrawingTool = "draw";
  let iconDrawingTool = "draw";
  let iconDrawingStrokeWidth = 4;
  let iconDrawingTarget = "plan";
  let iconDrawingUndoStack = [];
  let iconDrawingRedoStack = [];
  let customExerciseIconStrokes = [];
  let customExerciseIconWidth = 4;
  let customExerciseMotion = "press";
  let customExerciseGroupIds = ["chest"];
  let editingCustomPhysiqueId = null;

  const el = {};

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function locationById(id) {
    return LOCATIONS.find(function (location) { return location.id === id; }) || LOCATIONS.find(function (location) { return location.id === "home"; });
  }

  function uniqueStrings(value) {
    return Array.isArray(value) ? value.map(String).filter(function (item, index, list) {
      return item && list.indexOf(item) === index;
    }) : [];
  }

  function normalizeLocationIds(value) {
    return uniqueStrings(value).filter(function (id) {
      return LOCATIONS.some(function (location) { return location.id === id; });
    });
  }

  function defaultLocationEquipment() {
    return {
      home: [],
      apartment: [],
      planet: equipment ? equipment.defaultEquipment("planet") : [],
      crunch: equipment ? equipment.defaultEquipment("crunch") : []
    };
  }

  function normalizeLocationEquipment(value) {
    const defaults = defaultLocationEquipment();
    const source = value && typeof value === "object" ? value : {};
    const normalized = {};
    LOCATIONS.forEach(function (location) {
      normalized[location.id] = Array.isArray(source[location.id])
        ? uniqueStrings(source[location.id])
        : defaults[location.id].slice();
    });
    return normalized;
  }

  function normalizeCustomEquipment(value) {
    return (Array.isArray(value) ? value : []).map(function (item) {
      if (!item || typeof item !== "object" || !item.id || !item.name) return null;
      return { id: String(item.id), name: String(item.name).trim().slice(0, 45), category: "Other", kind: "custom" };
    }).filter(function (item, index, list) {
      return item && item.name && list.findIndex(function (candidate) { return candidate.id === item.id; }) === index;
    });
  }

  function normalizeMeasurements(value) {
    return (Array.isArray(value) ? value : []).map(function (item) {
      if (!item || typeof item !== "object") return null;
      const entry = Object.assign({}, item);
      entry.id = String(entry.id || uid("measurement"));
      if (Number.isNaN(new Date(entry.date).getTime())) entry.date = new Date().toISOString();
      return entry;
    }).filter(Boolean);
  }

  function normalizeCardioEntries(value) {
    return (Array.isArray(value) ? value : []).map(function (item) {
      if (!item || typeof item !== "object") return null;
      const activityId = String(item.activityId || "");
      if (!CARDIO_ACTIVITIES.some(function (activity) { return activity.id === activityId; })) return null;
      const score = Number(item.value);
      if (!(score > 0)) return null;
      const date = Number.isNaN(new Date(item.date).getTime()) ? new Date().toISOString() : new Date(item.date).toISOString();
      return { id: String(item.id || uid("cardio")), activityId: activityId, value: score, date: date };
    }).filter(Boolean);
  }

  function normalizeCustomPhysique(value) {
    if (!value || typeof value !== "object") return null;
    const name = String(value.name || "").trim().replace(/\s+/g, " ").slice(0, 40);
    if (!name) return null;
    const ratios = {};
    CUSTOM_RATIO_FIELDS.forEach(function (field) {
      const ratio = Number(value.ratios && value.ratios[field.key]);
      if (Number.isFinite(ratio) && ratio >= 0.1 && ratio <= 10) ratios[field.key] = core.round(ratio, 3);
    });
    if (!Object.keys(ratios).length) return null;
    const rawId = String(value.id || "");
    const safeId = /^custom-physique-[a-z0-9-]{1,64}$/i.test(rawId) ? rawId : uid("custom-physique");
    const bodyFatTarget = core.clamp(Number(value.bodyFatTarget) || 12, 1, 70);
    return {
      id: safeId,
      name: name,
      anchor: "waist",
      custom: true,
      ratios: ratios,
      bodyFatTarget: core.round(bodyFatTarget, 1),
      description: "Custom waist-based ratios created in Foss Gym."
    };
  }

  function normalizeCustomPhysiques(value) {
    return (Array.isArray(value) ? value : []).map(normalizeCustomPhysique).filter(function (item, index, list) {
      return item && list.findIndex(function (candidate) { return candidate.id === item.id; }) === index;
    }).slice(0, 30);
  }

  function normalizeAppTitle(value) {
    const title = String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
    return title || "Foss Gym";
  }

  function normalizeWeightDisplay(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = {};
    Object.keys(DEFAULT_WEIGHT_DISPLAY).forEach(function (key) {
      normalized[key] = source[key] == null ? DEFAULT_WEIGHT_DISPLAY[key] : source[key] !== false;
    });
    return normalized;
  }

  function normalizeCardioGoals(value) {
    const source = value && typeof value === "object" ? value : {};
    const normalized = {};
    CARDIO_ACTIVITIES.forEach(function (activity) {
      const goal = source[activity.id];
      if (!goal || typeof goal !== "object") return;
      const target = Number(goal.value);
      const date = String(goal.date || "");
      if (!(target > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      normalized[activity.id] = { value: target, date: date };
    });
    return normalized;
  }

  function nextDonationReminderAt(value) {
    const next = Number(value);
    return Number.isFinite(next) && next > 0 ? next : Date.now() + DONATION_REMINDER_INTERVAL_MS;
  }

  function normalizedLocationSettings(settings, fallback) {
    const merged = Object.assign({}, fallback, settings || {});
    merged.availableLocations = normalizeLocationIds(merged.availableLocations);
    merged.locationEquipment = normalizeLocationEquipment(merged.locationEquipment);
    merged.customEquipment = normalizeCustomEquipment(merged.customEquipment);
    merged.equipmentPreference = merged.equipmentPreference === "machines" || merged.equipmentPreference === "free_weights"
      ? merged.equipmentPreference
      : "none";
    merged.activeLocation = merged.availableLocations.includes(merged.activeLocation)
      ? merged.activeLocation
      : (merged.availableLocations[0] || "home");
    merged.locationSetupComplete = Boolean(merged.locationSetupComplete && merged.availableLocations.length);
    merged.cooldownTimerVisible = merged.cooldownTimerVisible !== false;
    merged.cooldownTimerPosition = ["top-left", "top-right", "bottom-left", "bottom-right"].includes(merged.cooldownTimerPosition)
      ? merged.cooldownTimerPosition
      : "bottom-right";
    merged.historyBundleWindow = ["30", "60", "120", "240", "day"].includes(String(merged.historyBundleWindow))
      ? String(merged.historyBundleWindow)
      : "day";
    merged.recentTrainingWindowDays = [3, 7, 10, 14, 21, 30].includes(Number(merged.recentTrainingWindowDays))
      ? Number(merged.recentTrainingWindowDays)
      : 7;
    merged.weightGoalKg = Number(merged.weightGoalKg) > 0 ? Number(merged.weightGoalKg) : null;
    merged.weightGoalDate = /^\d{4}-\d{2}-\d{2}$/.test(String(merged.weightGoalDate || "")) ? String(merged.weightGoalDate) : "";
    merged.cardioGoals = normalizeCardioGoals(merged.cardioGoals);
    merged.weightDisplay = normalizeWeightDisplay(merged.weightDisplay);
    merged.donationReminderNextAt = nextDonationReminderAt(merged.donationReminderNextAt);
    merged.rankTargetMode = merged.rankTargetMode === "world_record" ? "world_record" : "training";
    merged.proportionalPhysique = PROPORTIONAL_PHYSIQUES.some(function (item) { return item.id === merged.proportionalPhysique; }) || String(merged.proportionalPhysique || "").indexOf("custom-physique-") === 0
      ? merged.proportionalPhysique
      : "golden";
    merged.proportionalMassBias = Math.round(core.clamp(Number(merged.proportionalMassBias) || 0, -95, 300));
    delete merged.proportionalScaleMinKg;
    delete merged.proportionalScaleMaxKg;
    delete merged.proportionalScalePreset;
    merged.appTitle = normalizeAppTitle(merged.appTitle);
    merged.customAppMarkWidth = normalizeIconWidth(merged.customAppMarkWidth);
    merged.customAppMark = normalizeIconStrokes(merged.customAppMark, merged.customAppMarkWidth);
    if (merged.logo === "custom" && !merged.customAppMark.length) merged.logo = "f";
    return merged;
  }

  function defaultPlan() {
    return {
      id: "plan-full-body",
      name: "Full Body",
      icon: "full-body",
      customIcon: [],
      customIconWidth: 4,
      exercises: [
        { exerciseId: "back-squat", sets: 3, reps: 5, weightKg: null },
        { exerciseId: "bench-press", sets: 3, reps: 8, weightKg: null },
        { exerciseId: "bent-row", sets: 3, reps: 8, weightKg: null },
        { exerciseId: "romanian-deadlift", sets: 3, reps: 8, weightKg: null },
        { exerciseId: "overhead-press", sets: 3, reps: 8, weightKg: null }
      ]
    };
  }

  function defaultState() {
    return {
      version: 20,
      profile: {
        onboarded: false,
        units: "lb",
        standard: "male",
        bodyWeightKg: core.displayToKg(180, "lb"),
        heightCm: core.displayToCm(69, "lb")
      },
      lifts: [],
      plans: [defaultPlan()],
      workouts: [],
      measurements: [],
      cardio: [],
      customExercises: [],
      customPhysiques: [],
      settings: {
        progression: "training",
        theme: "lime",
        logo: "f",
        appTitle: "Foss Gym",
        customAppMark: [],
        customAppMarkWidth: 4,
        restSeconds: 60,
        cooldownTimerVisible: true,
        cooldownTimerPosition: "bottom-right",
        historyBundleWindow: "day",
        recentTrainingWindowDays: 7,
        weightGoalKg: null,
        weightGoalDate: "",
        cardioGoals: {},
        weightDisplay: Object.assign({}, DEFAULT_WEIGHT_DISPLAY),
        donationReminderNextAt: Date.now() + DONATION_REMINDER_INTERVAL_MS,
        rankTargetMode: "training",
        proportionalPhysique: "golden",
        proportionalMassBias: 0,
        pointLabel: "xp",
        customPointLabel: "Points",
        weightedScoreMode: "heaviest_set",
        customAccent: "#B9F64A",
        useCustomAccent: false,
        showExerciseTags: true,
        locationSetupComplete: false,
        availableLocations: [],
        activeLocation: "home",
        equipmentPreference: "none",
        locationEquipment: defaultLocationEquipment(),
        customEquipment: []
      }
    };
  }

  function loadState() {
    const fallback = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        version: 20,
        profile: Object.assign({}, fallback.profile, parsed.profile || {}),
        lifts: Array.isArray(parsed.lifts) ? parsed.lifts : [],
        plans: (Array.isArray(parsed.plans) ? parsed.plans : fallback.plans).map(function (plan) {
          const normalized = Object.assign({ icon: "full-body", customIcon: [], customIconWidth: 4 }, plan);
          normalized.customIconWidth = normalizeIconWidth(normalized.customIconWidth);
          normalized.customIcon = normalizeIconStrokes(normalized.customIcon, normalized.customIconWidth);
          if (normalized.icon === "custom" && !normalized.customIcon.length) normalized.icon = "full-body";
          return normalized;
        }),
        workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
        measurements: normalizeMeasurements(parsed.measurements),
        cardio: normalizeCardioEntries(parsed.cardio),
        customExercises: (Array.isArray(parsed.customExercises) ? parsed.customExercises : []).map(normalizeCustomExercise).filter(Boolean),
        customPhysiques: normalizeCustomPhysiques(parsed.customPhysiques),
        settings: normalizedLocationSettings(parsed.settings, fallback.settings)
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    scheduleWidgetSync();
  }

  function csvCell(value) {
    return '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"';
  }

  function createBackupCsv() {
    const rows = [["record_type", "record_id", "data"]];
    const add = function (type, id, data) {
      rows.push([type, id || "", JSON.stringify(data)]);
    };
    add("meta", "backup", {
      format: "foss_gym_csv",
      formatVersion: 1,
      app: "Foss Gym",
      packageId: "com.foss.workouts",
      stateVersion: state.version,
      exportedAt: new Date().toISOString()
    });
    add("profile", "profile", state.profile);
    add("settings", "settings", state.settings);
    [
      ["lift", state.lifts],
      ["plan", state.plans],
      ["workout", state.workouts],
      ["measurement", state.measurements],
      ["cardio", state.cardio],
      ["custom_exercise", state.customExercises],
      ["custom_physique", state.customPhysiques]
    ].forEach(function (collection) {
      collection[1].forEach(function (item, index) { add(collection[0], item.id || String(index), item); });
    });
    return "\ufeff" + rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n");
  }

  function parseCsvRows(input) {
    const text = String(input == null ? "" : input).replace(/^\ufeff/, "");
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      if (quoted) {
        if (character === '"') {
          if (text[index + 1] === '"') {
            cell += '"';
            index += 1;
          } else {
            quoted = false;
          }
        } else {
          cell += character;
        }
      } else if (character === '"' && cell.length === 0) {
        quoted = true;
      } else if (character === ",") {
        row.push(cell);
        cell = "";
      } else if (character === "\n" || character === "\r") {
        if (character === "\r" && text[index + 1] === "\n") index += 1;
        row.push(cell);
        if (row.some(function (value) { return value !== ""; })) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += character;
      }
    }
    if (quoted) throw new Error("The CSV has an unfinished quoted value.");
    row.push(cell);
    if (row.some(function (value) { return value !== ""; })) rows.push(row);
    return rows;
  }

  function safeJsonValue(value) {
    if (Array.isArray(value)) return value.map(safeJsonValue);
    if (value && typeof value === "object") {
      const safe = {};
      Object.keys(value).forEach(function (key) {
        if (key === "__proto__" || key === "prototype" || key === "constructor") return;
        safe[key] = safeJsonValue(value[key]);
      });
      return safe;
    }
    return value;
  }

  function parseBackupCsv(input) {
    if (String(input || "").length > 5 * 1024 * 1024) throw new Error("The backup is larger than 5 MB.");
    const rows = parseCsvRows(input);
    if (!rows.length || rows[0].join(",").toLowerCase() !== "record_type,record_id,data") {
      throw new Error("This is not a Foss Gym CSV backup.");
    }
    const records = { lifts: [], plans: [], workouts: [], measurements: [], cardio: [], customExercises: [], customPhysiques: [] };
    let metadata = null;
    let profile = null;
    let settings = null;
    const collectionNames = {
      lift: "lifts",
      plan: "plans",
      workout: "workouts",
      measurement: "measurements",
      cardio: "cardio",
      custom_exercise: "customExercises",
      custom_physique: "customPhysiques"
    };

    rows.slice(1).forEach(function (row, index) {
      if (row.length !== 3) throw new Error("Backup row " + (index + 2) + " has the wrong number of columns.");
      let data;
      try {
        data = safeJsonValue(JSON.parse(row[2]));
      } catch (error) {
        throw new Error("Backup row " + (index + 2) + " contains invalid data.");
      }
      if (row[0] === "meta") metadata = data;
      else if (row[0] === "profile") profile = data;
      else if (row[0] === "settings") settings = data;
      else if (collectionNames[row[0]]) records[collectionNames[row[0]]].push(data);
      else throw new Error("Backup row " + (index + 2) + " has an unknown record type.");
    });

    if (!metadata || metadata.format !== "foss_gym_csv" || Number(metadata.formatVersion) !== 1) {
      throw new Error("This backup format is not supported.");
    }
    if (!profile || !settings) throw new Error("The backup is missing profile or settings data.");
    if (!(Number(profile.bodyWeightKg) > 0) || !(Number(profile.heightCm) > 0)) {
      throw new Error("The backup contains an invalid body profile.");
    }

    const restored = defaultState();
    restored.version = 20;
    restored.profile = {
      onboarded: Boolean(profile.onboarded),
      units: profile.units === "kg" ? "kg" : "lb",
      standard: profile.standard === "female" ? "female" : "male",
      bodyWeightKg: Number(profile.bodyWeightKg),
      heightCm: Number(profile.heightCm)
    };
    restored.settings = normalizedLocationSettings(Object.assign({}, restored.settings, {
      progression: String(settings.progression || restored.settings.progression),
      theme: String(settings.theme || restored.settings.theme),
      logo: String(settings.logo || restored.settings.logo),
      appTitle: normalizeAppTitle(settings.appTitle),
      customAppMark: settings.customAppMark,
      customAppMarkWidth: settings.customAppMarkWidth,
      restSeconds: core.clamp(Math.round(Number(settings.restSeconds) || 60), 30, 90),
      cooldownTimerVisible: settings.cooldownTimerVisible !== false,
      cooldownTimerPosition: settings.cooldownTimerPosition,
      historyBundleWindow: settings.historyBundleWindow,
      recentTrainingWindowDays: settings.recentTrainingWindowDays,
      weightGoalKg: settings.weightGoalKg,
      weightGoalDate: settings.weightGoalDate,
      cardioGoals: settings.cardioGoals,
      weightDisplay: settings.weightDisplay,
      donationReminderNextAt: settings.donationReminderNextAt,
      rankTargetMode: settings.rankTargetMode,
      proportionalPhysique: settings.proportionalPhysique,
      proportionalMassBias: settings.proportionalMassBias,
      pointLabel: String(settings.pointLabel || restored.settings.pointLabel),
      customPointLabel: String(settings.customPointLabel || "Points").slice(0, 18),
      weightedScoreMode: settings.weightedScoreMode === "one_rep_max" || settings.weightedScoreMode === "estimated_one_rep_max"
        ? settings.weightedScoreMode
        : "heaviest_set",
      customAccent: normalizeHexColor(settings.customAccent) || "#B9F64A",
      useCustomAccent: Boolean(settings.useCustomAccent && normalizeHexColor(settings.customAccent)),
      showExerciseTags: settings.showExerciseTags !== false,
      locationSetupComplete: Boolean(settings.locationSetupComplete),
      availableLocations: settings.availableLocations,
      activeLocation: settings.activeLocation,
      equipmentPreference: settings.equipmentPreference,
      locationEquipment: settings.locationEquipment,
      customEquipment: settings.customEquipment
    }), defaultState().settings);
    restored.lifts = records.lifts.filter(function (item) { return item && typeof item === "object" && item.exerciseId; });
    restored.plans = records.plans.filter(function (item) { return item && typeof item === "object" && item.name; }).map(function (plan) {
      plan.exercises = Array.isArray(plan.exercises) ? plan.exercises : [];
      const normalized = Object.assign({ icon: "full-body", customIcon: [], customIconWidth: 4 }, plan);
      normalized.customIconWidth = normalizeIconWidth(normalized.customIconWidth);
      normalized.customIcon = normalizeIconStrokes(normalized.customIcon, normalized.customIconWidth);
      if (normalized.icon === "custom" && !normalized.customIcon.length) normalized.icon = "full-body";
      return normalized;
    });
    restored.workouts = records.workouts.filter(function (item) { return item && typeof item === "object"; });
    restored.measurements = normalizeMeasurements(records.measurements);
    restored.cardio = normalizeCardioEntries(records.cardio);
    restored.customExercises = records.customExercises.map(normalizeCustomExercise).filter(Boolean);
    restored.customPhysiques = normalizeCustomPhysiques(records.customPhysiques);
    if (String(restored.settings.proportionalPhysique || "").indexOf("custom-physique-") === 0 && !restored.customPhysiques.some(function (item) { return item.id === restored.settings.proportionalPhysique; })) {
      restored.settings.proportionalPhysique = "golden";
    }
    return restored;
  }

  function finishBackupImport(imported) {
    state = imported;
    pendingImportState = null;
    selectedPlanId = null;
    workoutHighScoresOpen = false;
    dashboardAllScoresOpen = false;
    restDuration = Number(state.settings.restSeconds) || 60;
    resetRestTimer();
    saveState();
    renderAll();
    closeModal("settingsModal");
    navigate("strength");
    if (!state.profile.onboarded || !state.settings.locationSetupComplete) openSetup(false);
    showToast("Foss Gym backup restored.");
  }

  function queueBackupImport(csv) {
    let imported;
    try {
      imported = parseBackupCsv(csv);
    } catch (error) {
      showToast(error.message || "Could not read that backup.");
      return false;
    }
    pendingImportState = imported;
    askConfirm({
      title: "Restore this backup?",
      message: "This will replace the app's current data with " + imported.lifts.length + " saved scores, " + imported.plans.length + " workout plans, and " + imported.measurements.length + " measurement entries.",
      button: "Restore"
    }, function () { finishBackupImport(imported); });
    return true;
  }

  function exportAllData() {
    const csv = createBackupCsv();
    const filename = "Foss-Gym-Backup-" + new Date().toISOString().slice(0, 10) + ".csv";
    if (window.FossFiles && typeof window.FossFiles.exportCsv === "function") {
      window.FossFiles.exportCsv(filename, csv);
      showToast("Choose where to save your backup.");
      return;
    }
    try {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showToast("Backup downloaded.");
    } catch (error) {
      showToast("This device could not create the backup file.");
    }
  }

  function openBackupImport() {
    if (window.FossFiles && typeof window.FossFiles.importCsv === "function") {
      window.FossFiles.importCsv();
      return;
    }
    el.importCsvInput.value = "";
    el.importCsvInput.click();
  }

  window.receiveFossCsvBase64 = function (encoded) {
    if (!encoded) {
      showToast("Could not read that backup file.");
      return;
    }
    try {
      const binary = window.atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
      const csv = typeof TextDecoder === "function" ? new TextDecoder("utf-8").decode(bytes) : decodeURIComponent(escape(binary));
      queueBackupImport(csv);
    } catch (error) {
      showToast("Could not decode that backup file.");
    }
  };

  window.fossNativeExportFinished = function (success) {
    showToast(success ? "Backup saved." : "The backup could not be saved.");
  };

  window.FossGymBackup = {
    createCsv: createBackupCsv,
    parseCsv: parseBackupCsv,
    importCsvText: queueBackupImport
  };

  function cacheElements() {
    document.querySelectorAll("[id]").forEach(function (node) {
      el[node.id] = node;
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function allExercises() {
    return EXERCISES.concat(state.customExercises || []);
  }

  function exerciseById(id) {
    return allExercises().find(function (exercise) { return exercise.id === id; });
  }

  function groupById(id) {
    return GROUPS.find(function (group) { return group.id === id; });
  }

  function normalizeExerciseGroupIds(value, fallbackGroup) {
    const candidates = Array.isArray(value) ? value : [];
    const fallback = groupById(fallbackGroup) ? fallbackGroup : GROUPS[0].id;
    const valid = candidates.filter(function (groupId, index, list) {
      return Boolean(groupById(groupId)) && list.indexOf(groupId) === index;
    });
    return (valid.length ? valid : [fallback]).slice(0, 6);
  }

  function equalMuscleWeights(groupIds) {
    const groups = normalizeExerciseGroupIds(groupIds, groupIds && groupIds[0]);
    const weight = core.round(1 / groups.length, 4);
    const weights = {};
    groups.forEach(function (groupId) { weights[groupId] = weight; });
    return weights;
  }

  function normalizeStandardValues(value, fallback) {
    if (!Array.isArray(value) || value.length !== 5) return fallback.slice();
    const normalized = value.map(function (item) { return Number(item); });
    return normalized.every(function (item) { return Number.isFinite(item) && item >= 0; }) ? normalized : fallback.slice();
  }

  function normalizeCustomExercise(exercise) {
    if (!exercise || typeof exercise !== "object" || !exercise.id || !exercise.name) return null;
    const normalized = Object.assign({}, exercise);
    normalized.muscleGroups = normalizeExerciseGroupIds(normalized.muscleGroups, normalized.group);
    normalized.group = normalized.muscleGroups[0];
    normalized.muscleWeights = equalMuscleWeights(normalized.muscleGroups);
    normalized.customIconWidth = normalizeIconWidth(normalized.customIconWidth);
    normalized.customIcon = normalizeIconStrokes(normalized.customIcon, normalized.customIconWidth);
    normalized.type = normalized.type === "bodyweight" ? "bodyweight" : "weighted";
    const knownMotion = EXERCISE_ICON_OPTIONS.some(function (icon) { return icon.id === normalized.motion; });
    if (normalized.motion !== "custom" && !knownMotion) normalized.motion = "press";
    if (normalized.motion === "custom" && !normalized.customIcon.length) normalized.motion = "press";
    const maleFallback = normalized.type === "bodyweight" ? [5, 10, 20, 35, 55] : customReferenceStandards(normalized.muscleGroups, "male");
    const femaleFallback = normalized.type === "bodyweight" ? [3, 8, 15, 27, 42] : customReferenceStandards(normalized.muscleGroups, "female");
    normalized.male = normalizeStandardValues(normalized.male, maleFallback);
    normalized.female = normalizeStandardValues(normalized.female, femaleFallback);
    return normalized;
  }

  function exerciseGroups(exercise) {
    if (!exercise) return [];
    return normalizeExerciseGroupIds(exercise.muscleGroups, exercise.group);
  }

  function exerciseGroupNames(exercise) {
    return exerciseGroups(exercise).map(function (groupId) { return groupById(groupId).name; });
  }

  function exerciseGroupLabel(exercise) {
    const names = exerciseGroupNames(exercise);
    return names.length > 2 ? names.slice(0, 2).join(" + ") + " +" + (names.length - 2) : names.join(" + ");
  }

  function exerciseOverallWeight(exercise) {
    const groups = exerciseGroups(exercise);
    return groups.length ? 1 / groups.length : 1;
  }

  function exercisesForGroup(groupId) {
    return allExercises().filter(function (exercise) { return exerciseGroups(exercise).includes(groupId); });
  }

  function comparisonStandards(exercise) {
    return exercise[state.profile.standard] || exercise.male;
  }

  function isBodyweight(exercise) {
    return exercise && exercise.type === "bodyweight";
  }

  function exerciseMaxReps(exercise, weightedMaximum) {
    return isBodyweight(exercise) ? 5000 : (Number(weightedMaximum) || 20);
  }

  function exerciseRequirementOptions(exercise) {
    if (!exercise || exercise.custom || !equipment) return [];
    return equipment.requirements(exercise.id);
  }

  function isNoEquipment(exercise) {
    return Boolean(exercise && isBodyweight(exercise) && !exercise.equipment && !exerciseRequirementOptions(exercise).length);
  }

  function activeLocationId() {
    const available = normalizeLocationIds(state.settings.availableLocations);
    return available.includes(state.settings.activeLocation) ? state.settings.activeLocation : (available[0] || "home");
  }

  function activeLocationName() {
    return locationById(activeLocationId()).name;
  }

  function allEquipmentItems() {
    return (equipment ? equipment.items() : []).concat(normalizeCustomEquipment(state.settings.customEquipment));
  }

  function locationEquipmentIds(locationId) {
    const lists = normalizeLocationEquipment(state.settings.locationEquipment);
    return lists[locationId] || [];
  }

  function exerciseAvailableAtLocation(exercise, locationId) {
    if (!exercise) return false;
    if (!state.settings.locationSetupComplete) return true;
    if (isNoEquipment(exercise) || exercise.custom) return true;
    const options = exerciseRequirementOptions(exercise);
    if (!options.length) return false;
    const available = new Set(locationEquipmentIds(locationId || activeLocationId()));
    return options.some(function (option) {
      return option.every(function (equipmentId) { return available.has(equipmentId); });
    });
  }

  function exercisePreferenceScore(exercise) {
    const preference = state.settings.equipmentPreference;
    if (preference !== "machines" && preference !== "free_weights") return 0;
    const options = exerciseRequirementOptions(exercise);
    if (!options.length) return 1;
    const preferred = options.some(function (option) {
      return option.some(function (equipmentId) {
        const item = equipment && equipment.itemById(equipmentId);
        return item && item.kind === (preference === "machines" ? "machine" : "free_weights");
      });
    });
    return preferred ? 0 : 1;
  }

  function exerciseEquipmentLabel(exercise) {
    if (isNoEquipment(exercise)) return "No equipment";
    if (exercise && exercise.equipment) return exercise.equipment;
    const options = exerciseRequirementOptions(exercise);
    if (!options.length) return exercise && exercise.custom ? "Custom setup" : "Equipment";
    const first = options[0].map(function (id) {
      const item = equipment.itemById(id);
      return item ? item.name : id;
    });
    if (first.length === 1) return first[0];
    return first[0] + " + " + (first.length - 1) + " more";
  }

  function exerciseMatchesLibraryFilter(exercise, filter) {
    if (filter === "no_equipment") return isNoEquipment(exercise);
    if (filter === "equipment") return !isNoEquipment(exercise);
    return true;
  }

  function exerciseTagsMarkup(exercise) {
    if (!state.settings.showExerciseTags) return "";
    const groups = exerciseGroups(exercise);
    const groupTags = groups.slice(0, 2).map(function (groupId) {
      return '<em class="tag-muscle">' + escapeHtml(groupById(groupId).name) + '</em>';
    }).join("");
    const remaining = groups.length > 2 ? '<em class="tag-more">+' + (groups.length - 2) + '</em>' : "";
    return '<span class="library-tags">' + groupTags + remaining + '<em class="tag-equipment ' + (isNoEquipment(exercise) ? "tag-no-equipment" : "tag-needs-equipment") + '">' + escapeHtml(exerciseEquipmentLabel(exercise)) + '</em><em class="tag-scoring ' + (isBodyweight(exercise) ? "tag-bodyweight" : "tag-weighted") + '">' + (isBodyweight(exercise) ? "Bodyweight" : "Weighted") + '</em></span>';
  }

  function exerciseInfoButtonMarkup(exercise, extraClass) {
    return '<button class="exercise-info-button ' + (extraClass || "") + '" type="button" data-exercise-info="' + escapeHtml(exercise.id) + '" aria-label="How to do ' + escapeHtml(exercise.name) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg></button>';
  }

  function exerciseGuide(exercise) {
    const catalog = window.FossExerciseGuides;
    const verified = catalog && catalog.get(exercise.id);
    if (verified) return verified;
    return {
      description: exercise.name + " is a custom exercise. Its exact setup depends on how you created it.",
      steps: [
        "Use the setup you saved for this custom exercise.",
        "Start from a balanced position and use the same range on every rep.",
        "Complete the movement smoothly without bouncing or sudden momentum.",
        "Stop the set when you can no longer repeat the same clean motion."
      ],
      tip: "Custom exercises do not include a verified movement guide. Use a clear exercise name so you can remember its setup."
    };
  }

  function openExerciseInfo(exerciseId) {
    const exercise = exerciseById(exerciseId);
    if (!exercise) return;
    const guide = exerciseGuide(exercise);
    el.exerciseInfoGroup.textContent = exerciseGroupLabel(exercise).toUpperCase() + " · EXERCISE GUIDE";
    el.exerciseInfoTitle.textContent = exercise.name;
    el.exerciseInfoName.textContent = exercise.name;
    el.exerciseInfoDescription.textContent = guide.description;
    el.exerciseInfoArt.innerHTML = exerciseArtFor(exercise);
    el.exerciseInfoTags.innerHTML = exerciseGroupNames(exercise).map(function (name) { return '<span>' + escapeHtml(name) + '</span>'; }).join("") + '<span>' + escapeHtml(exerciseEquipmentLabel(exercise)) + '</span><span>' + (isBodyweight(exercise) ? "Bodyweight reps" : "Weighted load") + '</span>';
    el.exerciseInfoSteps.innerHTML = guide.steps.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join("");
    el.exerciseInfoTip.textContent = guide.tip;
    const ladder = rankLadderDetails(exercise);
    el.exerciseInfoRankTitle.textContent = ladder.title;
    el.exerciseInfoRankCopy.textContent = "Scroll to see every target in your current progression.";
    el.exerciseInfoRankings.innerHTML = ladder.markup;
    const sheet = el.exerciseInfoModal.querySelector(".exercise-info-sheet");
    if (sheet) sheet.scrollTop = 0;
    openModal("exerciseInfoModal");
  }

  function planExercises(plan) {
    return (plan && Array.isArray(plan.exercises) ? plan.exercises : []).map(function (entry) {
      return exerciseById(entry.exerciseId);
    }).filter(Boolean);
  }

  function planMatchesLibraryFilters(plan) {
    const exercises = planExercises(plan);
    if (exercises.length && !exercises.some(function (exercise) { return exerciseAvailableAtLocation(exercise); })) return false;
    if (workoutGroupFilter !== "all" && !exercises.some(function (exercise) { return exerciseGroups(exercise).includes(workoutGroupFilter); })) return false;
    if (workoutLibraryFilter === "no_equipment") return exercises.length > 0 && exercises.every(isNoEquipment);
    if (workoutLibraryFilter === "equipment") return exercises.some(function (exercise) { return !isNoEquipment(exercise); });
    return true;
  }

  function planTagsMarkup(plan) {
    if (!state.settings.showExerciseTags) return "";
    const exercises = planExercises(plan);
    if (!exercises.length) return "";
    const groups = Array.from(new Set(exercises.reduce(function (all, exercise) { return all.concat(exerciseGroups(exercise)); }, [])));
    const equipment = exercises.every(isNoEquipment) ? "No equipment" : exercises.every(function (exercise) { return !isNoEquipment(exercise); }) ? "Equipment" : "Mixed gear";
    const groupTags = groups.slice(0, 2).map(function (groupId) { return '<em class="tag-muscle">' + escapeHtml(groupById(groupId).name) + '</em>'; }).join("");
    const remaining = groups.length > 2 ? '<em class="tag-more">+' + (groups.length - 2) + '</em>' : "";
    const equipmentClass = equipment === "No equipment" ? "tag-no-equipment" : equipment === "Equipment" ? "tag-needs-equipment" : "tag-mixed-equipment";
    return '<span class="library-tags plan-tags"><em class="tag-equipment ' + equipmentClass + '">' + equipment + '</em>' + groupTags + remaining + '</span>';
  }

  function groupFilterOptions(selected) {
    return '<option value="all">All muscles</option>' + GROUPS.map(function (group) {
      return '<option value="' + group.id + '"' + (group.id === selected ? " selected" : "") + '>' + escapeHtml(group.name) + '</option>';
    }).join("");
  }

  function weightedScoreMode() {
    const mode = state.settings.weightedScoreMode;
    return mode === "one_rep_max" || mode === "estimated_one_rep_max" ? mode : "heaviest_set";
  }

  function estimatedOneRepMaxKg(weightKg, reps) {
    const weight = Number(weightKg) || 0;
    const repetitions = Math.max(1, Math.round(Number(reps) || 1));
    if (repetitions === 1) return weight;
    return weight * (1 + repetitions / 30);
  }

  function weightedScoreWeightKg(lift) {
    if (!(Number(lift && lift.weightKg) > 0)) return 0;
    const mode = weightedScoreMode();
    if (mode === "one_rep_max" && Number(lift.reps) !== 1) return 0;
    return mode === "estimated_one_rep_max"
      ? estimatedOneRepMaxKg(lift.weightKg, lift.reps)
      : Number(lift.weightKg);
  }

  function weightedLiftQualifies(lift) {
    return weightedScoreWeightKg(lift) > 0;
  }

  function weightedModeName(mode) {
    const value = mode || weightedScoreMode();
    if (value === "one_rep_max") return "Actual 1RM";
    if (value === "estimated_one_rep_max") return "Estimated 1RM";
    return "Heaviest set";
  }

  function weightedTargetSuffix() {
    if (weightedScoreMode() === "one_rep_max") return " 1RM";
    if (weightedScoreMode() === "estimated_one_rep_max") return " estimated 1RM";
    return " lifted";
  }

  function displayWeight(kg, digits) {
    if (!Number.isFinite(Number(kg))) return "--";
    return core.round(core.kgToDisplay(Number(kg), state.profile.units), digits == null ? 1 : digits);
  }

  function displayLength(cm, digits) {
    if (!Number.isFinite(Number(cm))) return "--";
    return core.round(core.cmToDisplay(Number(cm), state.profile.units), digits == null ? 1 : digits);
  }

  function loadUnit() {
    return state.profile.units === "kg" ? "kg" : "lb";
  }

  function exerciseLoadUnit(exercise) {
    return loadUnit();
  }

  function displayExerciseWeight(exercise, kg, digits) {
    return displayWeight(kg, digits);
  }

  function exerciseWeightToKg(exercise, value) {
    return core.displayToKg(value, state.profile.units);
  }

  function displayWeightedScore(lift, digits) {
    const exercise = exerciseById(lift && lift.exerciseId);
    return displayExerciseWeight(exercise, weightedScoreWeightKg(lift), digits) + " " + exerciseLoadUnit(exercise);
  }

  function lengthUnit() {
    return state.profile.units === "kg" ? "cm" : "in";
  }

  function dateLabel(dateString, includeYear) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: includeYear ? "numeric" : undefined
    }).format(date);
  }

  function timeLabel(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Unknown time";
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  }

  function dateTimeLabel(dateString, includeYear) {
    return dateLabel(dateString, includeYear) + " · " + timeLabel(dateString);
  }

  function localDateKey(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "unknown";
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  }

  function historyBundleWindowLabel() {
    const value = String(state.settings.historyBundleWindow || "day");
    if (value === "day") return "same day";
    if (value === "60") return "1 hour";
    if (value === "120") return "2 hours";
    if (value === "240") return "4 hours";
    return "30 minutes";
  }

  function bundleLiftHistory(entries) {
    const ordered = entries.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    const windowValue = String(state.settings.historyBundleWindow || "day");
    const minutes = Number(windowValue);
    const bundles = [];
    ordered.forEach(function (lift) {
      const lastBundle = bundles[bundles.length - 1];
      const previous = lastBundle && lastBundle.lifts[lastBundle.lifts.length - 1];
      const sameBundle = previous && (windowValue === "day"
        ? localDateKey(previous.date) === localDateKey(lift.date)
        : new Date(lift.date) - new Date(previous.date) <= minutes * 60 * 1000);
      if (sameBundle) lastBundle.lifts.push(lift);
      else bundles.push({ id: lift.id, lifts: [lift] });
    });
    return bundles.reverse();
  }

  function bestLiftForExercise(exerciseId) {
    const exercise = exerciseById(exerciseId);
    return state.lifts
      .filter(function (lift) {
        if (lift.exerciseId !== exerciseId) return false;
        return isBodyweight(exercise) ? Number(lift.reps) > 0 : weightedLiftQualifies(lift);
      })
      .sort(function (a, b) {
        if (isBodyweight(exercise)) return Number(b.reps) - Number(a.reps);
        return weightedScoreWeightKg(b) - weightedScoreWeightKg(a) || Number(b.weightKg) - Number(a.weightKg) || new Date(b.date) - new Date(a.date);
      })[0] || null;
  }

  function lastLiftForExercise(exerciseId) {
    return state.lifts
      .filter(function (lift) { return lift.exerciseId === exerciseId; })
      .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })[0] || null;
  }

  function resultForGroup(groupId) {
    let best = null;
    exercisesForGroup(groupId).forEach(function (exercise) {
      const lift = bestLiftForExercise(exercise.id);
      if (!lift) return;
      const rank = rankForExercise(exercise, lift.weightKg, lift.reps);
      const result = { exercise: exercise, lift: lift, rank: rank };
      if (!best || rank.percentile > best.rank.percentile) best = result;
    });
    return best;
  }

  function overallScoreFromGroupResults(results) {
    const scored = results.filter(Boolean);
    if (!scored.length) return 0;
    const totalWeight = scored.reduce(function (sum, item) { return sum + exerciseOverallWeight(item.exercise); }, 0);
    if (!(totalWeight > 0)) return 0;
    return core.round(scored.reduce(function (sum, item) {
      return sum + item.rank.percentile * exerciseOverallWeight(item.exercise);
    }, 0) / totalWeight, 1);
  }

  function scoreMeta(score) {
    const value = Math.round(Number(score) || 0);
    if (value >= 95) return { tier: "Elite", color: "#2DE2B6" };
    if (value >= 80) return { tier: "Advanced", color: "#62E66F" };
    if (value >= 60) return { tier: "Intermediate", color: "#B9F64A" };
    if (value >= 40) return { tier: "Novice", color: "#FFD15C" };
    if (value >= 20) return { tier: "Beginner", color: "#FF9E55" };
    return { tier: "Starter", color: "#FF5C5C" };
  }

  function worldRecordForExercise(exercise) {
    return exercise && window.FossWorldRecords
      ? window.FossWorldRecords.lookup(exercise.id, state.profile.standard)
      : null;
  }

  function exerciseRecordAchieved(exercise, lift) {
    const record = worldRecordForExercise(exercise);
    const saved = lift || (exercise ? bestLiftForExercise(exercise.id) : null);
    if (!record || !saved) return false;
    const score = isBodyweight(exercise) ? Number(saved.reps) : weightedScoreWeightKg(saved);
    const target = isBodyweight(exercise) ? Number(record.valueReps) : Number(record.valueKg);
    return target > 0 && score >= target;
  }

  function worldRecordMode() {
    return state.settings.rankTargetMode === "world_record";
  }

  function rankAgainstWorldRecord(exercise, weightKg, reps, record) {
    const scoreValue = isBodyweight(exercise)
      ? Number(reps) || 0
      : weightedScoreWeightKg({ weightKg: weightKg, reps: reps });
    const recordValue = isBodyweight(exercise) ? Number(record.valueReps) : Number(record.valueKg);
    const recordRatio = recordValue > 0 ? scoreValue / recordValue : 0;
    const percentile = core.round(core.clamp(recordRatio * 99, 0, 99), 1);
    const meta = scoreMeta(percentile);
    return {
      percentile: percentile,
      ratio: recordRatio,
      recordRatio: recordRatio,
      tier: meta.tier,
      color: meta.color,
      record: record,
      progression: core.rankProgress(percentile)
    };
  }

  function rankForExercise(exercise, weightKg, reps) {
    const record = worldRecordMode() ? worldRecordForExercise(exercise) : null;
    if (record) return rankAgainstWorldRecord(exercise, weightKg, reps, record);
    const trainingRank = isBodyweight(exercise)
      ? core.rankReps(reps, comparisonStandards(exercise))
      : core.rankLift(weightedScoreWeightKg({ weightKg: weightKg, reps: reps }), state.profile.bodyWeightKg, comparisonStandards(exercise));
    if (worldRecordMode()) trainingRank.recordUnavailable = true;
    return trainingRank;
  }

  function bakiBaseTargetValue(exercise) {
    if (!exercise) return 0;
    const topTrainingValue = core.valueForPercentile(99, comparisonStandards(exercise));
    return isBodyweight(exercise) ? topTrainingValue : topTrainingValue * state.profile.bodyWeightKg;
  }

  function bakiScaleForPerformance(exercise, performance) {
    if (!exercise || !performance) return 0;
    const baseTarget = bakiBaseTargetValue(exercise);
    const actual = isBodyweight(exercise) ? Number(performance.reps) || 0 : weightedScoreWeightKg(performance);
    if (!(baseTarget > 0) || !(actual > 0)) return 0;
    return core.round(core.clamp(actual / baseTarget, 0, 99.999), 3);
  }

  function currentBakiScaleScore() {
    const values = allExercises().map(function (exercise) {
      const lift = bestLiftForExercise(exercise.id);
      return lift ? bakiScaleForPerformance(exercise, lift) : null;
    }).filter(function (value) { return value != null; });
    if (!values.length) return 0;
    return core.round(values.reduce(function (sum, value) { return sum + value; }, 0) / values.length, 3);
  }

  function bakiTargetValue(exercise, multiplier) {
    return bakiBaseTargetValue(exercise) * Math.max(100, Number(multiplier) || 100);
  }

  function bakiTargetText(exercise, multiplier) {
    const targetValue = bakiTargetValue(exercise, multiplier);
    if (isBodyweight(exercise)) {
      const reps = Math.max(1, Math.ceil(targetValue));
      return reps.toLocaleString("en-US") + " parody reps";
    }
    return Number(displayExerciseWeight(exercise, targetValue, 0)).toLocaleString("en-US") + " " + exerciseLoadUnit(exercise) + weightedTargetSuffix();
  }

  function progressionForScore(score, exercise, performance) {
    if (state.settings.progression === "baki") {
      const lift = performance || (exercise ? bestLiftForExercise(exercise.id) : null);
      const scaleScore = exercise ? bakiScaleForPerformance(exercise, lift) : currentBakiScaleScore();
      const progression = core.progressionForScore(scaleScore, "baki");
      progression.basePercentile = Number(score) || 0;
      progression.scaleScore = scaleScore;
      progression.parodyOnly = true;
      return progression;
    }
    let progression = core.progressionForScore(score, state.settings.progression);
    if (state.settings.progression !== "training") return progression;
    const hasMetric = Boolean(exercise && worldRecordForExercise(exercise));
    if (progression.title === "World class" && (!hasMetric || !exerciseRecordAchieved(exercise))) {
      progression = core.progressionForScore(Math.min(Number(score) || 1, 97), state.settings.progression);
    }
    if (!hasMetric && progression.nextTitle === "World class") {
      progression = Object.assign({}, progression, { nextTitle: null, nextAt: null, progressToNext: 100, isMaximum: true });
    }
    return progression;
  }

  function pointLabel() {
    const option = POINT_LABEL_OPTIONS.find(function (item) { return item.id === state.settings.pointLabel; }) || POINT_LABEL_OPTIONS[0];
    if (option.id !== "custom") return option;
    const custom = String(state.settings.customPointLabel || "").trim().slice(0, 18) || "Points";
    return { id: "custom", name: custom, unit: custom };
  }

  function formatPoints(value) {
    return Math.max(0, Math.round(Number(value) || 0)).toLocaleString("en-US") + " " + pointLabel().unit;
  }

  function progressionPoints(score) {
    return state.settings.progression === "baki" ? core.bakiPoints(score) : core.fossaPoints(score);
  }

  function progressionStepPercentile(stepScore) {
    return core.progressionTargetPercentile(stepScore, state.settings.progression);
  }

  function pointsNeeded(progression) {
    if (!progression || !progression.nextAt) return 0;
    const nextScore = progressionStepPercentile(progression.nextAt);
    const currentScore = Number(progression.basePercentile) || Number(progression.percentile) || 0;
    return Math.max(0, progressionPoints(nextScore) - progressionPoints(currentScore));
  }

  function nextTargetForResult(result) {
    if (!result || !result.displayRank || !result.displayRank.nextAt) return null;
    if (state.settings.progression === "baki") return bakiTargetText(result.exercise, result.displayRank.nextAt);
    const targetPercentile = progressionStepPercentile(result.displayRank.nextAt);
    const officialRecord = worldRecordForExercise(result.exercise);
    const nextIsWorldClass = state.settings.progression === "training" && result.displayRank.nextTitle === "World class";
    const record = worldRecordMode() || nextIsWorldClass ? officialRecord : null;
    if (record && (Number(record.valueKg) > 0 || Number(record.valueReps) > 0)) {
      const fraction = nextIsWorldClass ? 1 : (worldRecordMode() ? targetPercentile / 99 : 1);
      if (isBodyweight(result.exercise)) {
        const targetReps = Math.max(1, Math.ceil(Number(record.valueReps) * fraction));
        return targetReps.toLocaleString("en-US") + " official consecutive reps";
      }
      const targetKg = Number(record.valueKg) * fraction;
      return displayExerciseWeight(result.exercise, targetKg, 1) + " " + exerciseLoadUnit(result.exercise) + " official 1RM";
    }
    const targetValue = core.valueForPercentile(targetPercentile, comparisonStandards(result.exercise));
    if (isBodyweight(result.exercise)) {
      const reps = Math.max(1, Math.ceil(targetValue));
      return reps + (reps === 1 ? " clean rep" : " clean reps");
    }
    const targetKg = targetValue * state.profile.bodyWeightKg;
    return displayExerciseWeight(result.exercise, targetKg, 1) + " " + exerciseLoadUnit(result.exercise) + weightedTargetSuffix();
  }

  function logoArt(id) {
    if (id === "custom") return drawnPlanIconArt(state.settings.customAppMark, state.settings.customAppMarkWidth);
    if (id === "barbell") return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 11v10M8 8v16M24 8v16M28 11v10M8 16h16"/></svg>';
    if (id === "bolt") return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 2L7 18h8l-1 12 11-17h-8z"/></svg>';
    if (id === "flame") return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M17 3c1 7-7 8-7 16a7 7 0 0014 0c0-5-3-9-6-12 0 5-3 6-3 10-2-3-1-8 2-14z"/></svg>';
    if (id === "trophy") return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 5h12v7c0 5-3 8-6 8s-6-3-6-8zM10 8H5v3c0 4 3 6 7 6M22 8h5v3c0 4-3 6-7 6M16 20v5M10 28h12M12 25h8"/></svg>';
    return "F";
  }

  function normalizeHexColor(value) {
    let hex = String(value || "").trim().toUpperCase();
    if (/^#[0-9A-F]{3}$/.test(hex)) {
      hex = "#" + hex.slice(1).split("").map(function (character) { return character + character; }).join("");
    }
    return /^#[0-9A-F]{6}$/.test(hex) ? hex : null;
  }

  function hexColorParts(hex) {
    const normalized = normalizeHexColor(hex) || "#B9F64A";
    return {
      red: parseInt(normalized.slice(1, 3), 16),
      green: parseInt(normalized.slice(3, 5), 16),
      blue: parseInt(normalized.slice(5, 7), 16)
    };
  }

  function hsvToHex(hue, saturation, value) {
    const h = ((Number(hue) % 360) + 360) % 360;
    const s = core.clamp(Number(saturation) || 0, 0, 100) / 100;
    const v = core.clamp(Number(value) || 0, 0, 100) / 100;
    const chroma = v * s;
    const segment = h / 60;
    const second = chroma * (1 - Math.abs((segment % 2) - 1));
    let red = 0;
    let green = 0;
    let blue = 0;
    if (segment < 1) { red = chroma; green = second; }
    else if (segment < 2) { red = second; green = chroma; }
    else if (segment < 3) { green = chroma; blue = second; }
    else if (segment < 4) { green = second; blue = chroma; }
    else if (segment < 5) { red = second; blue = chroma; }
    else { red = chroma; blue = second; }
    const match = v - chroma;
    const toHex = function (channel) {
      return Math.round((channel + match) * 255).toString(16).padStart(2, "0");
    };
    return ("#" + toHex(red) + toHex(green) + toHex(blue)).toUpperCase();
  }

  function hexToHsv(hex) {
    const color = hexColorParts(hex);
    const red = color.red / 255;
    const green = color.green / 255;
    const blue = color.blue / 255;
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const delta = maximum - minimum;
    let hue = 0;
    if (delta) {
      if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
      else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
      else hue = 60 * ((red - green) / delta + 4);
    }
    if (hue < 0) hue += 360;
    return {
      hue: Math.round(hue),
      saturation: maximum ? Math.round((delta / maximum) * 100) : 0,
      value: Math.round(maximum * 100)
    };
  }

  function selectedPickerHex() {
    return hsvToHex(colorPickerHue, colorPickerSaturation, colorPickerValue);
  }

  function renderColorPicker() {
    if (!el.colorSpectrum) return;
    const hex = selectedPickerHex();
    el.colorSpectrum.style.setProperty("--picker-hue", String(colorPickerHue));
    el.colorSpectrumCursor.style.left = colorPickerSaturation + "%";
    el.colorSpectrumCursor.style.top = (100 - colorPickerValue) + "%";
    el.colorHueSlider.value = String(colorPickerHue);
    el.customAccentHex.value = hex;
    el.colorPreview.style.background = hex;
    el.colorPickerValues.innerHTML = '<span>H ' + colorPickerHue + '°</span><span>S ' + colorPickerSaturation + '%</span><span>V ' + colorPickerValue + '%</span>';
    el.colorSpectrum.setAttribute("aria-valuetext", "Saturation " + colorPickerSaturation + " percent, value " + colorPickerValue + " percent");
  }

  function openCustomColorPicker() {
    const hsv = hexToHsv(normalizeHexColor(state.settings.customAccent) || "#B9F64A");
    colorPickerHue = hsv.hue;
    colorPickerSaturation = hsv.saturation;
    colorPickerValue = hsv.value;
    renderColorPicker();
    openModal("colorPickerModal");
  }

  function setColorFromSpectrum(event) {
    const rect = el.colorSpectrum.getBoundingClientRect();
    if (!(rect.width > 0) || !(rect.height > 0)) return;
    colorPickerSaturation = Math.round(core.clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100);
    colorPickerValue = Math.round((1 - core.clamp((event.clientY - rect.top) / rect.height, 0, 1)) * 100);
    renderColorPicker();
  }

  function applyAppearance() {
    document.body.dataset.theme = state.settings.theme || "lime";
    document.body.classList.toggle("baki-mode", state.settings.progression === "baki");
    const customAccent = normalizeHexColor(state.settings.customAccent);
    if (state.settings.useCustomAccent && customAccent) {
      const color = hexColorParts(customAccent);
      document.body.style.setProperty("--accent", customAccent);
      document.body.style.setProperty("--accent-rgb", color.red + ", " + color.green + ", " + color.blue);
      document.body.style.setProperty("--accent-dark", "rgb(" + Math.round(color.red * 0.14) + ", " + Math.round(color.green * 0.14) + ", " + Math.round(color.blue * 0.14) + ")");
    } else {
      document.body.style.removeProperty("--accent");
      document.body.style.removeProperty("--accent-rgb");
      document.body.style.removeProperty("--accent-dark");
    }
    const mark = logoArt(state.settings.logo || "f");
    document.querySelectorAll("[data-app-logo]").forEach(function (node) { node.innerHTML = mark; });
    const appTitle = normalizeAppTitle(state.settings.appTitle);
    document.title = appTitle;
    document.querySelectorAll("[data-app-title]").forEach(function (node) { node.textContent = appTitle.toUpperCase(); });
    const brand = document.querySelector(".brand");
    if (brand) brand.setAttribute("aria-label", appTitle);
  }

  function normalizeIconWidth(value) {
    const numeric = Number(value);
    return Math.round(core.clamp(Number.isFinite(numeric) ? numeric : 4, 2, 8) * 2) / 2;
  }

  function normalizeIconStrokes(value, fallbackWidth) {
    if (!Array.isArray(value)) return [];
    const defaultWidth = normalizeIconWidth(fallbackWidth);
    return value.slice(0, 60).map(function (stroke) {
      const legacyPoints = Array.isArray(stroke) ? stroke : null;
      const points = legacyPoints || (stroke && Array.isArray(stroke.points) ? stroke.points : []);
      const width = normalizeIconWidth(legacyPoints ? defaultWidth : stroke && stroke.width != null ? stroke.width : defaultWidth);
      return {
        width: width,
        points: points.slice(0, 360).map(function (point) {
          const x = core.clamp(Number(point && point.x) || 0, 0, 100);
          const y = core.clamp(Number(point && point.y) || 0, 0, 100);
          return { x: core.round(x, 2), y: core.round(y, 2) };
        })
      };
    }).filter(function (stroke) { return stroke.points.length >= 2; });
  }

  function drawnPlanIconArt(strokes, strokeWidth) {
    const clean = normalizeIconStrokes(strokes, strokeWidth);
    if (!clean.length) {
      return '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 48l5-14L43 10l11 11-24 24zM19 34l11 11M41 12l11 11"/><path d="M12 53h40"/></svg>';
    }
    return '<svg class="drawn-plan-icon" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' + clean.map(function (stroke) {
      return '<polyline stroke-width="' + stroke.width + '" points="' + stroke.points.map(function (point) { return point.x + ',' + point.y; }).join(' ') + '"/>';
    }).join('') + '</svg>';
  }

  function planIconArt(planOrIcon, customIcon, customIconWidth) {
    const plan = planOrIcon && typeof planOrIcon === "object" ? planOrIcon : { icon: planOrIcon, customIcon: customIcon, customIconWidth: customIconWidth };
    if (plan.icon === "custom") return drawnPlanIconArt(plan.customIcon, plan.customIconWidth);
    const icon = PLAN_ICONS.find(function (item) { return item.id === plan.icon; }) || PLAN_ICONS[0];
    return exerciseArt(icon.motion);
  }

  function setSegment(container, value) {
    if (!container) return;
    container.querySelectorAll("button[data-value]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.value === value);
    });
  }

  function bindSegment(container, callback) {
    container.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      setSegment(container, button.dataset.value);
      callback(button.dataset.value);
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    applyCooldownPlacement();
    armBackGuard();
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.open, .confirm-dialog.open")) {
      document.body.classList.remove("modal-open");
    }
    if (id === "equipmentModal") pendingLocationActivation = null;
    applyCooldownPlacement();
    armBackGuard();
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.classList.add("show");
    toastTimer = setTimeout(function () { el.toast.classList.remove("show"); }, 2300);
  }

  function donationOptionById(id) {
    if (id === ONE_TIME_DONATION.id) return ONE_TIME_DONATION;
    return MONTHLY_DONATIONS.find(function (item) { return item.id === id; }) || MONTHLY_DONATIONS[2];
  }

  function launchDonation(optionId) {
    const option = donationOptionById(optionId);
    if (window.FossLinks && typeof window.FossLinks.openDonation === "function") {
      window.FossLinks.openDonation(option.id);
      return;
    }
    if (window.FossLinks && typeof window.FossLinks.openDonatePage === "function" && option.id === ONE_TIME_DONATION.id) {
      window.FossLinks.openDonatePage();
      return;
    }
    try {
      const opened = window.open(option.url, "_blank", "noopener,noreferrer");
      if (opened) return;
    } catch (error) {}
    showToast("Open the Foss Gym donation link from the Android app.");
  }

  function renderDonationPage() {
    const monthly = MONTHLY_DONATIONS[donationMonthlyIndex] || MONTHLY_DONATIONS[2];
    el.donationTabs.querySelectorAll("[data-donation-tab]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.donationTab === donationTab);
    });
    el.monthlyDonationPanel.classList.toggle("hidden", donationTab !== "monthly");
    el.oneTimeDonationPanel.classList.toggle("hidden", donationTab !== "one-time");
    el.monthlyDonationSlider.value = String(donationMonthlyIndex);
    el.monthlyDonationSlider.setAttribute("aria-valuetext", monthly.label + " per month");
    el.monthlyDonationAmount.textContent = monthly.label;
    el.donationSubmitButton.textContent = donationTab === "monthly"
      ? "Donate " + monthly.label + " monthly"
      : "Choose one-time amount";
  }

  function openDonatePage() {
    renderDonationPage();
    openModal("donationModal");
  }

  function donationReminderHandled() {
    state.settings.donationReminderNextAt = Date.now() + DONATION_REMINDER_INTERVAL_MS;
    saveState();
    el.donationReminder.classList.add("hidden");
    scheduleDonationReminder();
  }

  function scheduleDonationReminder() {
    clearTimeout(donationReminderTimer);
    if (!el.donationReminder || !state.profile.onboarded) {
      if (el.donationReminder) el.donationReminder.classList.add("hidden");
      return;
    }
    const nextAt = nextDonationReminderAt(state.settings.donationReminderNextAt);
    state.settings.donationReminderNextAt = nextAt;
    const delay = nextAt - Date.now();
    if (delay <= 0) {
      el.donationReminder.classList.remove("hidden");
      return;
    }
    el.donationReminder.classList.add("hidden");
    donationReminderTimer = setTimeout(scheduleDonationReminder, Math.min(delay, 2147483647));
  }

  function showFeedbackBanner(message, kind) {
    if (!el.feedbackBanner) return;
    clearTimeout(feedbackBannerTimer);
    el.feedbackBanner.classList.remove("show", "success", "error");
    void el.feedbackBanner.offsetWidth;
    el.feedbackBanner.textContent = message;
    el.feedbackBanner.classList.add(kind === "error" ? "error" : "success", "show");
    feedbackBannerTimer = setTimeout(function () {
      el.feedbackBanner.classList.remove("show");
    }, kind === "error" ? 2800 : 2300);
  }

  function vibratePhone(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (error) {}
  }

  function flashSavedScore(exerciseId) {
    const quickCard = el.workoutLogger && el.workoutLogger.querySelector('[data-quick-exercise="' + exerciseId + '"]');
    const liftCard = el.liftModal && el.liftModal.classList.contains("open") ? el.liftModal.querySelector(".lift-visual-card") : null;
    const card = quickCard || liftCard;
    if (!card) return;
    card.classList.remove("score-saved");
    void card.offsetWidth;
    card.classList.add("score-saved");
    setTimeout(function () { card.classList.remove("score-saved"); }, 2100);
  }

  function askConfirm(options, onConfirm) {
    pendingConfirm = onConfirm;
    el.confirmTitle.textContent = options.title || "Are you sure?";
    el.confirmMessage.textContent = options.message || "This action cannot be undone.";
    el.confirmCancel.textContent = options.cancel || "Cancel";
    el.confirmOkay.textContent = options.button || "Delete";
    el.confirmDialog.classList.add("open");
    el.confirmDialog.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    armBackGuard();
  }

  function confirmComparisonProfile(nextStandard, onConfirm) {
    const next = nextStandard === "female" ? "female" : "male";
    const title = "Switch comparison profile to " + (next === "female" ? "Female" : "Male") + "?";
    const address = next === "female" ? "ma'am" : "sir";
    askConfirm({
      title: title,
      message: "Are you sure? Rankings and world records will use the " + (next === "female" ? "women's" : "men's") + " comparison profile. People will be calling you " + address + " and stuff.",
      button: "Switch"
    }, onConfirm);
  }

  function closeConfirm() {
    pendingConfirm = null;
    el.confirmDialog.classList.remove("open");
    el.confirmDialog.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.open")) document.body.classList.remove("modal-open");
  }

  function navigate(tab) {
    if (tab === "workouts") {
      selectedPlanId = null;
      workoutHighScoresOpen = false;
      renderWorkouts();
    }
    if (tab === "dashboard") {
      dashboardAllScoresOpen = false;
      renderDashboard();
    }
    currentTab = tab;
    document.querySelectorAll(".page[data-page]").forEach(function (page) {
      page.classList.toggle("active", page.dataset.page === tab);
    });
    document.querySelectorAll(".nav-item[data-tab]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.tab === tab);
    });
    window.scrollTo(0, 0);
    if (tab === "body") {
      setTimeout(drawWeightChart, 50);
      setTimeout(drawCardioChart, 50);
    }
    if (tab === "dashboard") setTimeout(drawDashboardChart, 50);
    applyCooldownPlacement();
    armBackGuard();
  }

  function armBackGuard() {
    if (backGuardArmed) return;
    try {
      history.pushState({ fossGuard: true }, "", location.href);
      backGuardArmed = true;
    } catch (error) {
      backGuardArmed = true;
    }
  }

  function initializeBackNavigation() {
    try {
      history.replaceState({ fossRoot: true }, "", location.href);
    } catch (error) {}
    armBackGuard();
    window.addEventListener("popstate", function () {
      backGuardArmed = false;
      if (el.confirmDialog.classList.contains("open")) {
        closeConfirm();
        armBackGuard();
        return;
      }
      if (el.setupModal.classList.contains("open") && setupCurrentStep === 3) {
        showSetupStep(2);
        armBackGuard();
        return;
      }
      if (el.setupModal.classList.contains("open") && setupCurrentStep === 2) {
        showSetupStep(1);
        armBackGuard();
        return;
      }
      if (el.setupModal.classList.contains("open") && !setupIsEdit) {
        showToast("Finish setup before leaving Foss Gym.");
        armBackGuard();
        return;
      }
      const modalOrder = ["donationModal", "cardioGoalModal", "measurementDisplayModal", "measurementHistoryEditModal", "measurementHistoryModal", "weightGoalModal", "developerNoteModal", "copyrightModal", "customPhysiqueModal", "proportionalTargetsModal", "equipmentModal", "iconDrawModal", "exerciseInfoModal", "colorPickerModal", "customExerciseModal", "exercisePickerModal", "quickMeasurementModal", "measurementModal", "bodyInfoModal", "settingsModal", "infoModal", "planModal", "liftModal", "setupModal"];
      const openId = modalOrder.find(function (id) { return el[id] && el[id].classList.contains("open"); });
      if (openId) {
        if (openId === "planModal") requestClosePlanEditor();
        else closeModal(openId);
        armBackGuard();
        return;
      }
      if (currentTab === "workouts" && (selectedPlanId || workoutHighScoresOpen)) {
        selectedPlanId = null;
        workoutHighScoresOpen = false;
        renderWorkouts();
        armBackGuard();
        return;
      }
      if (currentTab === "dashboard" && dashboardAllScoresOpen) {
        dashboardAllScoresOpen = false;
        renderDashboard();
        armBackGuard();
        return;
      }
      if (currentTab !== "strength") {
        navigate("strength");
        return;
      }
      showToast("Press Back again to exit.");
    });
  }

  function renderStrength() {
    const results = GROUPS.map(function (group) {
      return { group: group, result: resultForGroup(group.id) };
    });
    const tested = results.filter(function (item) { return item.result; });
    const overall = overallScoreFromGroupResults(tested.map(function (item) { return item.result; }));
    const meta = scoreMeta(overall);
    const progression = tested.length ? progressionForScore(overall) : null;

    el.coveragePill.textContent = tested.length + " / " + GROUPS.length + " tested";
    el.overallScore.textContent = progression ? progression.primary : "--";
    el.overallScore.classList.toggle("rank-long", Boolean(progression && progression.primary.length > 5));
    el.overallScore.classList.toggle("rank-very-long", Boolean(progression && progression.primary.length > 18));
    el.overallScore.style.color = tested.length ? meta.color : "var(--accent)";
    el.overallTier.textContent = progression ? progression.title : "Add your first lift";
    el.overallSubtext.textContent = progression ? formatPoints(progressionPoints(overall)) + (state.settings.progression === "baki"
      ? " · parody display only"
      : worldRecordMode() ? " · record-progress score" : " · " + core.ordinal(overall) + " percentile estimate") : "Scores use tested muscles only";
    if (el.rankInfoName) el.rankInfoName.textContent = state.settings.progression === "dragonball"
      ? "Dragon Ball character equivalent"
      : state.settings.progression === "baki" ? "Baki character equivalent" : progression ? progression.schemeName : "Progression style";
    if (el.rankInfoDescription) {
      const scheme = core.progressionSchemes().find(function (item) { return item.id === state.settings.progression; });
      el.rankInfoDescription.textContent = (scheme ? scheme.description : "Your selected style represents the same underlying strength score.") + (state.settings.progression === "baki"
        ? " Character ranks are intentionally unreachable and never replace your real exercise data."
        : " Changing the style never changes your score or saved high scores.");
    }
    if (el.scoreInfoCopy) {
      const label = pointLabel();
      el.scoreInfoCopy.textContent = state.settings.progression === "baki"
        ? "Baki logic intentionally explodes the displayed " + label.unit + " into nonsense and starts its first character target at 100 times the normal top-end exercise target. Your real score and saved records never change."
        : label.name + " is the universal score underneath every progression style. The scale runs from 0 to 9,900 " + label.unit + ". You can rename it in Settings.";
    }
    if (el.weightedScoreInfoCopy) {
      if (weightedScoreMode() === "one_rep_max") {
        el.weightedScoreInfoCopy.textContent = "Weighted movements only count saved sets with exactly 1 rep. Other weighted sets stay in your history but do not change your actual 1RM or rank. Bodyweight movements use your best clean rep count.";
      } else if (weightedScoreMode() === "estimated_one_rep_max") {
        el.weightedScoreInfoCopy.textContent = "Weighted movements estimate a one-rep max from each saved weight and rep count with the Epley formula. Bodyweight movements use your best clean rep count.";
      } else {
        el.weightedScoreInfoCopy.textContent = "Weighted movements use the heaviest weight you actually saved. Rep count never inflates that score. Bodyweight movements use your best clean rep count.";
      }
    }

    results.forEach(function (item) {
      const color = item.result ? item.result.rank.color : "#3B433F";
      document.querySelectorAll('.muscle[data-group="' + item.group.id + '"]').forEach(function (shape) {
        shape.setAttribute("fill", color);
        shape.style.setProperty("fill", color, "important");
        shape.classList.toggle("heat-tested", Boolean(item.result));
      });
    });

    el.muscleGrid.innerHTML = results.map(function (item) {
      const result = item.result;
      const displayRank = result ? progressionForScore(result.rank.percentile, result.exercise) : null;
      const score = displayRank ? displayRank.shortLabel : "--";
      const detail = result
        ? result.exercise.name + " · " + (isBodyweight(result.exercise)
          ? result.lift.reps + " reps"
          : displayWeightedScore(result.lift, 0) + (weightedScoreMode() === "one_rep_max" ? " actual 1RM" : weightedScoreMode() === "estimated_one_rep_max" ? " estimated 1RM" : " best"))
        : "Tap to add a lift";
      const color = result ? result.rank.color : "#3B433F";
      const newestLiftTime = state.lifts.reduce(function (latest, lift) {
        const exercise = exerciseById(lift.exerciseId);
        if (!exercise || !exerciseGroups(exercise).includes(item.group.id)) return latest;
        const time = new Date(lift.date).getTime();
        return Number.isFinite(time) ? Math.max(latest, time) : latest;
      }, 0);
      const recentDays = Number(state.settings.recentTrainingWindowDays) || 7;
      const ageDays = newestLiftTime ? Math.max(0, (Date.now() - newestLiftTime) / 86400000) : recentDays;
      const recentOpacity = ageDays < recentDays ? core.clamp(1 - ageDays / recentDays, 0, 1) : 0;
      const progress = displayRank ? core.clamp(Number(displayRank.progressToNext) || 0, 0, 100) : 0;
      return '<button class="muscle-card' + (recentOpacity > 0 ? ' recently-trained' : '') + '" type="button" data-muscle-card="' + item.group.id + '" style="--score-color:' + color + ';--recent-opacity:' + core.round(recentOpacity, 3) + '">' +
        '<div class="muscle-card-top"><strong>' + item.group.name + '</strong><span class="muscle-card-score ' + (score.length > 8 ? "long" : "") + '">' + score + '</span></div>' +
        '<small>' + escapeHtml(detail) + '</small><span class="muscle-card-progress" aria-label="' + core.round(progress, 0) + ' percent to next rank"><i style="width:' + progress + '%"></i></span></button>';
    }).join("");
  }

  function openLift(groupId, exerciseId) {
    const group = groupById(groupId) || GROUPS[0];
    activeLiftGroup = group.id;
    activeExerciseId = exerciseId || (resultForGroup(group.id) || {}).exercise?.id || group.defaultExercise;
    liftScoresExpanded = false;
    renderLiftModal(true);
    openModal("liftModal");
  }

  function renderLiftModal(prefill) {
    const group = groupById(activeLiftGroup);
    const exercise = exerciseById(activeExerciseId) || exerciseById(group.defaultExercise);
    const bodyweight = isBodyweight(exercise);
    activeExerciseId = exercise.id;
    el.liftGroupLabel.textContent = group.name.toUpperCase();
    el.liftTitle.textContent = exercise.name;
    el.liftExerciseChips.innerHTML = exercisesForGroup(group.id).map(function (item) {
      return '<button class="exercise-chip ' + (item.id === exercise.id ? "active" : "") + '" type="button" data-lift-exercise="' + item.id + '">' + escapeHtml(item.name) + '</button>';
    }).join("");
    el.liftExerciseArt.innerHTML = exerciseArtFor(exercise);
    renderWorldRecordCard(exercise);
    el.liftUnitLabel.textContent = exerciseLoadUnit(exercise).toUpperCase();
    el.liftWeightField.classList.toggle("hidden", bodyweight);
    el.liftInputPair.classList.toggle("bodyweight-entry", bodyweight);
    el.liftBestLabel.textContent = bodyweight ? "BEST REPS" : weightedScoreMode() === "one_rep_max" ? "ACTUAL 1RM" : weightedScoreMode() === "estimated_one_rep_max" ? "ESTIMATED 1RM" : "HEAVIEST SET";
    el.liftRepsInput.max = String(exerciseMaxReps(exercise, 20));
    if (bodyweight) {
      el.liftHelpText.textContent = "Count clean, full-range reps. Your highest rep count is the score.";
    } else if (weightedScoreMode() === "one_rep_max") {
      el.liftHelpText.textContent = "Only a saved set with exactly 1 rep changes your actual 1RM high score. Other sets still save to history.";
    } else if (weightedScoreMode() === "estimated_one_rep_max") {
      el.liftHelpText.textContent = "Your weight and reps estimate a one-rep max with the Epley formula. Every set stays in history.";
    } else {
      el.liftHelpText.textContent = "Your score is the heaviest weight you actually save. Reps never inflate it.";
    }

    const best = bestLiftForExercise(exercise.id);
    if (best) {
      el.bestOneRepMax.textContent = bodyweight
        ? best.reps + (best.reps === 1 ? " rep" : " reps")
        : displayWeightedScore(best, 1);
      el.bestLiftDate.textContent = (!bodyweight && weightedScoreMode() === "one_rep_max"
        ? "Actual 1RM logged "
        : !bodyweight && weightedScoreMode() === "estimated_one_rep_max"
          ? "Estimated from set logged "
          : "Best set logged ") + dateLabel(best.date, false);
    } else {
      el.bestOneRepMax.textContent = "Not set";
      el.bestLiftDate.textContent = "Log a hard set below";
    }

    if (prefill) {
      const last = lastLiftForExercise(exercise.id);
      el.liftWeightInput.value = !bodyweight && last ? displayExerciseWeight(exercise, last.weightKg, 1) : "";
      el.liftRepsInput.value = bodyweight ? (last ? last.reps : 10) : weightedScoreMode() === "one_rep_max" ? 1 : (last ? last.reps : 5);
    }
    renderLiftScoreHistory(exercise);
    renderLiftRankLadder(exercise);
    updateLiveRank();
  }

  function renderLiftScoreHistory(exercise) {
    const entries = state.lifts
      .filter(function (lift) { return lift.exerciseId === exercise.id; })
      .sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    const bundles = bundleLiftHistory(entries);
    const visibleBundles = liftScoresExpanded ? bundles : bundles.slice(0, 3);
    el.liftScoreCount.textContent = bundles.length > 3 && !liftScoresExpanded
      ? "Showing latest 3 of " + bundles.length + " sessions · " + entries.length + " sets"
      : bundles.length + (bundles.length === 1 ? " session" : " sessions") + " · " + entries.length + (entries.length === 1 ? " set" : " sets");
    el.viewAllLiftScores.classList.toggle("hidden", bundles.length <= 3);
    el.viewAllLiftScores.textContent = liftScoresExpanded ? "Show latest 3" : "View all";
    el.liftScoreHistory.innerHTML = entries.length ? visibleBundles.map(function (bundle) {
      const bodyweight = isBodyweight(exercise);
      const first = bundle.lifts[0];
      const last = bundle.lifts[bundle.lifts.length - 1];
      const setTexts = bundle.lifts.map(function (lift) {
        return bodyweight
          ? lift.reps + (lift.reps === 1 ? " clean rep" : " clean reps")
          : displayExerciseWeight(exercise, lift.weightKg, 1) + " " + exerciseLoadUnit(exercise) + " × " + lift.reps;
      });
      const heading = bundle.lifts.length === 1 ? setTexts[0] : bundle.lifts.length + " sets";
      const timestamp = dateLabel(first.date, true) + " · " + timeLabel(first.date) + (bundle.lifts.length > 1 ? "–" + timeLabel(last.date) : "");
      const modeNote = bundle.lifts.length === 1 && !bodyweight && weightedScoreMode() === "one_rep_max"
        ? (Number(first.reps) === 1 ? "Counts as actual 1RM · " : "Saved set only · ")
        : bundle.lifts.length === 1 && !bodyweight && weightedScoreMode() === "estimated_one_rep_max"
          ? "Estimated " + displayWeightedScore(first, 1) + " 1RM · "
          : "";
      const setList = bundle.lifts.length > 1
        ? '<span class="score-bundle-sets">' + setTexts.map(function (text) { return '<em>' + escapeHtml(text) + '</em>'; }).join("") + '</span>'
        : "";
      return '<div class="score-history-row score-history-bundle"><span><strong>' + escapeHtml(heading) + '</strong>' + setList + '<small>' + escapeHtml(modeNote + timestamp) + '</small></span>' +
        '<button type="button" data-delete-bundle="' + escapeHtml(bundle.id) + '" aria-label="Delete this exercise session">Delete</button></div>';
    }).join("") : '<p class="score-history-empty">No saved scores for this exercise yet.</p>';
  }

  function rankLadderDetails(exercise) {
    const scheme = core.progressionSchemes().find(function (item) { return item.id === state.settings.progression; });
    const officialRecord = worldRecordForExercise(exercise);
    const steps = core.progressionSteps(state.settings.progression).filter(function (step) {
      return !(state.settings.progression === "training" && step.title === "World class" && !officialRecord);
    });
    const record = worldRecordMode() ? officialRecord : null;
    const best = bestLiftForExercise(exercise.id);
    const currentRank = best ? rankForExercise(exercise, best.weightKg, best.reps) : null;
    const currentProgression = currentRank ? progressionForScore(currentRank.percentile, exercise, best) : null;
    let currentScore = currentProgression ? currentProgression.percentile : 0;
    if (state.settings.progression === "training" && officialRecord) {
      currentScore = exerciseRecordAchieved(exercise, best) ? 99 : Math.min(currentScore, 97);
    }
    let currentIndex = -1;
    steps.forEach(function (step, index) { if (currentScore >= step.at) currentIndex = index; });
    const nextIndex = steps.findIndex(function (step) { return step.at > currentScore; });
    return {
      title: state.settings.progression === "baki"
        ? "Baki character targets · parody only"
        : record ? "Road to the world record" : (scheme ? scheme.name : "Progression") + " targets",
      markup: steps.map(function (step, index) {
      const isOfficialWorldClass = state.settings.progression === "training" && step.title === "World class" && officialRecord;
      const targetRecord = record || (isOfficialWorldClass ? officialRecord : null);
      const recordValue = targetRecord ? (isBodyweight(exercise) ? Number(targetRecord.valueReps) : Number(targetRecord.valueKg)) : 0;
      const targetPercentile = progressionStepPercentile(step.at);
      const targetValue = state.settings.progression === "baki"
        ? bakiTargetValue(exercise, step.at)
        : targetRecord ? recordValue * (record && !isOfficialWorldClass ? targetPercentile / 99 : 1) : core.valueForPercentile(targetPercentile, comparisonStandards(exercise));
      let target = "Any valid set";
      if (state.settings.progression === "baki") {
        target = bakiTargetText(exercise, step.at);
      } else if (targetRecord && isBodyweight(exercise)) {
        const reps = Math.max(1, Math.ceil(targetValue));
        target = reps.toLocaleString("en-US") + " official consecutive reps";
      } else if (targetRecord) {
        target = displayExerciseWeight(exercise, targetValue, 1) + " " + exerciseLoadUnit(exercise) + " 1RM";
      } else if (isBodyweight(exercise)) {
        const reps = Math.max(1, Math.ceil(targetValue));
        target = reps + (reps === 1 ? " clean rep" : " clean reps");
      } else if (step.at > 1) {
        target = displayExerciseWeight(exercise, targetValue * state.profile.bodyWeightKg, 1) + " " + exerciseLoadUnit(exercise) + weightedTargetSuffix();
      }
      const classes = ["rank-ladder-row"];
      if (state.settings.progression === "baki") classes.push("baki-target");
      if (isOfficialWorldClass) classes.push("world-class");
      if (index < currentIndex) classes.push("reached");
      if (index === currentIndex) classes.push("current");
      if (index === nextIndex) classes.push("next");
      const marker = index < currentIndex ? "✓" : index === currentIndex ? "NOW" : index === nextIndex ? "NEXT" : String(index + 1);
      return '<div class="' + classes.join(" ") + '">' +
        '<span class="rank-ladder-marker">' + marker + '</span>' +
        '<span class="rank-ladder-name"><strong>' + escapeHtml(step.primary) + '</strong><small>' + escapeHtml(step.title) + ' · ' + formatPoints(progressionPoints(progressionStepPercentile(step.at))) + '</small></span>' +
        '<em>' + escapeHtml(target) + '</em></div>';
      }).join("")
    };
  }

  function renderLiftRankLadder(exercise) {
    const ladder = rankLadderDetails(exercise);
    el.liftRankLadderTitle.textContent = ladder.title;
    el.liftRankLadder.innerHTML = ladder.markup;
  }

  function renderWorldRecordCard(exercise) {
    if (!el.worldRecordCard) return;
    const status = window.FossWorldRecords
      ? window.FossWorldRecords.status(exercise.id, state.profile.standard)
      : { standardized: false, reason: "World-record data is unavailable." };
    el.worldRecordCard.classList.toggle("unavailable", !status.standardized);
    if (!status.standardized) {
      el.worldRecordLabel.textContent = "WORLD RECORD STATUS";
      el.worldRecordValue.textContent = "Not standardized";
      el.worldRecordCopy.textContent = status.reason;
      return;
    }
    const record = status.record;
    el.worldRecordLabel.textContent = record.kind === "reps"
      ? "GUINNESS WORLD RECORD"
      : (state.profile.standard === "female" ? "WOMEN'S" : "MEN'S") + " OPEN CLASSIC WORLD RECORD";
    el.worldRecordValue.textContent = record.kind === "reps"
      ? Number(record.valueReps).toLocaleString("en-US") + " consecutive reps"
      : displayExerciseWeight(exercise, record.valueKg, 1) + " " + exerciseLoadUnit(exercise);
    el.worldRecordCopy.textContent = record.source.name + " · " + record.lift + " · updated " + (state.profile.standard === "female" ? record.source.womenUpdated : record.source.menUpdated) + (record.note ? " · " + record.note : "");
  }

  function updateLiveRank() {
    const exercise = exerciseById(activeExerciseId);
    const bodyweight = isBodyweight(exercise);
    const displayValue = Number(el.liftWeightInput.value);
    const reps = Math.round(Number(el.liftRepsInput.value));
    const weightKg = bodyweight ? 0 : exerciseWeightToKg(exercise, displayValue);
    const maxReps = exerciseMaxReps(exercise, 20);
    if (!exercise || (!bodyweight && !weightKg) || reps < 1 || reps > maxReps) {
      el.livePercentile.textContent = "--";
      el.percentileSuffix.textContent = "";
      el.liveTier.textContent = "Enter a set";
      el.liveOneRepMax.textContent = bodyweight ? "Your rep rank appears here." : "Your weight rank appears here.";
      el.liveRankCard.style.setProperty("--rank-color", "#94A098");
      return;
    }
    if (!bodyweight && weightedScoreMode() === "one_rep_max" && reps !== 1) {
      el.livePercentile.textContent = "SET";
      el.livePercentile.classList.remove("rank-long");
      el.livePercentile.classList.remove("rank-very-long");
      el.percentileSuffix.textContent = "";
      el.liveTier.textContent = "Saved set only";
      el.liveOneRepMax.textContent = "This set will be saved, but only 1 rep changes your 1RM high score or rank.";
      el.liveRankCard.style.setProperty("--rank-color", "#94A098");
      return;
    }
    const rank = rankForExercise(exercise, weightKg, reps);
    const displayRank = progressionForScore(rank.percentile, exercise, { weightKg: weightKg, reps: reps });
    const target = nextTargetForResult({ exercise: exercise, displayRank: displayRank });
    el.livePercentile.textContent = displayRank.primary;
    el.livePercentile.classList.toggle("rank-long", displayRank.primary.length > 5);
    el.livePercentile.classList.toggle("rank-very-long", displayRank.primary.length > 18);
    el.percentileSuffix.textContent = displayRank.detail;
    el.liveTier.textContent = displayRank.title + " · " + formatPoints(progressionPoints(rank.percentile)) + (state.settings.progression === "baki"
      ? " · parody only"
      : rank.record
        ? " · " + core.round(rank.recordRatio * 100, 1) + "% of world record"
        : " · " + core.ordinal(rank.percentile) + " percentile" + (rank.recordUnavailable ? " · training scale (no standardized record)" : ""));
    const resultText = bodyweight
      ? reps + (reps === 1 ? " clean rep" : " clean reps")
      : weightedScoreMode() === "estimated_one_rep_max"
        ? displayExerciseWeight(exercise, weightKg, 1) + " " + exerciseLoadUnit(exercise) + " x " + reps + " · Estimated " + displayExerciseWeight(exercise, weightedScoreWeightKg({ weightKg: weightKg, reps: reps }), 1) + " " + exerciseLoadUnit(exercise) + " 1RM · " + (rank.record ? core.round(rank.recordRatio * 100, 1) + "% of official record" : core.round(rank.ratio, 2) + "x body weight")
        : displayExerciseWeight(exercise, weightKg, 1) + " " + exerciseLoadUnit(exercise) + (weightedScoreMode() === "one_rep_max" ? " actual 1RM · " : " lifted · ") + (rank.record ? core.round(rank.recordRatio * 100, 1) + "% of official record" : core.round(rank.ratio, 2) + "x body weight");
    el.liveOneRepMax.textContent = target && displayRank.nextTitle
      ? resultText + " · Next: " + displayRank.nextTitle + " at " + target
      : resultText + " · Top rank reached";
    el.liveRankCard.style.setProperty("--rank-color", rank.color);
  }

  function saveLift() {
    const exercise = exerciseById(activeExerciseId);
    const bodyweight = isBodyweight(exercise);
    const weight = Number(el.liftWeightInput.value);
    const reps = Math.round(Number(el.liftRepsInput.value));
    if (!exercise || (!bodyweight && (!Number.isFinite(weight) || weight <= 0))) {
      showFeedbackBanner("Enter a weight greater than zero.", "error");
      return;
    }
    const maxReps = exerciseMaxReps(exercise, 20);
    if (!Number.isFinite(reps) || reps < 1 || reps > maxReps) {
      showFeedbackBanner("Enter between 1 and " + maxReps + " reps.", "error");
      return;
    }
    const weightKg = bodyweight ? 0 : exerciseWeightToKg(exercise, weight);
    const previousBest = bestLiftForExercise(exercise.id);
    const lift = {
      id: uid("lift"),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      weightKg: weightKg,
      reps: reps,
      source: "manual"
    };
    state.lifts.push(lift);
    saveState();
    renderAll();
    renderLiftModal(false);
    const qualifies = bodyweight || weightedLiftQualifies(lift);
    const newHigh = qualifies && (!previousBest || (bodyweight ? lift.reps > previousBest.reps : weightedScoreWeightKg(lift) > weightedScoreWeightKg(previousBest)));
    flashSavedScore(exercise.id);
    showFeedbackBanner(newHigh ? "New high score added to your history." : "Score added to your history.", "success");
    vibratePhone(45);
  }

  function highScoreResults() {
    return allExercises().map(function (exercise) {
      const lift = bestLiftForExercise(exercise.id);
      if (!lift) return null;
      const rank = rankForExercise(exercise, lift.weightKg, lift.reps);
      return { exercise: exercise, lift: lift, rank: rank, displayRank: progressionForScore(rank.percentile, exercise) };
    }).filter(Boolean).sort(function (a, b) { return b.rank.percentile - a.rank.percentile; });
  }

  function highScoreText(result) {
    if (!result) return "No score yet";
    return isBodyweight(result.exercise)
      ? result.lift.reps + (result.lift.reps === 1 ? " rep" : " reps")
      : displayWeightedScore(result.lift, 1);
  }

  function highScoreLabel(exercise) {
    if (isBodyweight(exercise)) return "HIGH SCORE";
    if (weightedScoreMode() === "one_rep_max") return "ACTUAL 1RM";
    if (weightedScoreMode() === "estimated_one_rep_max") return "ESTIMATED 1RM";
    return "HEAVIEST SET";
  }

  function recentHighScoreResults() {
    return highScoreResults().slice().sort(function (a, b) {
      return new Date(b.lift.date) - new Date(a.lift.date);
    });
  }

  function highScoreRowMarkup(result) {
    return '<button class="high-score-row" type="button" data-open-high-score="' + result.exercise.id + '">' +
      '<span class="mini-art">' + exerciseArtFor(result.exercise) + '</span>' +
      '<span class="high-score-name"><strong>' + escapeHtml(result.exercise.name) + '</strong><small>' + escapeHtml(exerciseGroupLabel(result.exercise)) + ' · ' + formatPoints(progressionPoints(result.rank.percentile)) + '</small></span>' +
      '<span class="high-score-value"><strong>' + escapeHtml(highScoreText(result)) + '</strong><small>' + escapeHtml(result.displayRank.shortLabel) + '</small></span></button>';
  }

  function highScoreListMarkup(results, emptyText) {
    return results.length
      ? results.map(highScoreRowMarkup).join("")
      : '<div class="empty-high-scores"><strong>No high scores yet</strong><p>' + escapeHtml(emptyText) + '</p></div>';
  }

  function formatRestTime(seconds) {
    return String(Math.max(0, Math.ceil(Number(seconds) || 0)));
  }

  function cooldownPosition() {
    return ["top-left", "top-right", "bottom-left", "bottom-right"].includes(state.settings.cooldownTimerPosition)
      ? state.settings.cooldownTimerPosition
      : "bottom-right";
  }

  function cooldownBounds() {
    const shell = document.querySelector(".app-shell");
    const shellRect = shell ? shell.getBoundingClientRect() : null;
    const shellHasSize = shellRect && shellRect.width > 0;
    return {
      left: shellHasSize ? Math.max(8, shellRect.left + 10) : 10,
      right: shellHasSize ? Math.min(window.innerWidth - 8, shellRect.right - 10) : window.innerWidth - 10,
      top: 78,
      bottom: window.innerHeight - 86
    };
  }

  function applyCooldownPlacement() {
    if (!el.cooldownDock) return;
    ["top-left", "top-right", "bottom-left", "bottom-right"].forEach(function (position) {
      el.cooldownDock.classList.remove("timer-position-" + position);
    });
    if (!cooldownDragging) {
      el.cooldownDock.style.removeProperty("left");
      el.cooldownDock.style.removeProperty("right");
      el.cooldownDock.style.removeProperty("top");
      el.cooldownDock.style.removeProperty("bottom");
      el.cooldownDock.classList.add("timer-position-" + cooldownPosition());
    }
    el.cooldownDock.classList.toggle("positioning", cooldownPositioning);
    el.cooldownDock.classList.toggle("dragging", cooldownDragging);
    const liftVisible = Boolean(el.liftModal && el.liftModal.classList.contains("open"));
    const anotherModalOpen = Array.from(document.querySelectorAll(".modal.open")).some(function (modal) { return modal.id !== "liftModal"; });
    const workoutVisible = currentTab === "workouts" && Boolean(selectedPlanId);
    const contextVisible = !anotherModalOpen && (workoutVisible || liftVisible);
    el.cooldownDock.classList.toggle("exercise-page-timer", liftVisible && !anotherModalOpen);
    el.cooldownDock.classList.toggle("timer-context-hidden", !contextVisible);
    el.cooldownDock.classList.toggle("timer-hidden", state.settings.cooldownTimerVisible === false);
    if (el.cooldownEditControls) el.cooldownEditControls.setAttribute("aria-hidden", String(!cooldownPositioning));
    if (el.showCooldownTimer) {
      el.showCooldownTimer.classList.toggle("active", state.settings.cooldownTimerVisible !== false);
      el.showCooldownTimer.setAttribute("aria-pressed", String(state.settings.cooldownTimerVisible !== false));
      el.showCooldownTimer.setAttribute("aria-label", state.settings.cooldownTimerVisible === false ? "Show cooldown timer" : "Hide cooldown timer");
    }
    if (el.liftCooldownButton) {
      el.liftCooldownButton.classList.toggle("active", state.settings.cooldownTimerVisible !== false);
      el.liftCooldownButton.setAttribute("aria-pressed", String(state.settings.cooldownTimerVisible !== false));
      el.liftCooldownButton.setAttribute("aria-label", state.settings.cooldownTimerVisible === false ? "Show cooldown timer" : "Hide cooldown timer");
    }
  }

  function scheduleCooldownStationary() {
    clearTimeout(cooldownIdleTimer);
    if (!cooldownPositioning) return;
    cooldownIdleTimer = setTimeout(function () {
      cooldownPositioning = false;
      cooldownDragging = false;
      suppressCooldownClick = false;
      applyCooldownPlacement();
    }, 5000);
  }

  function enterCooldownPositioning() {
    if (state.settings.cooldownTimerVisible === false) return;
    cooldownPositioning = true;
    suppressCooldownClick = true;
    applyCooldownPlacement();
    if (!cooldownDragging) scheduleCooldownStationary();
    vibratePhone(18);
  }

  function cancelCooldownHold() {
    if (cooldownHoldTimer) clearTimeout(cooldownHoldTimer);
    cooldownHoldTimer = null;
  }

  function startCooldownPointer(event) {
    if (event.button != null && event.button !== 0) return;
    cancelCooldownHold();
    clearTimeout(cooldownIdleTimer);
    cooldownPointerId = event.pointerId == null ? 1 : event.pointerId;
    const bounds = el.cooldownDock.getBoundingClientRect();
    const limits = cooldownBounds();
    const width = el.cooldownDock.offsetWidth || 138;
    const height = el.cooldownDock.offsetHeight || 138;
    cooldownPointerStartX = Number(event.clientX) || bounds.left + width / 2;
    cooldownPointerStartY = Number(event.clientY) || bounds.top + height / 2;
    cooldownDockStartLeft = bounds.width > 0
      ? bounds.left
      : cooldownPosition().endsWith("right") ? limits.right - width : limits.left;
    cooldownDockStartTop = bounds.height > 0
      ? bounds.top
      : cooldownPosition().startsWith("bottom") ? limits.bottom - height : limits.top;
    el.cooldownDock.dataset.lastPointerX = String(cooldownPointerStartX);
    el.cooldownDock.dataset.lastPointerY = String(cooldownPointerStartY);
    if (el.restTimerToggle.setPointerCapture && event.pointerId != null) {
      try { el.restTimerToggle.setPointerCapture(event.pointerId); } catch (error) {}
    }
    if (cooldownPositioning) {
      cooldownDragging = false;
      suppressCooldownClick = true;
      applyCooldownPlacement();
      return;
    }
    cooldownHoldTimer = setTimeout(function () {
      cooldownDragging = false;
      enterCooldownPositioning();
    }, 500);
  }

  function moveCooldownPointer(event) {
    if (event.pointerId != null && cooldownPointerId != null && event.pointerId !== cooldownPointerId) return;
    const x = Number(event.clientX) || Number(el.cooldownDock.dataset.lastPointerX) || cooldownPointerStartX;
    const y = Number(event.clientY) || Number(el.cooldownDock.dataset.lastPointerY) || cooldownPointerStartY;
    const deltaX = x - cooldownPointerStartX;
    const deltaY = y - cooldownPointerStartY;
    if (!cooldownPositioning) {
      if (Math.hypot(deltaX, deltaY) > 12) cancelCooldownHold();
      return;
    }
    if (!cooldownDragging) {
      if (Math.hypot(deltaX, deltaY) <= 10) return;
      cooldownDragging = true;
      el.cooldownDock.style.left = cooldownDockStartLeft + "px";
      el.cooldownDock.style.top = cooldownDockStartTop + "px";
      el.cooldownDock.style.right = "auto";
      el.cooldownDock.style.bottom = "auto";
      applyCooldownPlacement();
    }
    event.preventDefault();
    const width = el.cooldownDock.offsetWidth || 138;
    const height = el.cooldownDock.offsetHeight || 138;
    const limits = cooldownBounds();
    const maxLeft = Math.max(limits.left, limits.right - width);
    const maxTop = Math.max(limits.top, limits.bottom - height);
    el.cooldownDock.dataset.lastPointerX = String(x);
    el.cooldownDock.dataset.lastPointerY = String(y);
    el.cooldownDock.style.left = core.clamp(cooldownDockStartLeft + deltaX, limits.left, maxLeft) + "px";
    el.cooldownDock.style.top = core.clamp(cooldownDockStartTop + deltaY, limits.top, maxTop) + "px";
    el.cooldownDock.style.right = "auto";
    el.cooldownDock.style.bottom = "auto";
  }

  function finishCooldownPointer(event) {
    cancelCooldownHold();
    if (el.restTimerToggle.releasePointerCapture && event && event.pointerId != null) {
      try { el.restTimerToggle.releasePointerCapture(event.pointerId); } catch (error) {}
    }
    if (!cooldownPositioning || !cooldownDragging) {
      cooldownPointerId = null;
      if (cooldownPositioning) scheduleCooldownStationary();
      return;
    }
    const dockRect = el.cooldownDock.getBoundingClientRect();
    const limits = cooldownBounds();
    const width = dockRect.width || el.cooldownDock.offsetWidth || 138;
    const height = dockRect.height || el.cooldownDock.offsetHeight || 138;
    const fallbackX = Number(event && event.clientX) || Number(el.cooldownDock.dataset.lastPointerX) || limits.right;
    const fallbackY = Number(event && event.clientY) || Number(el.cooldownDock.dataset.lastPointerY) || limits.bottom;
    const centerX = dockRect.width > 0 ? dockRect.left + width / 2 : fallbackX;
    const centerY = dockRect.height > 0 ? dockRect.top + height / 2 : fallbackY;
    state.settings.cooldownTimerPosition = (centerY < (limits.top + limits.bottom) / 2 ? "top" : "bottom") + "-" + (centerX < (limits.left + limits.right) / 2 ? "left" : "right");
    cooldownDragging = false;
    cooldownPointerId = null;
    saveState();
    applyCooldownPlacement();
    scheduleCooldownStationary();
  }

  function hideCooldownTimer() {
    cancelCooldownHold();
    clearTimeout(cooldownIdleTimer);
    cooldownDragging = false;
    cooldownPositioning = false;
    suppressCooldownClick = false;
    state.settings.cooldownTimerVisible = false;
    resetRestTimer();
    saveState();
    applyCooldownPlacement();
  }

  function showCooldownTimer() {
    suppressCooldownClick = false;
    state.settings.cooldownTimerVisible = true;
    saveState();
    applyCooldownPlacement();
  }

  function toggleCooldownVisibility() {
    if (state.settings.cooldownTimerVisible === false) showCooldownTimer();
    else hideCooldownTimer();
  }

  function renderRestTimer() {
    if (!el.restTimerDisplay) return;
    el.restTimerDisplay.textContent = formatRestTime(restRemaining);
    el.restTimerDisplay.classList.toggle("finished", restRemaining === 0 && !restIsRunning);
    el.restTimerToggle.classList.toggle("running", restIsRunning);
    el.restTimerToggle.setAttribute("aria-pressed", String(restIsRunning));
    el.restTimerStatus.textContent = restIsRunning
      ? "TAP TO RESET"
      : restRemaining === 0
        ? "TAP TO RESTART"
        : "TAP TO START";
    el.restTimerToggle.setAttribute("aria-label", restIsRunning
      ? "Reset cooldown timer to " + restDuration + " seconds"
      : restRemaining === 0
        ? "Restart " + restDuration + " second cooldown timer"
        : "Start " + restRemaining + " second cooldown timer");
    setSegment(el.cooldownTimerSetting, String(restDuration));
    if (el.cooldownEditControls) {
      el.cooldownEditControls.querySelectorAll("[data-cooldown-seconds]").forEach(function (button) {
        button.classList.toggle("active", Number(button.dataset.cooldownSeconds) === restDuration);
      });
    }
    applyCooldownPlacement();
  }

  function stopRestInterval() {
    if (restTimerId) clearInterval(restTimerId);
    restTimerId = null;
  }

  function nativeTimerAvailable() {
    return Boolean(window.FossTimer && typeof window.FossTimer.start === "function");
  }

  function tickRestTimer() {
    restRemaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000));
    if (restRemaining === 0) {
      stopRestInterval();
      restIsRunning = false;
      vibratePhone([180, 120, 180, 120, 180]);
    }
    renderRestTimer();
  }

  function setRestDuration(seconds) {
    stopRestInterval();
    restIsRunning = false;
    restDuration = core.clamp(Math.round(Number(seconds) || 60), 30, 90);
    restRemaining = restDuration;
    state.settings.restSeconds = restDuration;
    if (nativeTimerAvailable() && typeof window.FossTimer.stop === "function") window.FossTimer.stop(restDuration);
    saveState();
    renderRestTimer();
  }

  function toggleRestTimer() {
    if (restIsRunning) {
      resetRestTimer();
      return;
    }
    if (restRemaining <= 0) restRemaining = restDuration;
    restEndsAt = Date.now() + restRemaining * 1000;
    restIsRunning = true;
    stopRestInterval();
    if (nativeTimerAvailable()) window.FossTimer.start(restRemaining);
    else restTimerId = setInterval(tickRestTimer, 250);
    renderRestTimer();
  }

  function resetRestTimer(skipNative) {
    stopRestInterval();
    restIsRunning = false;
    restRemaining = restDuration;
    if (!skipNative && nativeTimerAvailable() && typeof window.FossTimer.stop === "function") window.FossTimer.stop(restDuration);
    renderRestTimer();
  }

  window.FossGymTimer = {
    nativeTick: function (remaining, running) {
      const cleanRemaining = Math.max(0, Math.ceil(Number(remaining) || 0));
      restRemaining = cleanRemaining;
      restIsRunning = Boolean(running);
      if (restIsRunning) restEndsAt = Date.now() + cleanRemaining * 1000;
      renderRestTimer();
    },
    resetFromNative: function () {
      restRemaining = restDuration;
      restIsRunning = true;
      restEndsAt = Date.now() + restDuration * 1000;
      renderRestTimer();
    }
  };

  function restoreNativeTimerState() {
    if (!nativeTimerAvailable()) return;
    try {
      const nativeDuration = Number(window.FossTimer.durationSeconds());
      const nativeRemaining = Number(window.FossTimer.remainingSeconds());
      if ([30, 60, 90].includes(nativeDuration)) restDuration = nativeDuration;
      restRemaining = Number.isFinite(nativeRemaining) && nativeRemaining >= 0 ? nativeRemaining : restDuration;
      restIsRunning = Boolean(window.FossTimer.isRunning());
      if (restIsRunning) restEndsAt = Date.now() + restRemaining * 1000;
    } catch (error) {}
  }

  function renderWorkouts() {
    const scores = highScoreResults();
    const recentScores = recentHighScoreResults();
    const selected = state.plans.find(function (plan) { return plan.id === selectedPlanId; }) || null;
    const filteredPlans = state.plans.filter(planMatchesLibraryFilters);
    if (selectedPlanId && !selected) selectedPlanId = null;
    const showingAllScores = workoutHighScoresOpen && !selected;
    const filtersActive = workoutLibraryFilter !== "all" || workoutGroupFilter !== "all";
    el.planCount.textContent = filtersActive
      ? filteredPlans.length + " / " + state.plans.length
      : state.plans.length + (state.plans.length === 1 ? " plan" : " plans");
    el.workoutFilterStrip.querySelectorAll("[data-workout-filter]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.workoutFilter === workoutLibraryFilter);
    });
    el.workoutGroupFilter.innerHTML = groupFilterOptions(workoutGroupFilter);
    el.workoutOverview.classList.toggle("hidden", Boolean(selected) || showingAllScores);
    el.workoutDetail.classList.toggle("hidden", !selected);
    el.workoutsPage.classList.toggle("workout-selected", Boolean(selected));
    el.workoutHighScoresPage.classList.toggle("hidden", !showingAllScores);
    el.newPlanButton.classList.toggle("hidden", showingAllScores);
    el.newPlanButton.textContent = selected ? "Edit" : "+ Build";
    el.newPlanButton.setAttribute("aria-label", selected ? "Edit " + selected.name : "Build a workout");
    el.workoutsPageEyebrow.textContent = selected ? "CURRENT WORKOUT" : showingAllScores ? "YOUR RECORDS" : "YOUR TRAINING";
    el.workoutsPageTitle.textContent = selected ? selected.name : showingAllScores ? "Exercise high scores" : "Workouts";

    if (!state.plans.length) {
      el.planList.innerHTML = '<div class="empty-plans"><strong>No workout plans</strong><p>Build one and it will appear here. Deleted plans stay deleted.</p><button class="start-plan-button" type="button" data-build-empty-plan>Build a workout</button></div>';
    } else if (!filteredPlans.length) {
      el.planList.innerHTML = '<div class="empty-plans"><strong>No matching workouts</strong><p>Change a filter or build a workout that matches it.</p></div>';
    } else {
      el.planList.innerHTML = filteredPlans.map(function (plan) {
        const availableCount = planExercises(plan).filter(function (exercise) { return exerciseAvailableAtLocation(exercise); }).length;
        return '<article class="plan-choice-card ' + (state.settings.showExerciseTags ? "with-tags" : "") + '">' +
          '<button class="plan-choice-main" type="button" data-select-plan="' + escapeHtml(plan.id) + '">' +
          '<span class="plan-choice-icon">' + planIconArt(plan) + '</span>' +
          '<span><strong>' + escapeHtml(plan.name) + '</strong><small class="plan-availability">' + availableCount + ' of ' + plan.exercises.length + ' available at ' + escapeHtml(activeLocationName()) + '</small>' + planTagsMarkup(plan) + '</span>' +
          '<em>OPEN</em></button>' +
          '<button class="menu-button" type="button" data-edit-plan="' + escapeHtml(plan.id) + '" aria-label="Edit ' + escapeHtml(plan.name) + '">···</button>' +
          '</article>';
      }).join("");
    }

    if (selected) {
      el.selectedWorkoutIcon.innerHTML = planIconArt(selected);
      el.selectedWorkoutName.textContent = selected.name;
      el.selectedWorkoutMeta.textContent = weightedScoreMode() === "one_rep_max"
        ? "Only one-rep weighted sets change the actual 1RM. Every set still saves."
        : weightedScoreMode() === "estimated_one_rep_max"
          ? "Weight and reps calculate an estimated 1RM. Every set still saves."
          : "Enter one good set. It saves immediately.";
      const availableEntries = selected.exercises.filter(function (entry) {
        return exerciseAvailableAtLocation(exerciseById(entry.exerciseId));
      });
      const unavailableCount = selected.exercises.length - availableEntries.length;
      const locationNote = unavailableCount
        ? '<p class="workout-location-note">' + unavailableCount + (unavailableCount === 1 ? ' exercise is' : ' exercises are') + ' hidden because the required equipment is not listed at ' + escapeHtml(activeLocationName()) + '.</p>'
        : '';
      const availableCards = availableEntries.map(function (entry) {
        const exercise = exerciseById(entry.exerciseId);
        if (!exercise) return "";
        const bodyweight = isBodyweight(exercise);
        const result = scores.find(function (item) { return item.exercise.id === exercise.id; }) || null;
        const last = lastLiftForExercise(exercise.id);
        const suggestedWeight = !bodyweight && last ? displayExerciseWeight(exercise, last.weightKg, 1) : "";
        const highScore = result ? highScoreText(result) : "No score yet";
        return '<article class="quick-log-card" data-quick-exercise="' + exercise.id + '">' +
          '<div class="quick-log-heading"><button class="quick-exercise-link" type="button" data-open-exercise-detail="' + exercise.id + '" aria-label="Open ' + escapeHtml(exercise.name) + ' scores and targets"><span class="mini-art">' + exerciseArtFor(exercise) + '</span><span class="quick-log-name"><strong>' + escapeHtml(exercise.name) + '</strong><small>' + entry.sets + ' x ' + entry.reps + '</small></span></button>' +
          exerciseInfoButtonMarkup(exercise, "quick-exercise-info") +
          '<div class="quick-high-score"><span>' + highScoreLabel(exercise) + '</span><strong>' + escapeHtml(highScore) + '</strong></div></div>' +
          '<div class="quick-log-inputs ' + (bodyweight ? "bodyweight" : "") + '">' +
          (bodyweight ? "" : '<label><span>' + exerciseLoadUnit(exercise).toUpperCase() + '</span><input data-quick-weight type="number" inputmode="decimal" min="0" placeholder="Weight" value="' + suggestedWeight + '" /></label>') +
          '<label><span>REPS</span><input data-quick-reps type="number" inputmode="numeric" min="1" max="' + exerciseMaxReps(exercise, 20) + '" value="' + entry.reps + '" /></label>' +
          '<button type="button" data-save-quick-score="' + exercise.id + '">Save score</button></div>' +
          '</article>';
      }).join("");
      el.workoutLogger.innerHTML = locationNote + (availableCards || '<p class="plain-note">No exercises in this plan match the equipment at ' + escapeHtml(activeLocationName()) + '. Edit the plan or update this location.</p>');
    } else {
      el.workoutLogger.innerHTML = "";
    }

    el.workoutRecentScoreCount.textContent = recentScores.length ? "Latest " + Math.min(3, recentScores.length) : "No scores yet";
    el.workoutHighScores.innerHTML = highScoreListMarkup(recentScores.slice(0, 3), "Open a workout or tap a muscle card on the Strength screen.");
    el.workoutHighScoreCount.textContent = scores.length + (scores.length === 1 ? " score" : " scores");
    el.workoutAllHighScores.innerHTML = highScoreListMarkup(scores, "Save a set and it will appear here.");
    renderRestTimer();
  }

  function renderPlanIconPicker() {
    if (!editingPlan) return;
    el.planIconPicker.innerHTML = PLAN_ICONS.map(function (icon) {
      return '<button class="plan-icon-option ' + (editingPlan.icon === icon.id ? "active" : "") + '" type="button" data-plan-icon="' + icon.id + '"><span>' + exerciseArt(icon.motion) + '</span><small>' + escapeHtml(icon.name) + '</small></button>';
    }).join("") + '<button class="plan-icon-option draw-icon-option ' + (editingPlan.icon === "custom" ? "active" : "") + '" type="button" data-draw-plan-icon><span>' + drawnPlanIconArt(editingPlan.customIcon, editingPlan.customIconWidth) + '</span><small>' + (normalizeIconStrokes(editingPlan.customIcon, editingPlan.customIconWidth).length ? "Edit drawing" : "Draw yours") + '</small></button>';
  }

  function renderIconDrawing() {
    const canvas = el.iconDrawCanvas;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#B9F64A";
    context.lineCap = "round";
    context.lineJoin = "round";
    iconDrawingStrokes.forEach(function (stroke) {
      if (!stroke.points.length) return;
      context.lineWidth = stroke.width * canvas.width / 100;
      context.beginPath();
      context.moveTo(stroke.points[0].x * canvas.width / 100, stroke.points[0].y * canvas.height / 100);
      stroke.points.slice(1).forEach(function (point) {
        context.lineTo(point.x * canvas.width / 100, point.y * canvas.height / 100);
      });
      context.stroke();
    });
    if (activeIconEraserPoint) {
      context.beginPath();
      context.strokeStyle = "rgba(255, 255, 255, 0.9)";
      context.lineWidth = 2;
      context.arc(activeIconEraserPoint.x * canvas.width / 100, activeIconEraserPoint.y * canvas.height / 100, normalizeIconWidth(iconDrawingStrokeWidth) * canvas.width / 200, 0, Math.PI * 2);
      context.stroke();
    }
    el.undoIconStrokeButton.disabled = !iconDrawingUndoStack.length;
    el.redoIconStrokeButton.disabled = !iconDrawingRedoStack.length;
    el.iconStrokeWidth.value = String(normalizeIconWidth(iconDrawingStrokeWidth));
    el.iconStrokeWidthValue.value = String(normalizeIconWidth(iconDrawingStrokeWidth));
  }

  function cloneIconStrokes(strokes, fallbackWidth) {
    return normalizeIconStrokes(strokes, fallbackWidth).map(function (stroke) {
      return {
        width: stroke.width,
        points: stroke.points.map(function (point) { return { x: point.x, y: point.y }; })
      };
    });
  }

  function rememberIconDrawingState() {
    iconDrawingUndoStack.push(cloneIconStrokes(iconDrawingStrokes));
    if (iconDrawingUndoStack.length > 30) iconDrawingUndoStack.shift();
    iconDrawingRedoStack = [];
  }

  function setIconDrawingTool(tool) {
    iconDrawingTool = tool === "erase" ? "erase" : "draw";
    el.eraseIconToolButton.classList.toggle("active", iconDrawingTool === "erase");
    el.eraseIconToolButton.setAttribute("aria-pressed", String(iconDrawingTool === "erase"));
    el.eraseIconToolButton.setAttribute("aria-label", iconDrawingTool === "erase" ? "Turn eraser off" : "Turn eraser on");
  }

  function appendInterpolatedIconPoints(stroke, point) {
    if (!stroke || !stroke.points.length || stroke.points.length >= 360) return;
    const previous = stroke.points[stroke.points.length - 1];
    const deltaX = point.x - previous.x;
    const deltaY = point.y - previous.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance < 0.35) return;
    const steps = Math.max(1, Math.ceil(distance / 1.2));
    for (let index = 1; index <= steps && stroke.points.length < 360; index += 1) {
      stroke.points.push({
        x: core.round(previous.x + deltaX * index / steps, 2),
        y: core.round(previous.y + deltaY * index / steps, 2)
      });
    }
  }

  function densifyIconStroke(stroke) {
    const clean = normalizeIconStrokes([stroke])[0] || [];
    if (!clean.points || !clean.points.length) return { width: 4, points: [] };
    const dense = { width: clean.width, points: [clean.points[0]] };
    clean.points.slice(1).forEach(function (point) { appendInterpolatedIconPoints(dense, point); });
    return dense;
  }

  function eraseIconArea(point) {
    const eraserRadius = normalizeIconWidth(iconDrawingStrokeWidth) / 2;
    const remaining = [];
    iconDrawingStrokes.forEach(function (stroke) {
      const dense = densifyIconStroke(stroke);
      let segment = [];
      dense.points.forEach(function (candidate) {
        const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
        if (distance <= eraserRadius + dense.width / 2) {
          if (segment.length >= 2) remaining.push({ width: dense.width, points: segment });
          segment = [];
        } else {
          segment.push(candidate);
        }
      });
      if (segment.length >= 2) remaining.push({ width: dense.width, points: segment });
    });
    iconDrawingStrokes = normalizeIconStrokes(remaining);
  }

  function iconPointFromEvent(event) {
    const rect = el.iconDrawCanvas.getBoundingClientRect();
    if (!(rect.width > 0) || !(rect.height > 0)) return null;
    return {
      x: core.round(core.clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100, 2),
      y: core.round(core.clamp((event.clientY - rect.top) / rect.height, 0, 1) * 100, 2)
    };
  }

  function openIconDrawing(target) {
    iconDrawingTarget = target === "exercise" ? "exercise" : target === "app" ? "app" : "plan";
    if (iconDrawingTarget === "plan" && !editingPlan) return;
    const source = iconDrawingTarget === "exercise"
      ? customExerciseIconStrokes
      : iconDrawingTarget === "app"
        ? state.settings.customAppMark
        : editingPlan.customIcon;
    const sourceWidth = iconDrawingTarget === "exercise"
      ? customExerciseIconWidth
      : iconDrawingTarget === "app"
        ? state.settings.customAppMarkWidth
        : editingPlan.customIconWidth;
    iconDrawingStrokes = cloneIconStrokes(source, sourceWidth);
    iconDrawingStrokeWidth = normalizeIconWidth(sourceWidth);
    activeIconStroke = null;
    iconDrawingActive = false;
    activeIconEraserPoint = null;
    activeIconDrawingTool = "draw";
    iconDrawingUndoStack = [];
    iconDrawingRedoStack = [];
    el.iconDrawEyebrow.textContent = iconDrawingTarget === "exercise" ? "EXERCISE ICON" : iconDrawingTarget === "app" ? "APP MARK" : "WORKOUT ICON";
    el.iconDrawTitle.textContent = iconDrawingTarget === "exercise" ? "Draw exercise icon" : iconDrawingTarget === "app" ? "Draw app mark" : "Draw workout icon";
    el.iconDrawCanvas.setAttribute("aria-label", iconDrawingTarget === "exercise" ? "Exercise icon drawing area" : iconDrawingTarget === "app" ? "App mark drawing area" : "Workout icon drawing area");
    setIconDrawingTool("draw");
    openModal("iconDrawModal");
    renderIconDrawing();
  }

  function saveIconDrawing() {
    const clean = normalizeIconStrokes(iconDrawingStrokes, iconDrawingStrokeWidth);
    if (!clean.length) {
      showToast("Draw at least one line first.");
      return;
    }
    if (iconDrawingTarget === "exercise") {
      customExerciseIconStrokes = clean;
      customExerciseIconWidth = normalizeIconWidth(iconDrawingStrokeWidth);
      customExerciseMotion = "custom";
      renderCustomExerciseIconPicker();
    } else if (iconDrawingTarget === "app") {
      state.settings.customAppMark = clean;
      state.settings.customAppMarkWidth = normalizeIconWidth(iconDrawingStrokeWidth);
      state.settings.logo = "custom";
      saveState();
      renderAll();
    } else {
      if (!editingPlan) return;
      editingPlan.customIcon = clean;
      editingPlan.customIconWidth = normalizeIconWidth(iconDrawingStrokeWidth);
      editingPlan.icon = "custom";
      renderPlanIconPicker();
    }
    closeModal("iconDrawModal");
    showToast(iconDrawingTarget === "exercise" ? "Custom exercise icon saved." : iconDrawingTarget === "app" ? "Custom app mark saved." : "Custom workout icon saved.");
  }

  function openPlanEditor(planId) {
    const existing = state.plans.find(function (plan) { return plan.id === planId; });
    editingPlan = existing
      ? JSON.parse(JSON.stringify(existing))
      : { id: null, name: "", icon: "full-body", customIcon: [], customIconWidth: 4, exercises: [] };
    editingPlan.customIcon = normalizeIconStrokes(editingPlan.customIcon, editingPlan.customIconWidth);
    editingPlan.customIconWidth = normalizeIconWidth(editingPlan.customIconWidth);
    el.planModalTitle.textContent = existing ? "Edit plan" : "Build a plan";
    el.planNameInput.value = editingPlan.name;
    el.deletePlanButton.classList.toggle("hidden", !existing);
    renderPlanIconPicker();
    renderPlanEditor();
    planEditorBaseline = planEditorSnapshot();
    openModal("planModal");
  }

  function planEditorSnapshot() {
    if (!editingPlan) return "";
    const snapshot = JSON.parse(JSON.stringify(editingPlan));
    if (el.planNameInput) snapshot.name = el.planNameInput.value;
    snapshot.customIcon = normalizeIconStrokes(snapshot.customIcon, snapshot.customIconWidth);
    snapshot.customIconWidth = normalizeIconWidth(snapshot.customIconWidth);
    return JSON.stringify(snapshot);
  }

  function planEditorHasUnsavedChanges() {
    return Boolean(editingPlan && planEditorBaseline !== null && planEditorSnapshot() !== planEditorBaseline);
  }

  function discardPlanEditor() {
    closeModal("planModal");
    editingPlan = null;
    planEditorBaseline = null;
  }

  function requestClosePlanEditor() {
    if (!editingPlan || !planEditorHasUnsavedChanges()) {
      discardPlanEditor();
      return;
    }
    askConfirm({
      title: "Exit workout builder?",
      message: "Your progress will not be saved.",
      cancel: "Keep building",
      button: "Exit"
    }, discardPlanEditor);
  }

  function renderPlanEditor() {
    if (!editingPlan) return;
    if (!editingPlan.exercises.length) {
      el.planEditorList.innerHTML = '<p class="plain-note">Add your first exercise. Each one starts at 3 sets of 8.</p>';
      return;
    }
    el.planEditorList.innerHTML = editingPlan.exercises.map(function (entry, index) {
      const exercise = exerciseById(entry.exerciseId);
      if (!exercise) return "";
      return '<div class="plan-editor-row" data-plan-row="' + index + '">' +
        '<span class="mini-art">' + exerciseArtFor(exercise) + '</span>' +
        '<div class="editor-exercise-name"><strong>' + escapeHtml(exercise.name) + '</strong><small>' + escapeHtml(exerciseGroupLabel(exercise)) + '</small></div>' +
        exerciseInfoButtonMarkup(exercise, "plan-exercise-info") +
        '<label class="editor-number-field"><input class="editor-number" data-editor-field="sets" data-index="' + index + '" type="number" inputmode="numeric" min="1" max="10" value="' + Number(entry.sets || 3) + '" aria-label="Sets" /><span>Sets</span></label>' +
        '<span class="times-mark">×</span>' +
        '<label class="editor-number-field"><input class="editor-number" data-editor-field="reps" data-index="' + index + '" type="number" inputmode="numeric" min="1" max="' + exerciseMaxReps(exercise, 30) + '" value="' + Number(entry.reps || 8) + '" aria-label="Reps" /><span>Reps</span></label>' +
        '<button class="remove-exercise" type="button" data-remove-exercise="' + index + '" aria-label="Remove ' + escapeHtml(exercise.name) + '">×</button>' +
        '</div>';
    }).join("");
  }

  function savePlan() {
    if (!editingPlan) return;
    const name = el.planNameInput.value.trim();
    if (!name) {
      showToast("Give your workout a name.");
      return;
    }
    if (!editingPlan.exercises.length) {
      showToast("Add at least one exercise.");
      return;
    }
    editingPlan.name = name;
    editingPlan.customIcon = normalizeIconStrokes(editingPlan.customIcon, editingPlan.customIconWidth);
    editingPlan.customIconWidth = normalizeIconWidth(editingPlan.customIconWidth);
    if (editingPlan.icon === "custom" && !editingPlan.customIcon.length) editingPlan.icon = "full-body";
    editingPlan.exercises = editingPlan.exercises.map(function (entry) {
      return {
        exerciseId: entry.exerciseId,
        sets: core.clamp(Math.round(Number(entry.sets) || 3), 1, 10),
        reps: core.clamp(Math.round(Number(entry.reps) || 8), 1, exerciseMaxReps(exerciseById(entry.exerciseId), 30)),
        weightKg: Number(entry.weightKg) > 0 ? Number(entry.weightKg) : null
      };
    });
    if (editingPlan.id) {
      const index = state.plans.findIndex(function (plan) { return plan.id === editingPlan.id; });
      state.plans[index] = editingPlan;
    } else {
      editingPlan.id = uid("plan");
      state.plans.push(editingPlan);
    }
    selectedPlanId = editingPlan.id;
    saveState();
    renderWorkouts();
    closeModal("planModal");
    editingPlan = null;
    planEditorBaseline = null;
    showToast("Workout plan saved.");
  }

  function deleteEditingPlan() {
    if (!editingPlan || !editingPlan.id) return;
    askConfirm({
      title: "Delete this plan?",
      message: "The plan will be removed. Your exercise high scores will stay.",
      button: "Delete"
    }, function () {
      state.plans = state.plans.filter(function (plan) { return plan.id !== editingPlan.id; });
      if (selectedPlanId === editingPlan.id) selectedPlanId = null;
      saveState();
      renderWorkouts();
      closeModal("planModal");
      editingPlan = null;
      planEditorBaseline = null;
      showToast("Workout plan deleted.");
    });
  }

  function renderExercisePicker(query) {
    const needle = String(query || "").trim().toLowerCase();
    el.exerciseFilterStrip.querySelectorAll("[data-exercise-filter]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.exerciseFilter === exerciseLibraryFilter);
    });
    el.exerciseGroupFilter.innerHTML = groupFilterOptions(exerciseGroupFilter);
    const matches = allExercises().slice().sort(function (a, b) {
      const preferenceOrder = exercisePreferenceScore(a) - exercisePreferenceScore(b);
      if (preferenceOrder) return preferenceOrder;
      const groupOrder = GROUPS.findIndex(function (group) { return group.id === a.group; }) - GROUPS.findIndex(function (group) { return group.id === b.group; });
      return groupOrder || a.name.localeCompare(b.name);
    }).filter(function (exercise) {
      if (!exerciseAvailableAtLocation(exercise)) return false;
      if (exerciseGroupFilter !== "all" && !exerciseGroups(exercise).includes(exerciseGroupFilter)) return false;
      if (!exerciseMatchesLibraryFilter(exercise, exerciseLibraryFilter)) return false;
      return !needle || exercise.name.toLowerCase().includes(needle) || exerciseGroupNames(exercise).join(" ").toLowerCase().includes(needle) || exerciseEquipmentLabel(exercise).toLowerCase().includes(needle);
    });
    let currentGroup = "";
    el.exercisePickerList.innerHTML = matches.map(function (exercise) {
      let header = "";
      if (exercise.group !== currentGroup) {
        currentGroup = exercise.group;
        header = '<div class="picker-group-label">' + escapeHtml(groupById(exercise.group).name) + '</div>';
      }
      return header + '<div class="exercise-picker-row ' + (state.settings.showExerciseTags ? "with-tags" : "") + '" data-pick-exercise="' + exercise.id + '">' +
        '<span class="mini-art">' + exerciseArtFor(exercise) + '</span>' +
        '<span><strong>' + escapeHtml(exercise.name) + '</strong><small>Tracks ' + escapeHtml(exerciseGroupNames(exercise).join(", ").toLowerCase()) + '</small>' + exerciseTagsMarkup(exercise) + '</span>' +
        '<span class="picker-actions">' + exerciseInfoButtonMarkup(exercise, "picker-info") + '<button class="picker-plus" type="button" aria-label="Add ' + escapeHtml(exercise.name) + '">+</button></span></div>';
    }).join("") || '<p class="plain-note">No available exercises found for ' + escapeHtml(activeLocationName()) + '. Change location or update its equipment.</p>';
  }

  function saveQuickScore(exerciseId, card) {
    const exercise = exerciseById(exerciseId);
    if (!exercise || !card) return;
    const bodyweight = isBodyweight(exercise);
    const repsInput = card.querySelector("[data-quick-reps]");
    const weightInput = card.querySelector("[data-quick-weight]");
    const reps = Math.round(Number(repsInput && repsInput.value));
    const displayValue = bodyweight ? 0 : Number(weightInput && weightInput.value);
    if (!Number.isFinite(reps) || reps < 1 || reps > exerciseMaxReps(exercise, 20)) {
      showFeedbackBanner("Enter a valid rep count.", "error");
      return;
    }
    if (!bodyweight && (!Number.isFinite(displayValue) || displayValue <= 0)) {
      showFeedbackBanner("Enter a weight greater than zero.", "error");
      return;
    }
    const previousBest = bestLiftForExercise(exercise.id);
    const weightKg = bodyweight ? 0 : exerciseWeightToKg(exercise, displayValue);
    const lift = {
      id: uid("lift"),
      exerciseId: exercise.id,
      date: new Date().toISOString(),
      weightKg: weightKg,
      reps: reps,
      source: "quick"
    };
    state.lifts.push(lift);
    const plan = state.plans.find(function (item) { return item.id === selectedPlanId; });
    const planEntry = plan && plan.exercises.find(function (entry) { return entry.exerciseId === exercise.id; });
    if (planEntry && !bodyweight) planEntry.weightKg = weightKg;
    saveState();
    renderAll();
    const qualifies = bodyweight || weightedLiftQualifies(lift);
    const newHigh = qualifies && (!previousBest || (bodyweight ? lift.reps > previousBest.reps : weightedScoreWeightKg(lift) > weightedScoreWeightKg(previousBest)));
    flashSavedScore(exercise.id);
    showFeedbackBanner(newHigh ? "New high score added to your history." : "Score added to your history.", "success");
    vibratePhone(45);
  }

  function latestMeasurement() {
    return state.measurements.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); })[0] || null;
  }

  function measurementSnapshot() {
    const snapshot = {};
    state.measurements.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); }).forEach(function (entry) {
      Object.keys(entry).forEach(function (key) {
        if (key === "id" || key === "date") return;
        if (key === "bodyFatSource") {
          snapshot[key] = entry[key];
          return;
        }
        if (Number(entry[key]) > 0) snapshot[key] = Number(entry[key]);
      });
    });
    if (!(Number(snapshot.weightKg) > 0)) snapshot.weightKg = state.profile.bodyWeightKg;
    if (!(Number(snapshot.heightCm) > 0)) snapshot.heightCm = state.profile.heightCm;
    return snapshot;
  }

  function weightMeasurements() {
    return state.measurements
      .filter(function (item) { return Number(item.weightKg) > 0; })
      .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  }

  function measurementDefinitions() {
    return [{ key: "weightKg", label: "Body weight", kind: "weight" }].concat(MEASUREMENTS);
  }

  function measurementInstruction(key) {
    return MEASUREMENT_GUIDES[key] ? MEASUREMENT_GUIDES[key].copy : "Use the same method every time.";
  }

  function measurementValueText(definition, value) {
    if (!(Number(value) > 0)) return "--";
    if (definition.kind === "weight") return displayWeight(value, 1) + " " + loadUnit();
    if (definition.kind === "length") return displayLength(value, 1) + " " + lengthUnit();
    return core.round(value, 1) + "%";
  }

  function measurementHistoryMarkup(entries) {
    if (!entries.length) return '<p class="measurement-history-empty">No measurement entries yet.</p>';
    return entries.map(function (entry) {
      const values = measurementDefinitions().filter(function (definition) {
        return Number(entry[definition.key]) > 0;
      }).map(function (definition) {
        return '<span><b>' + escapeHtml(definition.label) + '</b>' + escapeHtml(measurementValueText(definition, entry[definition.key])) + '</span>';
      }).join("");
      return '<article class="measurement-history-entry"><div class="measurement-history-entry-heading"><span><strong>' + escapeHtml(dateLabel(entry.date, true)) + '</strong><small>' + escapeHtml(timeLabel(entry.date)) + '</small></span>' +
        '<button type="button" data-edit-measurement-entry="' + escapeHtml(entry.id) + '">Edit</button></div><div class="measurement-history-values">' + values + '</div></article>';
    }).join("");
  }

  function renderMeasurementHistory() {
    const entries = state.measurements.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    el.measurementHistoryCount.textContent = entries.length + (entries.length === 1 ? " entry" : " entries");
    el.viewAllMeasurementsButton.classList.toggle("hidden", !entries.length);
    el.measurementHistoryPreview.innerHTML = measurementHistoryMarkup(entries.slice(0, 3));
    el.measurementHistoryList.innerHTML = measurementHistoryMarkup(entries);
  }

  function resultForGroupFromLifts(groupId, lifts) {
    let best = null;
    exercisesForGroup(groupId).forEach(function (exercise) {
      const candidates = lifts.filter(function (lift) {
        return lift.exerciseId === exercise.id && (isBodyweight(exercise) ? Number(lift.reps) > 0 : weightedLiftQualifies(lift));
      });
      candidates.forEach(function (lift) {
        const rank = rankForExercise(exercise, lift.weightKg, lift.reps);
        if (!best || rank.percentile > best.rank.percentile) best = { exercise: exercise, lift: lift, rank: rank };
      });
    });
    return best;
  }

  function overallScoreForLifts(lifts) {
    const scores = GROUPS.map(function (group) { return resultForGroupFromLifts(group.id, lifts); }).filter(Boolean);
    return overallScoreFromGroupResults(scores);
  }

  function strengthHistory() {
    const ordered = state.lifts.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    const observed = [];
    const points = [];
    ordered.forEach(function (lift) {
      observed.push(lift);
      const score = overallScoreForLifts(observed);
      if (!points.length || points[points.length - 1].value !== score) {
        points.push({ date: lift.date, value: score });
      }
    });
    return points.slice(-16);
  }

  function currentOverallScore() {
    const results = GROUPS.map(function (group) { return resultForGroup(group.id); }).filter(Boolean);
    return results.length ? core.round(results.reduce(function (sum, item) { return sum + item.rank.percentile; }, 0) / results.length, 1) : 0;
  }

  function widgetSnapshot() {
    const overall = currentOverallScore();
    const progression = overall ? progressionForScore(overall) : null;
    const tested = GROUPS.filter(function (group) { return resultForGroup(group.id); }).length;
    const measurements = measurementSnapshot();
    const bmi = core.calculateBMI(measurements.weightKg, measurements.heightCm);
    const tapeBodyFat = core.estimateTapeBodyFat(
      state.profile.standard,
      measurements.heightCm,
      measurements.waistCm,
      measurements.neckCm,
      measurements.hipCm
    );
    const bodyFat = Number(measurements.bodyFat) > 0 ? Number(measurements.bodyFat) : tapeBodyFat;
    const plans = state.plans.slice();
    if (selectedPlanId) {
      plans.sort(function (a, b) {
        if (a.id === selectedPlanId) return -1;
        if (b.id === selectedPlanId) return 1;
        return 0;
      });
    }
    return {
      title: normalizeAppTitle(state.settings.appTitle),
      rank: progression ? progression.primary : "--",
      rankTitle: progression ? progression.title : "Log a high score",
      points: formatPoints(progressionPoints(overall)),
      coverage: tested + " / " + GROUPS.length + " muscles tested",
      topScores: highScoreResults().slice(0, 3).map(function (result) {
        return {
          name: result.exercise.name,
          value: highScoreText(result),
          rank: result.displayRank.shortLabel
        };
      }),
      body: {
        weight: displayWeight(measurements.weightKg, 1) + " " + loadUnit(),
        bmi: bmi ? String(bmi) : "--",
        bodyFat: bodyFat ? core.round(bodyFat, 1) + "%" : "--"
      },
      plans: plans.map(function (plan) {
        return {
          id: String(plan.id),
          name: String(plan.name || "Workout"),
          exercises: (Array.isArray(plan.exercises) ? plan.exercises : []).slice(0, 5).map(function (entry) {
            const exercise = exerciseById(entry.exerciseId);
            const sets = Math.max(1, Math.round(Number(entry.sets) || 1));
            const reps = Math.max(1, Math.round(Number(entry.reps) || 1));
            return (exercise ? exercise.name : "Exercise") + " · " + sets + "×" + reps;
          })
        };
      }),
      updatedAt: new Date().toISOString()
    };
  }

  function scheduleWidgetSync() {
    clearTimeout(widgetSyncTimer);
    widgetSyncTimer = setTimeout(function () {
      if (!window.FossWidgets || typeof window.FossWidgets.updateSnapshot !== "function") return;
      try {
        window.FossWidgets.updateSnapshot(JSON.stringify(widgetSnapshot()));
      } catch (error) {}
    }, 80);
  }

  window.FossGymWidgets = {
    snapshot: widgetSnapshot,
    sync: scheduleWidgetSync
  };

  function dashboardScoreCardMarkup(result) {
    const target = nextTargetForResult(result);
    const neededForExercise = pointsNeeded(result.displayRank);
    const nextText = result.displayRank.nextTitle
      ? "Next: " + result.displayRank.nextTitle + " at " + target + " · +" + formatPoints(neededForExercise)
      : "Top rank reached";
    return '<button class="dashboard-score-card" type="button" data-open-high-score="' + result.exercise.id + '">' +
      '<div class="dashboard-score-head"><span class="mini-art">' + exerciseArtFor(result.exercise) + '</span><span><strong>' + escapeHtml(result.exercise.name) + '</strong><small>' + escapeHtml(highScoreText(result)) + ' · ' + formatPoints(progressionPoints(result.rank.percentile)) + '</small></span><em>' + escapeHtml(result.displayRank.shortLabel) + '</em></div>' +
      '<div class="rank-progress-track"><span style="width:' + result.displayRank.progressToNext + '%"></span></div>' +
      '<div class="rank-progress-copy"><span>' + escapeHtml(result.displayRank.title) + '</span><span>' + escapeHtml(nextText) + '</span></div>' +
      '</button>';
  }

  function dashboardScoresMarkup(results, grouped) {
    if (!results.length) return '<div class="empty-high-scores"><strong>No exercise stats yet</strong><p>Save a set and its high score will appear here.</p></div>';
    let lastRating = "";
    return results.map(function (result) {
      let heading = "";
      if (grouped && result.displayRank.title !== lastRating) {
        lastRating = result.displayRank.title;
        heading = '<div class="score-rating-divider"><strong>' + escapeHtml(lastRating) + '</strong><span>' + escapeHtml(result.displayRank.shortLabel) + '</span></div>';
      }
      return heading + dashboardScoreCardMarkup(result);
    }).join("");
  }

  function renderDashboard() {
    const scores = highScoreResults();
    const overall = currentOverallScore();
    const progression = overall ? progressionForScore(overall) : null;
    const tested = GROUPS.filter(function (group) { return resultForGroup(group.id); }).length;
    const weights = weightMeasurements();
    const currentWeightKg = weights.length ? weights[weights.length - 1].weightKg : state.profile.bodyWeightKg;
    const points = progressionPoints(overall);
    const nextPoints = progression && progression.nextAt ? progressionPoints(progressionStepPercentile(progression.nextAt)) : 0;
    const needed = progression ? pointsNeeded(progression) : 0;
    const label = pointLabel();

    el.dashboardOverview.classList.toggle("hidden", dashboardAllScoresOpen);
    el.dashboardAllStatsPage.classList.toggle("hidden", !dashboardAllScoresOpen);
    el.dashboardPageEyebrow.textContent = dashboardAllScoresOpen ? "HIGHEST RATED FIRST" : "YOUR NUMBERS";
    el.dashboardPageTitle.textContent = dashboardAllScoresOpen ? "All high scores" : "Dashboard";

    el.dashboardRankValue.textContent = progression ? progression.primary : "--";
    el.dashboardRankValue.classList.toggle("rank-long", Boolean(progression && progression.primary.length > 5));
    el.dashboardRankValue.classList.toggle("rank-very-long", Boolean(progression && progression.primary.length > 18));
    el.dashboardRankTitle.textContent = progression ? progression.title : "Log a high score";
    el.dashboardRankMeta.textContent = progression ? formatPoints(points) + (state.settings.progression === "baki"
      ? " · parody display only"
      : worldRecordMode() ? " · record-progress score" : " · " + core.ordinal(overall) + " percentile estimate") : "Your overall rank will appear here.";
    el.dashboardRankProgress.style.width = progression ? progression.progressToNext + "%" : "0%";
    el.dashboardPointProgress.textContent = progression ? formatPoints(points) : "0 " + label.unit;
    el.dashboardNextRank.textContent = progression
      ? (progression.nextTitle ? "Next: " + progression.nextTitle + " at " + formatPoints(nextPoints) + " · +" + formatPoints(needed) : "Top rank reached")
      : "No rank yet";
    el.dashboardHighScoreTotal.textContent = String(scores.length);
    el.dashboardCoverage.textContent = tested + "/" + GROUPS.length;
    el.dashboardWeight.textContent = displayWeight(currentWeightKg, 1) + " " + loadUnit();
    el.dashboardPoints.textContent = formatPoints(points);
    el.dashboardPointsLabel.textContent = label.name.toUpperCase();

    el.dashboardHighScores.innerHTML = dashboardScoresMarkup(scores.slice(0, 3), false);
    el.dashboardAllScoreCount.textContent = scores.length + (scores.length === 1 ? " score" : " scores");
    el.dashboardAllHighScores.innerHTML = dashboardScoresMarkup(scores, true);

    el.dashboardChartTabs.querySelectorAll("button[data-chart-mode]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.chartMode === dashboardChartMode);
    });
    el.dashboardChartTitle.textContent = dashboardChartMode === "weight" ? "Body weight" : "Strength progression";
    setTimeout(drawDashboardChart, 30);
  }

  function drawLineChart(canvas, values, emptyNode, options) {
    if (!canvas || !canvas.getContext) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    emptyNode.classList.toggle("hidden", values.length >= 2);
    if (values.length < 2) return;
    let min = options.fixedMin == null ? Math.min.apply(Math, values) : options.fixedMin;
    let max = options.fixedMax == null ? Math.max.apply(Math, values) : options.fixedMax;
    const padding = options.fixedMin == null ? Math.max((max - min) * 0.25, options.minimumPadding || 1) : 0;
    min -= padding;
    max += padding;
    if (max === min) max = min + 1;
    const left = 18;
    const right = canvas.width - 18;
    const top = 18;
    const bottom = canvas.height - 22;
    const point = function (value, index) {
      return {
        x: left + (right - left) * index / (values.length - 1),
        y: bottom - (bottom - top) * (value - min) / (max - min)
      };
    };
    context.strokeStyle = "rgba(255,255,255,0.08)";
    context.lineWidth = 1;
    [0, 0.5, 1].forEach(function (fraction) {
      const y = top + (bottom - top) * fraction;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(right, y);
      context.stroke();
    });
    const accent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#B9F64A";
    const gradient = context.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, accent + "55");
    gradient.addColorStop(1, accent + "00");
    context.beginPath();
    values.forEach(function (value, index) {
      const p = point(value, index);
      if (index === 0) context.moveTo(p.x, p.y);
      else context.lineTo(p.x, p.y);
    });
    context.lineTo(right, bottom);
    context.lineTo(left, bottom);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    context.beginPath();
    values.forEach(function (value, index) {
      const p = point(value, index);
      if (index === 0) context.moveTo(p.x, p.y);
      else context.lineTo(p.x, p.y);
    });
    context.strokeStyle = accent;
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    values.forEach(function (value, index) {
      const p = point(value, index);
      context.beginPath();
      context.arc(p.x, p.y, index === values.length - 1 ? 7 : 4, 0, Math.PI * 2);
      context.fillStyle = index === values.length - 1 ? "#F4F7F5" : accent;
      context.fill();
    });
  }

  function drawDatedSeriesChart(canvas, series, emptyNode, emptyText, options) {
    options = options || {};
    if (!canvas || !canvas.getContext) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const points = series.reduce(function (all, item) { return all.concat(item.points || []); }, []);
    const valid = points.filter(function (point) { return Number.isFinite(point.time) && Number.isFinite(point.value); });
    const drawable = series.some(function (item) { return (item.points || []).length >= 2; });
    emptyNode.textContent = emptyText || "Log two values to see a trend.";
    emptyNode.classList.toggle("hidden", drawable);
    if (!drawable || valid.length < 2) return;
    let minTime = Math.min.apply(Math, valid.map(function (point) { return point.time; }));
    let maxTime = Math.max.apply(Math, valid.map(function (point) { return point.time; }));
    let minValue = Math.min.apply(Math, valid.map(function (point) { return point.value; }));
    let maxValue = Math.max.apply(Math, valid.map(function (point) { return point.value; }));
    if (maxTime === minTime) maxTime = minTime + 86400000;
    const valuePadding = Math.max((maxValue - minValue) * 0.22, state.profile.units === "kg" ? 1 : 2);
    minValue -= valuePadding;
    maxValue += valuePadding;
    const left = options.showYLabels ? 74 : 22;
    const right = canvas.width - 18;
    const top = 18;
    const bottom = canvas.height - (options.showXLabels ? 42 : 22);
    const pointFor = function (point) {
      return {
        x: left + (right - left) * (point.time - minTime) / (maxTime - minTime),
        y: bottom - (bottom - top) * (point.value - minValue) / (maxValue - minValue)
      };
    };
    if (options.showGrid !== false) {
      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 1;
      [0, 0.5, 1].forEach(function (fraction) {
        const y = top + (bottom - top) * fraction;
        context.beginPath();
        context.moveTo(left, y);
        context.lineTo(right, y);
        context.stroke();
      });
    }
    if (options.showYLabels && typeof context.fillText === "function") {
      const formatter = typeof options.valueFormatter === "function" ? options.valueFormatter : function (value) { return core.round(value, 1); };
      context.fillStyle = "rgba(244,247,245,0.72)";
      context.font = "18px sans-serif";
      context.textAlign = "right";
      [0, 0.5, 1].forEach(function (fraction) {
        const value = maxValue - (maxValue - minValue) * fraction;
        const y = top + (bottom - top) * fraction + 6;
        context.fillText(String(formatter(value)), left - 9, y);
      });
    }
    if (options.showXLabels && typeof context.fillText === "function") {
      const formatter = typeof options.dateFormatter === "function" ? options.dateFormatter : function (time) { return dateLabel(new Date(time).toISOString(), false); };
      context.fillStyle = "rgba(244,247,245,0.72)";
      context.font = "17px sans-serif";
      context.textAlign = "left";
      context.fillText(String(formatter(minTime)), left, canvas.height - 10);
      context.textAlign = "right";
      context.fillText(String(formatter(maxTime)), right, canvas.height - 10);
    }
    series.forEach(function (item) {
      const itemPoints = (item.points || []).filter(function (point) { return Number.isFinite(point.time) && Number.isFinite(point.value); });
      if (itemPoints.length < 2) return;
      if (typeof context.setLineDash === "function") context.setLineDash(item.dash || []);
      context.beginPath();
      itemPoints.forEach(function (point, index) {
        const plotted = pointFor(point);
        if (!index) context.moveTo(plotted.x, plotted.y);
        else context.lineTo(plotted.x, plotted.y);
      });
      context.strokeStyle = item.color;
      context.lineWidth = item.width || 5;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
      if (typeof context.setLineDash === "function") context.setLineDash([]);
      itemPoints.forEach(function (point, index) {
        const plotted = pointFor(point);
        context.beginPath();
        context.arc(plotted.x, plotted.y, index === itemPoints.length - 1 ? 6 : 3, 0, Math.PI * 2);
        context.fillStyle = item.color;
        context.fill();
      });
    });
  }

  function drawDashboardChart() {
    const isWeight = dashboardChartMode === "weight";
    const values = isWeight
      ? weightMeasurements().slice(-16).map(function (item) { return core.kgToDisplay(item.weightKg, state.profile.units); })
      : strengthHistory().map(function (item) { return item.value; });
    el.dashboardChartEmpty.textContent = isWeight ? "Log weight twice to see a trend." : "Set two high scores to see progression.";
    drawLineChart(el.dashboardChart, values, el.dashboardChartEmpty, isWeight
      ? { minimumPadding: state.profile.units === "kg" ? 1 : 2 }
      : { fixedMin: 0, fixedMax: 100 });
  }

  function cardioActivityById(id) {
    return CARDIO_ACTIVITIES.find(function (activity) { return activity.id === id; }) || CARDIO_ACTIVITIES[0];
  }

  function cardioDistanceUnit() {
    return state.profile.units === "kg" ? "km" : "mi";
  }

  function cardioDistanceToDisplay(meters) {
    return state.profile.units === "kg" ? Number(meters) / 1000 : Number(meters) / 1609.344;
  }

  function cardioDistanceFromDisplay(value) {
    return state.profile.units === "kg" ? Number(value) * 1000 : Number(value) * 1609.344;
  }

  function formatCardioTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const remainder = core.round(safe % 60, safe < 60 ? 2 : 1);
    const secondText = remainder < 10 ? "0" + remainder : String(remainder);
    return hours > 0
      ? hours + ":" + String(minutes).padStart(2, "0") + ":" + secondText.padStart(2, "0")
      : minutes + ":" + secondText.padStart(2, "0");
  }

  function cardioScoreText(entry) {
    const activity = cardioActivityById(entry.activityId);
    return activity.kind === "distance"
      ? core.round(cardioDistanceToDisplay(entry.value), 2) + " " + cardioDistanceUnit()
      : formatCardioTime(entry.value);
  }

  function cardioEntriesFor(activityId) {
    return state.cardio.filter(function (entry) { return entry.activityId === activityId; }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  }

  function bestCardioEntry(activityId) {
    const activity = cardioActivityById(activityId);
    const entries = cardioEntriesFor(activityId);
    if (!entries.length) return null;
    return entries.reduce(function (best, entry) {
      if (!best) return entry;
      return activity.kind === "distance"
        ? (entry.value > best.value ? entry : best)
        : (entry.value < best.value ? entry : best);
    }, null);
  }

  function renderCardioValueFields() {
    const activity = cardioActivityById(el.cardioActivitySelect.value);
    if (activity.kind === "distance") {
      el.cardioValueFields.innerHTML = '<label class="field-label" for="cardioDistanceInput">' + escapeHtml(activity.distanceLabel || "Distance") + '</label>' +
        '<div class="height-input-wrap cardio-distance-input"><input id="cardioDistanceInput" type="number" inputmode="decimal" min="0" step="0.01" placeholder="0.00" /><span>' + cardioDistanceUnit().toUpperCase() + '</span></div>';
      return;
    }
    el.cardioValueFields.innerHTML = '<label class="field-label">Fastest time</label><div class="cardio-time-inputs">' +
      '<label><input id="cardioMinutesInput" type="number" inputmode="numeric" min="0" max="999" step="1" value="0" /><span>MIN</span></label>' +
        '<label><input id="cardioSecondsInput" type="number" inputmode="decimal" min="0" max="59.99" step="0.01" placeholder="0.00" /><span>SEC</span></label></div>';
  }

  function cardioGoalFor(activityId) {
    return state.settings.cardioGoals && state.settings.cardioGoals[activityId]
      ? state.settings.cardioGoals[activityId]
      : null;
  }

  function cardioGoalText(activityId) {
    const activity = cardioActivityById(activityId);
    const goal = cardioGoalFor(activity.id);
    if (!goal) return "No " + activity.name.toLowerCase() + " goal set";
    const score = cardioScoreText({ activityId: activity.id, value: goal.value });
    return "Goal: " + score + " by " + dateLabel(goal.date + "T12:00:00", false);
  }

  function cardioGoalGapText(activityId) {
    const activity = cardioActivityById(activityId);
    const goal = cardioGoalFor(activity.id);
    const best = bestCardioEntry(activity.id);
    if (!goal || !best) return "";
    const gap = activity.kind === "distance" ? goal.value - best.value : best.value - goal.value;
    if (gap <= 0) return " · target reached";
    return " · " + cardioScoreText({ activityId: activity.id, value: gap }) + " to go";
  }

  function renderCardio() {
    const selectedActivity = cardioActivityById(el.cardioActivitySelect.value || CARDIO_ACTIVITIES[0].id);
    el.cardioActivitySelect.innerHTML = CARDIO_ACTIVITIES.map(function (activity) {
      return '<option value="' + activity.id + '"' + (activity.id === selectedActivity.id ? " selected" : "") + '>' + escapeHtml(activity.name) + '</option>';
    }).join("");
    el.cardioActivityTabs.innerHTML = CARDIO_ACTIVITIES.map(function (activity) {
      return '<button class="exercise-chip ' + (activity.id === selectedActivity.id ? "active" : "") + '" type="button" data-cardio-activity="' + activity.id + '">' + escapeHtml(activity.name) + '</button>';
    }).join("");
    renderCardioValueFields();
    const selectedBest = bestCardioEntry(selectedActivity.id);
    el.cardioLoggerBest.textContent = selectedBest ? cardioScoreText(selectedBest) : "--";
    el.openCardioGoalFromLogger.textContent = cardioGoalFor(selectedActivity.id) ? "Edit goal" : "Set goal";
    el.cardioChartTabs.querySelectorAll("[data-cardio-chart]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.cardioChart === cardioChartMode);
    });
    const best = bestCardioEntry(cardioChartMode);
    const activity = cardioActivityById(cardioChartMode);
    el.cardioRecordValue.textContent = best ? cardioScoreText(best) : "--";
    el.cardioRecordMeta.textContent = best ? activity.name + " · " + dateLabel(best.date, false) : "Log your first " + activity.name.toLowerCase();
    el.cardioGoalSummary.textContent = cardioGoalText(activity.id) + cardioGoalGapText(activity.id);
    el.openCardioGoalButton.textContent = cardioGoalFor(activity.id) ? "Edit goal" : "Set goal";
    const recent = state.cardio.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    el.cardioHistoryCount.textContent = state.cardio.length + (state.cardio.length === 1 ? " score" : " scores");
    el.cardioHistoryList.innerHTML = recent.length ? recent.slice(0, 12).map(function (entry) {
      const item = cardioActivityById(entry.activityId);
      return '<article class="cardio-history-row"><span><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(dateTimeLabel(entry.date, true)) + '</small></span><b>' + escapeHtml(cardioScoreText(entry)) + '</b><button type="button" data-delete-cardio="' + escapeHtml(entry.id) + '" aria-label="Delete ' + escapeHtml(item.name) + ' score">Delete</button></article>';
    }).join("") : '<div class="empty-high-scores"><strong>No cardio scores yet</strong><p>Choose an activity and save your first distance or fastest time.</p></div>';
    const goalIds = Object.keys(state.settings.cardioGoals || {});
    el.cardioGoalSettingValue.textContent = goalIds.length ? goalIds.length + (goalIds.length === 1 ? " cardio goal" : " cardio goals") : "No goals set";
    el.cardioGoalSettingDate.textContent = goalIds.length
      ? "Tap to review or add another target"
      : "Add a goal and future date";
    if (currentTab === "body") setTimeout(drawCardioChart, 30);
  }

  function drawCardioChart() {
    const activity = cardioActivityById(cardioChartMode);
    const entries = cardioEntriesFor(cardioChartMode);
    const actualPoints = entries.map(function (entry) {
      return {
        time: new Date(entry.date).getTime(),
        value: activity.kind === "distance" ? cardioDistanceToDisplay(entry.value) : entry.value
      };
    });
    const goal = cardioGoalFor(activity.id);
    let goalPoints = [];
    if (goal) {
      const goalTime = new Date(goal.date + "T12:00:00").getTime();
      const startValue = actualPoints.length ? actualPoints[actualPoints.length - 1].value : null;
      if (Number.isFinite(goalTime) && Number.isFinite(startValue)) {
        goalPoints = [
          { time: Math.min(Date.now(), goalTime - 86400000), value: startValue },
          { time: goalTime, value: activity.kind === "distance" ? cardioDistanceToDisplay(goal.value) : goal.value }
        ];
      }
    }
    const accent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#B9F64A";
    drawDatedSeriesChart(el.cardioChart, [
      { points: actualPoints, color: accent, width: 5 },
      { points: goalPoints, color: "#59A8FF", width: 4, dash: [12, 8] }
    ], el.cardioChartEmpty, "Log two " + activity.name.toLowerCase() + " scores to see a trend.", {
      showGrid: true,
      showYLabels: true,
      valueFormatter: activity.kind === "distance"
        ? function (value) { return core.round(value, 2) + " " + cardioDistanceUnit(); }
        : function (value) { return formatCardioTime(value); }
    });
  }

  function renderCardioGoalValueFields() {
    const activity = cardioActivityById(activeCardioGoalId);
    const goal = cardioGoalFor(activity.id);
    if (activity.kind === "distance") {
      const value = goal ? core.round(cardioDistanceToDisplay(goal.value), 2) : "";
      el.cardioGoalValueFields.innerHTML = '<label class="field-label" for="cardioGoalDistanceInput">Goal distance</label>' +
        '<div class="height-input-wrap"><input id="cardioGoalDistanceInput" type="number" inputmode="decimal" min="0" step="0.01" value="' + value + '" placeholder="0.00" /><span>' + cardioDistanceUnit().toUpperCase() + '</span></div>';
    } else {
      const total = goal ? Number(goal.value) : 0;
      const minutes = total ? Math.floor(total / 60) : 0;
      const seconds = total ? core.round(total % 60, 2) : "";
      el.cardioGoalValueFields.innerHTML = '<label class="field-label">Goal time</label><div class="cardio-time-inputs">' +
        '<label><input id="cardioGoalMinutesInput" type="number" inputmode="numeric" min="0" max="999" step="1" value="' + minutes + '" /><span>MIN</span></label>' +
        '<label><input id="cardioGoalSecondsInput" type="number" inputmode="decimal" min="0" max="59.99" step="0.01" value="' + seconds + '" placeholder="0.00" /><span>SEC</span></label></div>';
    }
    el.clearCardioGoalButton.classList.toggle("hidden", !goal);
    updateCardioGoalPreview();
  }

  function cardioGoalValueFromEditor() {
    const activity = cardioActivityById(activeCardioGoalId);
    if (activity.kind === "distance") {
      const input = el.cardioGoalValueFields.querySelector("#cardioGoalDistanceInput");
      const distance = Number(input && input.value);
      return distance > 0 ? cardioDistanceFromDisplay(distance) : 0;
    }
    const minutes = Math.max(0, Math.floor(Number(el.cardioGoalValueFields.querySelector("#cardioGoalMinutesInput")?.value) || 0));
    const seconds = Number(el.cardioGoalValueFields.querySelector("#cardioGoalSecondsInput")?.value);
    return Number.isFinite(seconds) && seconds >= 0 && seconds < 60 ? minutes * 60 + seconds : 0;
  }

  function updateCardioGoalPreview() {
    const activity = cardioActivityById(activeCardioGoalId);
    const value = cardioGoalValueFromEditor();
    const date = String(el.cardioGoalDateInput.value || "");
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date + "T12:00:00").getTime() : NaN;
    const best = bestCardioEntry(activity.id);
    if (!(value > 0) || !Number.isFinite(goalTime) || goalTime <= Date.now()) {
      el.cardioGoalPreview.textContent = "Choose a target and a date after today.";
      return;
    }
    const days = Math.max(1, Math.ceil((goalTime - Date.now()) / 86400000));
    if (!best) {
      el.cardioGoalPreview.textContent = "Goal: " + cardioScoreText({ activityId: activity.id, value: value }) + " in " + days + " days. Log a score to calculate the gap.";
      return;
    }
    const gap = activity.kind === "distance" ? value - best.value : best.value - value;
    if (gap <= 0) {
      el.cardioGoalPreview.textContent = "Your current personal record already meets this target.";
      return;
    }
    const daily = gap / days;
    el.cardioGoalPreview.textContent = cardioScoreText({ activityId: activity.id, value: gap }) + " to improve over " + days + " days · " + cardioScoreText({ activityId: activity.id, value: daily }) + " per day";
  }

  function openCardioGoalEditor(activityId) {
    activeCardioGoalId = cardioActivityById(activityId || activeCardioGoalId).id;
    el.cardioGoalActivitySelect.innerHTML = CARDIO_ACTIVITIES.map(function (activity) {
      return '<option value="' + activity.id + '"' + (activity.id === activeCardioGoalId ? " selected" : "") + '>' + escapeHtml(activity.name) + '</option>';
    }).join("");
    const goal = cardioGoalFor(activeCardioGoalId);
    el.cardioGoalDateInput.min = isoDateAfterDays(1);
    el.cardioGoalDateInput.value = goal ? goal.date : isoDateAfterDays(90);
    renderCardioGoalValueFields();
    openModal("cardioGoalModal");
  }

  function saveCardioGoal() {
    const activity = cardioActivityById(activeCardioGoalId);
    const value = cardioGoalValueFromEditor();
    const date = String(el.cardioGoalDateInput.value || "");
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date + "T12:00:00").getTime() : NaN;
    if (!(value > 0)) {
      showToast("Enter a valid cardio target.");
      return;
    }
    if (!Number.isFinite(goalTime) || goalTime <= Date.now()) {
      showToast("Choose a goal date after today.");
      return;
    }
    state.settings.cardioGoals[activity.id] = { value: value, date: date };
    cardioChartMode = activity.id === "fastest-mile" ? "fastest-mile" : activity.id === "longest-run" ? "longest-run" : cardioChartMode;
    saveState();
    closeModal("cardioGoalModal");
    renderAll();
    showToast(activity.name + " goal saved.");
  }

  function clearCardioGoal() {
    const activity = cardioActivityById(activeCardioGoalId);
    if (!cardioGoalFor(activity.id)) return;
    delete state.settings.cardioGoals[activity.id];
    saveState();
    closeModal("cardioGoalModal");
    renderAll();
    showToast(activity.name + " goal cleared.");
  }

  function saveCardioScore() {
    const activity = cardioActivityById(el.cardioActivitySelect.value);
    let value = 0;
    if (activity.kind === "distance") {
      const input = el.cardioValueFields.querySelector("#cardioDistanceInput");
      const distance = Number(input && input.value);
      if (!(distance > 0)) {
        showFeedbackBanner("Enter a distance greater than zero.", "error");
        return;
      }
      value = cardioDistanceFromDisplay(distance);
    } else {
      const minutesInput = el.cardioValueFields.querySelector("#cardioMinutesInput");
      const secondsInput = el.cardioValueFields.querySelector("#cardioSecondsInput");
      const minutes = Math.max(0, Math.floor(Number(minutesInput && minutesInput.value) || 0));
      const seconds = Number(secondsInput && secondsInput.value);
      if (!Number.isFinite(seconds) || seconds < 0 || seconds >= 60 || !(minutes * 60 + seconds > 0)) {
        showFeedbackBanner("Enter a valid fastest time.", "error");
        return;
      }
      value = minutes * 60 + seconds;
    }
    state.cardio.push({ id: uid("cardio"), activityId: activity.id, value: value, date: new Date().toISOString() });
    cardioChartMode = activity.id === "fastest-mile" ? "fastest-mile" : activity.id === "longest-run" ? "longest-run" : cardioChartMode;
    saveState();
    renderCardio();
    showFeedbackBanner("Cardio score added to your history.", "success");
    vibratePhone(45);
  }

  function deleteCardioScore(id) {
    const entry = state.cardio.find(function (item) { return item.id === id; });
    if (!entry) return;
    const activity = cardioActivityById(entry.activityId);
    askConfirm({
      title: "Delete this cardio score?",
      message: activity.name + " at " + cardioScoreText(entry) + " will be removed from your timeline.",
      button: "Delete"
    }, function () {
      state.cardio = state.cardio.filter(function (item) { return item.id !== entry.id; });
      saveState();
      renderCardio();
      showToast("Cardio score deleted.");
    });
  }

  function equipmentSummary(ids, locationId) {
    const count = uniqueStrings(ids).length;
    if (locationId === "home" && count === 0) return "No equipment selected";
    return count + (count === 1 ? " item selected" : " items selected");
  }

  function renderActiveLocationSelector() {
    const available = normalizeLocationIds(state.settings.availableLocations);
    const options = available.length ? available : ["home"];
    const active = options.includes(state.settings.activeLocation) ? state.settings.activeLocation : options[0];
    if (state.settings.activeLocation !== active) state.settings.activeLocation = active;
    el.activeLocationSelect.innerHTML = options.map(function (id) {
      const location = locationById(id);
      return '<option value="' + id + '"' + (id === active ? " selected" : "") + '>' + escapeHtml(location.name) + '</option>';
    }).join("");
    el.activeLocationSelect.disabled = !state.settings.locationSetupComplete || options.length < 2;
  }

  function renderSetupLocations() {
    el.setupLocations.innerHTML = LOCATIONS.map(function (location) {
      const active = setupLocationDraft.includes(location.id);
      return '<button class="setup-location-choice ' + (active ? "active" : "") + '" type="button" data-setup-location="' + location.id + '" aria-pressed="' + String(active) + '">' +
        '<span>' + location.icon + '</span><span><strong>' + escapeHtml(location.setupName) + '</strong><small>' + escapeHtml(location.help) + '</small></span></button>';
    }).join("");
    el.setupEquipmentSummaries.innerHTML = setupLocationDraft.map(function (locationId) {
      const location = locationById(locationId);
      const ids = setupLocationEquipmentDraft[locationId] || [];
      const chainNote = locationId === "planet" || locationId === "crunch" ? "Typical inventory loaded. Verify this club." : equipmentSummary(ids, locationId);
      return '<div class="setup-equipment-summary"><span><strong>' + escapeHtml(location.name) + ' equipment</strong><small>' + escapeHtml(chainNote) + '</small></span>' +
        '<button type="button" data-setup-equipment="' + locationId + '">' + (ids.length ? "Edit" : locationId === "home" ? "Choose" : "Required") + '</button></div>';
    }).join("");
  }

  function renderLocationSettings() {
    const available = normalizeLocationIds(state.settings.availableLocations);
    const lists = normalizeLocationEquipment(state.settings.locationEquipment);
    el.locationSettings.innerHTML = LOCATIONS.map(function (location) {
      const active = available.includes(location.id);
      const current = activeLocationId() === location.id;
      const count = lists[location.id].length;
      const detail = active
        ? (current ? "Active now · " : "") + equipmentSummary(lists[location.id], location.id)
        : "Not in your locations";
      return '<div class="settings-location-card ' + (active ? "active " : "") + (current ? "current" : "") + '">' +
        '<button class="settings-location-toggle" type="button" data-toggle-location="' + location.id + '" aria-pressed="' + String(active) + '" aria-label="' + (active ? "Remove " : "Add ") + escapeHtml(location.name) + '">' + (active ? "✓" : "+") + '</button>' +
        '<span><strong>' + escapeHtml(location.name) + '</strong><small>' + escapeHtml(detail) + '</small></span>' +
        (active ? '<button type="button" data-edit-location-equipment="' + location.id + '">' + (count ? "Edit gear" : "Choose gear") + '</button>' : '') + '</div>';
    }).join("");
    setSegment(el.equipmentPreferenceSetting, state.settings.equipmentPreference || "none");
  }

  function equipmentEditorItems() {
    const custom = equipmentEditorFromSetup ? equipmentEditorCustomDraft : normalizeCustomEquipment(state.settings.customEquipment);
    return (equipment ? equipment.items() : []).concat(custom);
  }

  function equipmentAvailabilityLabel(item, locationId) {
    if (item.kind === "custom") return "Custom";
    if (locationId !== "planet" && locationId !== "crunch") {
      if (item.kind === "free_weights") return "Free weights";
      if (item.kind === "machine") return "Machine";
      return item.category;
    }
    if (item[locationId] === "chain") return "Chain-listed";
    if (item[locationId] === "common") return "Common";
    if (item[locationId] === "select") return "Select clubs";
    return "Add if present";
  }

  function renderEquipmentEditor() {
    const location = locationById(equipmentEditorLocation);
    const needle = equipmentSearchQuery.trim().toLowerCase();
    const categoryOrder = ["Free weights", "Benches and racks", "Machines", "Functional training", "Home and accessories", "Cardio", "Recovery", "Other"];
    const items = equipmentEditorItems().filter(function (item) {
      return !needle || item.name.toLowerCase().includes(needle) || item.category.toLowerCase().includes(needle);
    }).sort(function (a, b) {
      const aRelevant = a[equipmentEditorLocation] ? 0 : 1;
      const bRelevant = b[equipmentEditorLocation] ? 0 : 1;
      if (aRelevant !== bRelevant) return aRelevant - bRelevant;
      const category = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      return category || a.name.localeCompare(b.name);
    });
    const categories = [];
    items.forEach(function (item) { if (!categories.includes(item.category)) categories.push(item.category); });
    el.equipmentModalEyebrow.textContent = location.name.toUpperCase() + " EQUIPMENT";
    el.equipmentModalTitle.textContent = "Choose equipment";
    el.equipmentModalCopy.textContent = equipmentEditorLocation === "planet" || equipmentEditorLocation === "crunch"
      ? "The app loaded a typical catalog. Keep only the equipment at this specific club."
      : "Select the equipment that is actually available at " + location.name + ".";
    el.noEquipmentChoice.classList.toggle("hidden", equipmentEditorLocation !== "home");
    el.noEquipmentChoice.classList.toggle("active", equipmentEditorLocation === "home" && equipmentEditorDraft.length === 0);
    el.noEquipmentChoice.setAttribute("aria-pressed", String(equipmentEditorLocation === "home" && equipmentEditorDraft.length === 0));
    el.equipmentSelectionCount.textContent = equipmentEditorDraft.length + (equipmentEditorDraft.length === 1 ? " selected item" : " selected items");
    el.equipmentPicker.innerHTML = categories.map(function (category) {
      const options = items.filter(function (item) { return item.category === category; }).map(function (item) {
        const active = equipmentEditorDraft.includes(item.id);
        return '<button class="equipment-option ' + (active ? "active" : "") + '" type="button" data-equipment-choice="' + escapeHtml(item.id) + '" aria-pressed="' + String(active) + '">' +
          '<span>✓</span><span><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.category) + '</small></span><em>' + escapeHtml(equipmentAvailabilityLabel(item, equipmentEditorLocation)) + '</em></button>';
      }).join("");
      return '<section class="equipment-category"><h3>' + escapeHtml(category) + '</h3>' + options + '</section>';
    }).join("") || '<p class="plain-note">No equipment found.</p>';
  }

  function openEquipmentEditor(locationId, fromSetup) {
    equipmentEditorLocation = locationById(locationId).id;
    equipmentEditorFromSetup = Boolean(fromSetup);
    if (equipmentEditorFromSetup) pendingLocationActivation = null;
    const source = equipmentEditorFromSetup ? setupLocationEquipmentDraft : state.settings.locationEquipment;
    equipmentEditorDraft = uniqueStrings((source && source[equipmentEditorLocation]) || []);
    equipmentEditorCustomDraft = normalizeCustomEquipment(equipmentEditorFromSetup ? setupCustomEquipmentDraft : state.settings.customEquipment);
    equipmentSearchQuery = "";
    el.equipmentSearchInput.value = "";
    el.customEquipmentInput.value = "";
    renderEquipmentEditor();
    openModal("equipmentModal");
  }

  function addCustomEquipmentFromEditor() {
    const name = el.customEquipmentInput.value.trim().slice(0, 45);
    if (!name) {
      showToast("Name the equipment first.");
      return;
    }
    const existing = equipmentEditorItems().find(function (item) { return item.name.toLowerCase() === name.toLowerCase(); });
    if (existing) {
      if (!equipmentEditorDraft.includes(existing.id)) equipmentEditorDraft.push(existing.id);
    } else {
      const item = { id: uid("custom-equipment"), name: name, category: "Other", kind: "custom" };
      equipmentEditorCustomDraft.push(item);
      equipmentEditorDraft.push(item.id);
    }
    el.customEquipmentInput.value = "";
    renderEquipmentEditor();
  }

  function saveEquipmentEditor() {
    if (equipmentEditorLocation !== "home" && !equipmentEditorDraft.length) {
      showToast("Choose at least one piece of equipment for " + locationById(equipmentEditorLocation).name + ".");
      return;
    }
    if (equipmentEditorFromSetup) {
      setupLocationEquipmentDraft[equipmentEditorLocation] = uniqueStrings(equipmentEditorDraft);
      setupCustomEquipmentDraft = normalizeCustomEquipment(equipmentEditorCustomDraft);
      renderSetupLocations();
    } else {
      state.settings.locationEquipment = normalizeLocationEquipment(state.settings.locationEquipment);
      state.settings.locationEquipment[equipmentEditorLocation] = uniqueStrings(equipmentEditorDraft);
      state.settings.customEquipment = normalizeCustomEquipment(equipmentEditorCustomDraft);
      if (pendingLocationActivation === equipmentEditorLocation && !state.settings.availableLocations.includes(equipmentEditorLocation)) {
        state.settings.availableLocations.push(equipmentEditorLocation);
        state.settings.availableLocations = normalizeLocationIds(state.settings.availableLocations);
      }
      saveState();
      selectedPlanId = null;
      renderAll();
    }
    closeModal("equipmentModal");
    showToast(locationById(equipmentEditorLocation).name + " equipment saved.");
  }

  function renderSettings() {
    const schemes = core.progressionSchemes();
    const selectedScheme = schemes.find(function (scheme) { return scheme.id === state.settings.progression; }) || schemes[0];
    const sample = core.progressionForScore(72, selectedScheme.id);
    el.progressionSettingValue.textContent = selectedScheme.name + " · " + sample.shortLabel;
    el.progressionSelect.innerHTML = schemes.map(function (scheme) {
      return '<option value="' + scheme.id + '"' + (selectedScheme.id === scheme.id ? " selected" : "") + '>' + escapeHtml(scheme.name) + '</option>';
    }).join("");
    el.progressionDescription.textContent = selectedScheme.description + (selectedScheme.id === "baki"
      ? " Every rank uses a Baki character and an impossible feat. The first exercise target is 100 times the normal top-end target, character ranks are never awarded, and your real 0 to 9,900 score and saved records stay untouched."
      : " Every style uses the same 0 to 9,900 " + pointLabel().unit + " score.");
    el.pointLabelSelect.innerHTML = POINT_LABEL_OPTIONS.map(function (option) {
      return '<option value="' + option.id + '"' + (state.settings.pointLabel === option.id ? " selected" : "") + '>' + escapeHtml(option.name) + '</option>';
    }).join("");
    el.customPointLabelWrap.classList.toggle("hidden", state.settings.pointLabel !== "custom");
    el.customPointLabelInput.value = state.settings.customPointLabel || "Points";
    el.pointLabelPreview.textContent = "Example: " + formatPoints(progressionPoints(54));
    el.themeOptions.innerHTML = THEMES.map(function (theme) {
      return '<button class="theme-option ' + (!state.settings.useCustomAccent && state.settings.theme === theme.id ? "active" : "") + '" type="button" data-theme-choice="' + theme.id + '"><span style="background:' + theme.color + '"></span><small>' + escapeHtml(theme.name) + '</small></button>';
    }).join("") + '<button class="theme-option custom-color-option ' + (state.settings.useCustomAccent ? "active" : "") + '" type="button" data-custom-color><span></span><small>Custom color</small></button>';
    el.appTitleInput.value = normalizeAppTitle(state.settings.appTitle);
    el.logoOptions.innerHTML = LOGO_OPTIONS.map(function (logo) {
      return '<button class="logo-option ' + (state.settings.logo === logo.id ? "active" : "") + '" type="button" data-logo-choice="' + logo.id + '"><span>' + logoArt(logo.id) + '</span><small>' + escapeHtml(logo.name) + '</small></button>';
    }).join("");
    el.drawAppMarkButton.textContent = normalizeIconStrokes(state.settings.customAppMark, state.settings.customAppMarkWidth).length ? "Edit drawing" : "Draw";
    el.drawAppMarkButton.classList.toggle("active", state.settings.logo === "custom");
    el.customExerciseCount.textContent = state.customExercises.length + (state.customExercises.length === 1 ? " custom" : " custom");
    el.customExerciseList.innerHTML = state.customExercises.length ? state.customExercises.map(function (exercise) {
      return '<div class="custom-exercise-row"><span class="mini-art">' + exerciseArtFor(exercise) + '</span><span><strong>' + escapeHtml(exercise.name) + '</strong><small>' + escapeHtml(exerciseGroupLabel(exercise)) + ' · ' + (isBodyweight(exercise) ? "Reps" : "Weighted") + '</small></span><button type="button" data-delete-custom="' + exercise.id + '" aria-label="Delete ' + escapeHtml(exercise.name) + '">×</button></div>';
    }).join("") : '<p class="settings-empty">Your added exercises will appear here.</p>';
    setSegment(el.unitsSetting, state.profile.units);
    setSegment(el.standardSetting, state.profile.standard);
    setSegment(el.rankTargetModeSetting, state.settings.rankTargetMode || "training");
    setSegment(el.weightedScoreModeSetting, weightedScoreMode());
    setSegment(el.showExerciseTagsSetting, String(state.settings.showExerciseTags !== false));
    setSegment(el.cooldownTimerSetting, String(state.settings.restSeconds || 60));
    el.historyBundleWindow.value = String(state.settings.historyBundleWindow || "day");
    el.recentTrainingWindow.value = String(state.settings.recentTrainingWindowDays || 7);
    const hasWeightGoal = Number(state.settings.weightGoalKg) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(String(state.settings.weightGoalDate || ""));
    el.weightGoalSettingValue.textContent = hasWeightGoal ? displayWeight(state.settings.weightGoalKg, 1) + " " + loadUnit() : "Not set";
    el.weightGoalSettingDate.textContent = hasWeightGoal ? "Target date: " + dateLabel(state.settings.weightGoalDate + "T12:00:00", false) : "Add a goal to unlock trajectory view";
    const proportionalPhysique = selectedProportionalPhysique();
    el.proportionalTargetSettingName.textContent = proportionalPhysique.name;
    renderProportionalTargets();
    el.rankTargetModeDescription.textContent = worldRecordMode()
      ? "Verified IPF and directly comparable Guinness records drive supported exercises. Exercises without a standardized metric keep their training scale and never show a made-up World Class target."
      : "Bodyweight-relative training bands drive progression. World Class is the final target only when a directly comparable published record exists.";
    el.standardSettingDescription.textContent = state.profile.standard === "male"
      ? "Switching to Female changes rankings and means people will be calling you ma'am and stuff."
      : "Switching to Male changes rankings and means people will be calling you sir and stuff.";
    el.weightedScoreModeDescription.textContent = weightedScoreMode() === "one_rep_max"
      ? "Only a weighted set with exactly 1 rep counts toward your actual 1RM high score and rank."
      : weightedScoreMode() === "estimated_one_rep_max"
        ? "Weight and reps calculate an estimated 1RM with the Epley formula."
        : "The largest weight you save counts as the high score, regardless of reps.";
    const customAccent = normalizeHexColor(state.settings.customAccent) || "#B9F64A";
    const preset = THEMES.find(function (theme) { return theme.id === state.settings.theme; }) || THEMES[0];
    el.customAccentStatus.textContent = state.settings.useCustomAccent
      ? "Custom " + customAccent + " is active."
      : preset.name + " preset is active.";
    renderLocationSettings();
  }

  function openCustomExercise() {
    el.customExerciseName.value = "";
    customExerciseGroupIds = [GROUPS[0].id];
    customExerciseMotion = EXERCISE_ICON_OPTIONS[0].id;
    customExerciseIconStrokes = [];
    customExerciseIconWidth = 4;
    renderCustomExerciseGroups();
    setSegment(el.customExerciseType, "weighted");
    renderCustomExerciseIconPicker();
    openModal("customExerciseModal");
  }

  function renderCustomExerciseGroups() {
    el.customExerciseGroups.innerHTML = GROUPS.map(function (group) {
      return '<button class="' + (customExerciseGroupIds.includes(group.id) ? "active" : "") + '" type="button" data-custom-exercise-group="' + group.id + '" aria-pressed="' + String(customExerciseGroupIds.includes(group.id)) + '">' + escapeHtml(group.name) + '</button>';
    }).join("");
    const share = core.round(100 / Math.max(1, customExerciseGroupIds.length), 1);
    el.customExerciseWeighting.textContent = customExerciseGroupIds.length === 1
      ? "This muscle receives 100% of the exercise's overall score weight."
      : "Each selected muscle receives " + share + "% of the exercise's overall score weight.";
  }

  function renderCustomExerciseIconPicker() {
    el.customExerciseIcons.innerHTML = EXERCISE_ICON_OPTIONS.map(function (icon, index) {
      return '<button class="exercise-icon-option ' + (customExerciseMotion === icon.id ? "active" : "") + '" type="button" data-custom-icon="' + icon.id + '"><span>' + exerciseArt(icon.id) + '</span><small>' + escapeHtml(icon.name) + '</small></button>';
    }).join("") + '<button class="exercise-icon-option draw-icon-option ' + (customExerciseMotion === "custom" ? "active" : "") + '" type="button" data-draw-exercise-icon><span>' + drawnPlanIconArt(customExerciseIconStrokes, customExerciseIconWidth) + '</span><small>' + (normalizeIconStrokes(customExerciseIconStrokes, customExerciseIconWidth).length ? "Edit drawing" : "Draw yours") + '</small></button>';
  }

  function customReferenceStandards(groupIds, standard) {
    const references = normalizeExerciseGroupIds(groupIds, GROUPS[0].id).map(function (groupId) {
      const group = groupById(groupId);
      const exercise = EXERCISES.find(function (item) { return item.id === group.defaultExercise; }) || EXERCISES[0];
      return exercise[standard] || exercise.male;
    });
    return [0, 1, 2, 3, 4].map(function (index) {
      return core.round(references.reduce(function (sum, values) { return sum + Number(values[index] || 0); }, 0) / references.length, 4);
    });
  }

  function saveCustomExercise() {
    const name = el.customExerciseName.value.trim();
    if (!name) {
      showToast("Name the exercise.");
      return;
    }
    const groupIds = normalizeExerciseGroupIds(customExerciseGroupIds, GROUPS[0].id);
    const typeButton = el.customExerciseType.querySelector("button.active");
    const type = typeButton ? typeButton.dataset.value : "weighted";
    const motion = customExerciseMotion || "press";
    if (motion === "custom" && !normalizeIconStrokes(customExerciseIconStrokes, customExerciseIconWidth).length) {
      showToast("Draw the custom icon first.");
      return;
    }
    state.customExercises.push({
      id: "custom-" + uid("exercise"),
      name: name,
      group: groupIds[0],
      muscleGroups: groupIds,
      muscleWeights: equalMuscleWeights(groupIds),
      motion: motion,
      customIcon: motion === "custom" ? normalizeIconStrokes(customExerciseIconStrokes, customExerciseIconWidth) : [],
      customIconWidth: normalizeIconWidth(customExerciseIconWidth),
      type: type === "bodyweight" ? "bodyweight" : "weighted",
      male: type === "bodyweight" ? [5, 10, 20, 35, 55] : customReferenceStandards(groupIds, "male"),
      female: type === "bodyweight" ? [3, 8, 15, 27, 42] : customReferenceStandards(groupIds, "female"),
      custom: true
    });
    saveState();
    renderAll();
    closeModal("customExerciseModal");
    showToast(name + " added.");
  }

  function allProportionalPhysiques() {
    return PROPORTIONAL_PHYSIQUES.concat(Array.isArray(state.customPhysiques) ? state.customPhysiques : []);
  }

  function customPhysiqueById(id) {
    return (state.customPhysiques || []).find(function (item) { return item.id === id; }) || null;
  }

  function renderCustomPhysiqueList() {
    if (!el.customPhysiqueList) return;
    const customPhysiques = state.customPhysiques || [];
    el.customPhysiqueList.innerHTML = customPhysiques.length ? customPhysiques.map(function (physique) {
      const ratioSummary = CUSTOM_RATIO_FIELDS.filter(function (field) {
        return Number(physique.ratios && physique.ratios[field.key]) > 0;
      }).slice(0, 3).map(function (field) {
        return field.label + " " + core.round(physique.ratios[field.key], 3) + "×";
      }).join(" · ");
      return '<article class="custom-physique-row' + (state.settings.proportionalPhysique === physique.id ? ' active' : '') + '">' +
        '<span><strong>' + escapeHtml(physique.name) + '</strong><small>' + escapeHtml(ratioSummary + (Object.keys(physique.ratios || {}).length > 3 ? " · more" : "")) + '</small></span>' +
        '<div><button type="button" data-use-custom-physique="' + physique.id + '">Use</button><button type="button" data-edit-custom-physique="' + physique.id + '">Edit</button><button class="danger" type="button" data-delete-custom-physique="' + physique.id + '">Delete</button></div></article>';
    }).join("") : '<p class="settings-empty">No custom ratios yet. Create one and name it here.</p>';
  }

  function openCustomPhysiqueEditor(id) {
    const physique = customPhysiqueById(id);
    editingCustomPhysiqueId = physique ? physique.id : null;
    el.customPhysiqueTitle.textContent = physique ? "Edit custom ratio" : "Create custom ratio";
    el.customPhysiqueName.value = physique ? physique.name : "";
    el.customRatioGrid.querySelectorAll("[data-custom-ratio]").forEach(function (input) {
      const field = CUSTOM_RATIO_FIELDS.find(function (item) { return item.key === input.dataset.customRatio; });
      const value = physique && Number(physique.ratios[input.dataset.customRatio]) > 0
        ? physique.ratios[input.dataset.customRatio]
        : field.defaultValue;
      input.value = String(value);
    });
    const bodyFatInput = el.customRatioGrid.querySelector("[data-custom-body-fat]");
    if (bodyFatInput) bodyFatInput.value = String(physique && Number(physique.bodyFatTarget) > 0 ? physique.bodyFatTarget : (state.profile.standard === "female" ? 20 : 12));
    el.saveCustomPhysiqueButton.textContent = physique ? "Save changes" : "Save custom ratio";
    openModal("customPhysiqueModal");
  }

  function saveCustomPhysique() {
    const name = String(el.customPhysiqueName.value || "").trim().replace(/\s+/g, " ").slice(0, 40);
    if (!name) {
      showToast("Name your custom ratio.");
      return;
    }
    const duplicate = (state.customPhysiques || []).find(function (item) {
      return item.id !== editingCustomPhysiqueId && item.name.toLowerCase() === name.toLowerCase();
    });
    if (duplicate) {
      showToast("A custom ratio already uses that name.");
      return;
    }
    const ratios = {};
    el.customRatioGrid.querySelectorAll("[data-custom-ratio]").forEach(function (input) {
      const value = Number(input.value);
      if (Number.isFinite(value) && value >= 0.1 && value <= 10) ratios[input.dataset.customRatio] = value;
    });
    if (!Object.keys(ratios).length) {
      showToast("Add at least one ratio between 0.1 and 10.");
      return;
    }
    const bodyFatInput = el.customRatioGrid.querySelector("[data-custom-body-fat]");
    const bodyFatTarget = Number(bodyFatInput && bodyFatInput.value);
    if (!(bodyFatTarget >= 1 && bodyFatTarget <= 70)) {
      showToast("Choose a body-fat target from 1 to 70 percent.");
      return;
    }
    const normalized = normalizeCustomPhysique({ id: editingCustomPhysiqueId || uid("custom-physique"), name: name, ratios: ratios, bodyFatTarget: bodyFatTarget });
    if (!normalized) {
      showToast("Check the custom ratio values.");
      return;
    }
    const existingIndex = (state.customPhysiques || []).findIndex(function (item) { return item.id === editingCustomPhysiqueId; });
    if (existingIndex >= 0) state.customPhysiques[existingIndex] = normalized;
    else {
      if (state.customPhysiques.length >= 30) {
        showToast("Delete a custom ratio before adding another.");
        return;
      }
      state.customPhysiques.push(normalized);
    }
    state.settings.proportionalPhysique = normalized.id;
    editingCustomPhysiqueId = null;
    saveState();
    closeModal("customPhysiqueModal");
    renderAll();
    showToast(name + " saved and selected.");
  }

  function deleteCustomPhysique(id) {
    const physique = customPhysiqueById(id);
    if (!physique) return;
    askConfirm({
      title: "Delete " + physique.name + "?",
      message: "This removes the custom ratio. Saved measurements are not affected.",
      button: "Delete"
    }, function () {
      state.customPhysiques = state.customPhysiques.filter(function (item) { return item.id !== physique.id; });
      if (state.settings.proportionalPhysique === physique.id) state.settings.proportionalPhysique = "golden";
      saveState();
      renderAll();
      showToast(physique.name + " deleted.");
    });
  }

  function selectedProportionalPhysique() {
    return allProportionalPhysiques().find(function (item) { return item.id === state.settings.proportionalPhysique; }) || PROPORTIONAL_PHYSIQUES[0];
  }

  function inchesToCm(value) {
    return Number(value) * 2.54;
  }

  function proportionalTemplate(physique) {
    const templates = {
      lean_af: { heightIn: 69, waistCm: 29.25, chestCm: 38.25, shoulderCm: 45.5, armCm: 13.5, forearmCm: 11.375, neckCm: 14.5, thighCm: 21.25, calfCm: 14.5 },
      guts: { heightIn: 76, waistCm: 31.5, chestCm: 49, shoulderCm: 57.5, neckCm: 17, armCm: 17.5, forearmCm: 14, thighCm: 26.25, calfCm: 16.5 },
      baki: { heightIn: 66, waistCm: 28, chestCm: 75, shoulderCm: 90, neckCm: 28, armCm: 32, forearmCm: 24, hipCm: 44, thighCm: 40, calfCm: 26 },
      reeves: { heightIn: 73, chestCm: 48, waistCm: 29, armCm: 18, thighCm: 26, calfCm: 18, neckCm: 18 },
      arnold: { heightIn: 74, chestCm: 57, waistCm: 34, armCm: 22, thighCm: 28.5, calfCm: 20 },
      walker: { heightIn: 78, chestCm: 48, waistCm: 32, armCm: 18 }
    };
    return templates[physique.id] || null;
  }

  function proportionalReference(snapshot, physique) {
    const currentWeightKg = Number(snapshot.weightKg) > 0 ? Number(snapshot.weightKg) : Number(state.profile.bodyWeightKg);
    const currentHeightCm = Number(snapshot.heightCm) > 0 ? Number(snapshot.heightCm) : Number(state.profile.heightCm);
    const template = proportionalTemplate(physique);
    if (!template || !(Number(physique.referenceWeightLb) > 0) || !(currentWeightKg > 0)) {
      return { weightKg: currentWeightKg, bias: 0, label: "Current mass", heightScale: 1 };
    }
    const heightScale = currentHeightCm > 0 ? currentHeightCm / inchesToCm(template.heightIn) : 1;
    const weightKg = core.displayToKg(physique.referenceWeightLb, "lb") * Math.pow(heightScale, 2);
    return {
      weightKg: weightKg,
      bias: (weightKg / currentWeightKg - 1) * 100,
      label: (physique.shortReferenceName || physique.name) + " reference",
      heightScale: heightScale
    };
  }

  function proportionalMassRange(snapshot) {
    const currentWeightKg = Number(snapshot.weightKg) > 0 ? Number(snapshot.weightKg) : Number(state.profile.bodyWeightKg);
    const reference = proportionalReference(snapshot, selectedProportionalPhysique());
    const minimumWeightKg = Math.max(1, currentWeightKg - core.displayToKg(50, "lb"));
    const maximumWeightKg = currentWeightKg + core.displayToKg(25, "lb");
    const minimum = Math.round(core.clamp((minimumWeightKg / currentWeightKg - 1) * 100, -95, 300));
    const maximum = Math.round(core.clamp((maximumWeightKg / currentWeightKg - 1) * 100, minimum + 1, 300));
    return {
      minimum: minimum,
      maximum: maximum,
      minimumWeightKg: minimumWeightKg,
      maximumWeightKg: maximumWeightKg,
      reference: reference
    };
  }

  function proportionalBodyFatTarget(physique) {
    if (Number(physique.bodyFatTarget) > 0) return Number(physique.bodyFatTarget);
    if (state.profile.standard === "female" && Number(physique.bodyFatTargetFemale) > 0) return Number(physique.bodyFatTargetFemale);
    if (state.profile.standard !== "female" && Number(physique.bodyFatTargetMale) > 0) return Number(physique.bodyFatTargetMale);
    return state.profile.standard === "female" ? 20 : 12;
  }

  function completeProportionalTargets(targets, snapshot, physique, targetWeightKg, sizeScale) {
    const completed = Object.assign({}, targets || {});
    const scale = Number(sizeScale) > 0 ? Number(sizeScale) : 1;
    const heightCm = Number(snapshot.heightCm) > 0 ? Number(snapshot.heightCm) : Number(state.profile.heightCm);
    let waistCm = Number(completed.waistCm);
    if (!(waistCm > 0) && Number(snapshot.waistCm) > 0) waistCm = Number(snapshot.waistCm) * scale;
    if (!(waistCm > 0) && heightCm > 0) waistCm = heightCm * (state.profile.standard === "female" ? 0.40 : 0.43) * scale;
    if (!(waistCm > 0)) waistCm = 80 * scale;
    completed.weightKg = Number(targetWeightKg) > 0 ? Number(targetWeightKg) : Number(snapshot.weightKg);
    completed.bodyFat = proportionalBodyFatTarget(physique);
    completed.waistCm = waistCm;
    const defaultRatios = {
      shoulderCm: 1.61,
      chestCm: 1.45,
      neckCm: 0.48,
      armCm: 0.50,
      forearmCm: 0.42,
      wristCm: 0.20,
      hipCm: 1.08,
      thighCm: 0.725,
      calfCm: 0.50
    };
    Object.keys(defaultRatios).forEach(function (key) {
      if (Number(completed[key]) > 0) return;
      if (key === "wristCm" && Number(snapshot.wristCm) > 0) completed[key] = Number(snapshot.wristCm);
      else completed[key] = waistCm * defaultRatios[key];
    });
    return completed;
  }

  function proportionalTargets(snapshot, biasOverride) {
    const physique = selectedProportionalPhysique();
    const range = proportionalMassRange(snapshot);
    const biasPercent = core.clamp(
      biasOverride == null ? Number(state.settings.proportionalMassBias) || 0 : Number(biasOverride) || 0,
      range.minimum,
      range.maximum
    );
    const currentWeightKg = Number(snapshot.weightKg) > 0 ? Number(snapshot.weightKg) : Number(state.profile.bodyWeightKg);
    const targetWeightKg = currentWeightKg * (1 + biasPercent / 100);
    const neutralWeightKg = range.reference.weightKg > 0 ? range.reference.weightKg : currentWeightKg;
    const sizeScale = physique.gag
      ? core.clamp(1 + biasPercent / 200, 0.75, 1.25)
      : (neutralWeightKg > 0 ? Math.sqrt(Math.max(0.05, targetWeightKg / neutralWeightKg)) : 1);
    const targets = { weightKg: targetWeightKg };
    const finish = function () { return completeProportionalTargets(targets, snapshot, physique, targetWeightKg, sizeScale); };
    if (physique.id === "golden") {
      const waist = Number(snapshot.waistCm);
      if (!(waist > 0)) return finish();
      const targetWaist = waist * sizeScale;
      targets.waistCm = targetWaist;
      targets.shoulderCm = targetWaist * 1.61;
      targets.chestCm = targetWaist * 1.45;
      targets.armCm = targetWaist * 0.5;
      targets.thighCm = targetWaist * 0.725;
      targets.calfCm = targetWaist * 0.5;
      return finish();
    }
    if (physique.id === "grecian") {
      const wrist = Number(snapshot.wristCm);
      if (!(wrist > 0)) return finish();
      targets.wristCm = wrist;
      targets.chestCm = wrist * 6.5 * sizeScale;
      targets.armCm = wrist * 2.5 * sizeScale;
      targets.forearmCm = wrist * 2 * sizeScale;
      targets.neckCm = wrist * 2.4 * sizeScale;
      targets.thighCm = wrist * 3.5 * sizeScale;
      targets.calfCm = wrist * 2.4 * sizeScale;
      return finish();
    }
    if (physique.custom) {
      const waist = Number(snapshot.waistCm);
      if (!(waist > 0)) return finish();
      const targetWaist = waist * sizeScale;
      targets.waistCm = targetWaist;
      Object.keys(physique.ratios || {}).forEach(function (key) {
        const ratio = Number(physique.ratios[key]);
        if (ratio > 0) targets[key] = targetWaist * ratio;
      });
      targets.bodyFat = proportionalBodyFatTarget(physique);
      return finish();
    }
    if (physique.id === "old_school") {
      const symmetryValues = [snapshot.armCm, snapshot.neckCm, snapshot.calfCm].map(Number).filter(function (value) { return value > 0; });
      let base = symmetryValues.length ? symmetryValues.reduce(function (sum, value) { return sum + value; }, 0) / symmetryValues.length : 0;
      if (!(base > 0) && Number(snapshot.wristCm) > 0) base = Number(snapshot.wristCm) * 2.4;
      if (!(base > 0)) return finish();
      base *= sizeScale;
      targets.armCm = base;
      targets.neckCm = base;
      targets.calfCm = base;
      targets.chestCm = base * 2.85;
      targets.thighCm = base * 1.45;
      return finish();
    }
    const template = proportionalTemplate(physique);
    if (!template) return finish();
    Object.keys(template).forEach(function (key) {
      if (key === "heightIn") return;
      targets[key] = inchesToCm(template[key]) * range.reference.heightScale * sizeScale;
    });
    targets.bodyFat = proportionalBodyFatTarget(physique);
    return finish();
  }

  function proportionalTargetMarkup(measurement, value, targets) {
    const target = Number(targets[measurement.key]);
    if (!(target > 0)) return "";
    const targetText = measurement.kind === "percent"
      ? core.round(target, 1) + "%"
      : measurement.kind === "weight"
        ? displayWeight(target, 1) + " " + loadUnit()
        : displayLength(target, 1) + " " + lengthUnit();
    return '<span class="measurement-target"><small>TARGET</small><b>' + targetText + '</b></span>';
  }

  function renderProportionalTargets() {
    if (!el.proportionalPhysiqueSelect) return;
    const snapshot = measurementSnapshot();
    const physique = selectedProportionalPhysique();
    const range = proportionalMassRange(snapshot);
    let bias = Math.round(core.clamp(Number(state.settings.proportionalMassBias) || 0, range.minimum, range.maximum));
    state.settings.proportionalMassBias = bias;
    const currentWeightKg = Number(snapshot.weightKg) > 0 ? Number(snapshot.weightKg) : Number(state.profile.bodyWeightKg);
    const targetWeightKg = currentWeightKg * (1 + bias / 100);
    const targetBmi = core.calculateBMI(targetWeightKg, snapshot.heightCm);
    const targets = proportionalTargets(snapshot, bias);

    el.proportionalPhysiqueSelect.innerHTML = allProportionalPhysiques().map(function (item) {
      return '<option value="' + item.id + '"' + (item.id === physique.id ? ' selected' : '') + '>' + escapeHtml(item.name + (item.custom ? " · Custom" : "")) + '</option>';
    }).join("");
    el.proportionalPhysiqueDescription.textContent = physique.description + " Targets are optional comparison templates.";
    el.proportionalMassBias.min = String(range.minimum);
    el.proportionalMassBias.max = String(range.maximum);
    el.proportionalMassBias.value = String(bias);
    el.proportionalMassBiasValue.textContent = (bias > 0 ? "+" : "") + bias + "%";
    el.proportionalTargetWeight.textContent = displayWeight(targetWeightKg, 1) + " " + loadUnit();
    el.proportionalMinimumLabel.textContent = displayWeight(range.minimumWeightKg, 0) + " " + loadUnit();
    el.proportionalCurrentLabel.textContent = "CURRENT WEIGHT · " + displayWeight(currentWeightKg, 0) + " " + loadUnit();
    el.proportionalMaximumLabel.textContent = displayWeight(range.maximumWeightKg, 0) + " " + loadUnit();
    el.proportionalTargetBmi.textContent = "Preview mass: " + displayWeight(targetWeightKg, 1) + " " + loadUnit() + (targetBmi ? " · BMI " + targetBmi : "") + ". Measurement targets update as you move the scale.";

    const span = Math.max(1, range.maximum - range.minimum);
    const currentPercent = core.clamp((0 - range.minimum) / span * 100, 0, 100);
    el.proportionalCurrentMarker.style.left = currentPercent + "%";
    el.proportionalCurrentMarker.classList.toggle("edge-left", currentPercent < 16);
    el.proportionalCurrentMarker.classList.toggle("edge-right", currentPercent > 84);
    el.proportionalCurrentMarkerLabel.textContent = "Current weight · " + displayWeight(currentWeightKg, 0) + " " + loadUnit();
    const markerPercent = core.clamp((range.reference.bias - range.minimum) / span * 100, 0, 100);
    el.proportionalReferenceMarker.style.left = markerPercent + "%";
    el.proportionalReferenceMarker.classList.toggle("edge-left", markerPercent < 16);
    el.proportionalReferenceMarker.classList.toggle("edge-right", markerPercent > 84);
    el.proportionalReferenceMarker.classList.toggle("hidden", !(Number(physique.referenceWeightLb) > 0));
    el.proportionalReferenceMarkerLabel.textContent = range.reference.label + " · " + displayWeight(range.reference.weightKg, 0) + " " + loadUnit();

    const previewMeasurements = measurementDefinitions().filter(function (measurement) { return measurement.key !== "heightCm"; });
    el.proportionalPreviewGrid.innerHTML = previewMeasurements.length ? previewMeasurements.map(function (measurement) {
      const current = Number(snapshot[measurement.key]);
      const targetMarkup = Number(targets[measurement.key]) > 0
        ? proportionalTargetMarkup(measurement, current, targets)
        : '<span class="measurement-target pending"><small>TARGET</small><b>--</b></span>';
      const currentUnit = measurement.kind === "percent" ? "%" : measurement.kind === "weight" ? loadUnit() : lengthUnit();
      const shownCurrent = current > 0
        ? (measurement.kind === "percent" ? core.round(current, 1) : measurement.kind === "weight" ? displayWeight(current, 1) : displayLength(current, 1))
        : "--";
      return '<article class="measurement-card proportional-preview-card"><span class="measurement-label">' + escapeHtml(measurement.label.toUpperCase()) + '</span>' +
        targetMarkup +
        '<strong>' + shownCurrent + '</strong><em>' + currentUnit + '</em><small>LATEST</small></article>';
    }).join("") : '<p class="target-preview-empty">Add the anchor measurement named above to calculate this target set.</p>';
    renderCustomPhysiqueList();
  }

  function weightDisplaySettings() {
    state.settings.weightDisplay = normalizeWeightDisplay(state.settings.weightDisplay);
    return state.settings.weightDisplay;
  }

  function weightViewRange(entries) {
    const now = Date.now();
    if (bodyWeightView === "trajectory") {
      const goalDate = String(state.settings.weightGoalDate || "");
      const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(goalDate) ? new Date(goalDate + "T12:00:00").getTime() : NaN;
      return { entries: entries.slice(-30), startTime: now, endTime: Number.isFinite(goalTime) ? goalTime : now, label: "GOAL" };
    }
    if (bodyWeightView === "full") {
      return {
        entries: entries.slice(),
        startTime: entries.length ? new Date(entries[0].date).getTime() : now,
        endTime: entries.length ? new Date(entries[entries.length - 1].date).getTime() : now,
        label: "ALL"
      };
    }
    const cutoff = now - 7 * 86400000;
    const recent = entries.filter(function (entry) { return new Date(entry.date).getTime() >= cutoff; });
    return { entries: recent, startTime: cutoff, endTime: now, label: "7D" };
  }

  function weightChangeForView(entries, currentWeightKg) {
    const range = weightViewRange(entries);
    if (bodyWeightView === "trajectory") {
      const goal = Number(state.settings.weightGoalKg);
      return goal > 0 ? { differenceKg: goal - currentWeightKg, label: range.label } : null;
    }
    const latest = entries.length ? entries[entries.length - 1] : null;
    if (!latest) return null;
    let baseline = null;
    if (bodyWeightView === "full") baseline = entries[0];
    else {
      baseline = entries.filter(function (entry) { return new Date(entry.date).getTime() <= range.startTime; }).at(-1) || range.entries[0];
    }
    if (!baseline || baseline.id === latest.id) return null;
    return { differenceKg: Number(latest.weightKg) - Number(baseline.weightKg), label: range.label };
  }

  function requiredWeightChangeMetrics(currentWeightKg) {
    const goalKg = Number(state.settings.weightGoalKg);
    const goalDate = String(state.settings.weightGoalDate || "");
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(goalDate) ? new Date(goalDate + "T12:00:00").getTime() : NaN;
    if (!(goalKg > 0) || !Number.isFinite(goalTime) || goalTime <= Date.now()) return null;
    const differenceKg = goalKg - currentWeightKg;
    const days = Math.max(1, (goalTime - Date.now()) / 86400000);
    return {
      goalKg: goalKg,
      goalTime: goalTime,
      differenceKg: differenceKg,
      dailyKg: differenceKg / days,
      weeklyKg: differenceKg / days * 7
    };
  }

  function weightActionText(valueKg, period) {
    const display = Math.abs(core.kgToDisplay(valueKg, state.profile.units));
    if (display < 0.01) return "Maintain goal";
    return (valueKg < 0 ? "Lose " : "Gain ") + core.round(display, period === "day" ? 2 : 1) + " " + loadUnit() + (period ? "/" + period : "");
  }

  function renderWeightMetrics(currentWeightKg, change) {
    const display = weightDisplaySettings();
    const required = requiredWeightChangeMetrics(currentWeightKg);
    const metrics = [];
    if (display.currentWeight) metrics.push({ label: "CURRENT", value: displayWeight(currentWeightKg, 1) + " " + loadUnit() });
    if (display.change) {
      metrics.push({
        label: (change && change.label ? change.label + " CHANGE" : "CHANGE"),
        value: change ? (change.differenceKg > 0 ? "+" : change.differenceKg < 0 ? "-" : "") + core.round(Math.abs(core.kgToDisplay(change.differenceKg, state.profile.units)), 1) + " " + loadUnit() : "--"
      });
    }
    if (display.goalGap) metrics.push({
      label: "TO GOAL",
      value: required ? weightActionText(required.differenceKg) : "Set a goal"
    });
    if (display.dailyRate) metrics.push({ label: "NEEDED DAILY", value: required ? weightActionText(required.dailyKg, "day") : "Set a goal" });
    if (display.weeklyRate) metrics.push({ label: "NEEDED WEEKLY", value: required ? weightActionText(required.weeklyKg, "week") : "Set a goal" });
    el.weightMetricGrid.innerHTML = metrics.map(function (metric) {
      return '<span><small>' + escapeHtml(metric.label) + '</small><strong>' + escapeHtml(metric.value) + '</strong></span>';
    }).join("");
    el.weightMetricGrid.classList.toggle("hidden", !metrics.length);
  }

  function renderMeasurementDisplayOptions() {
    const display = weightDisplaySettings();
    el.measurementDisplayOptions.querySelectorAll("[data-weight-display]").forEach(function (button) {
      const active = display[button.dataset.weightDisplay] !== false;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function weightTrendPoints(entries, startTime, endTime) {
    if (entries.length < 2 || !(endTime > startTime)) return [];
    const samples = entries.map(function (entry) {
      return { x: (new Date(entry.date).getTime() - startTime) / 86400000, y: core.kgToDisplay(entry.weightKg, state.profile.units) };
    });
    const meanX = samples.reduce(function (sum, point) { return sum + point.x; }, 0) / samples.length;
    const meanY = samples.reduce(function (sum, point) { return sum + point.y; }, 0) / samples.length;
    const variance = samples.reduce(function (sum, point) { return sum + Math.pow(point.x - meanX, 2); }, 0);
    if (!(variance > 0)) return [];
    const slope = samples.reduce(function (sum, point) { return sum + (point.x - meanX) * (point.y - meanY); }, 0) / variance;
    const intercept = meanY - slope * meanX;
    const endX = (endTime - startTime) / 86400000;
    return [
      { time: startTime, value: Math.max(0.1, intercept) },
      { time: endTime, value: Math.max(0.1, intercept + slope * endX) }
    ];
  }

  function renderBody() {
    const entries = weightMeasurements();
    const latest = latestMeasurement();
    const snapshot = measurementSnapshot();
    const currentWeightKg = entries.length ? entries[entries.length - 1].weightKg : state.profile.bodyWeightKg;
    const currentHeightCm = snapshot.heightCm;
    const bmi = core.calculateBMI(currentWeightKg, currentHeightCm);
    const tapeBodyFat = core.estimateTapeBodyFat(
      state.profile.standard,
      currentHeightCm,
      snapshot.waistCm,
      snapshot.neckCm,
      snapshot.hipCm
    );
    const bodyFat = Number(snapshot.bodyFat) > 0 ? Number(snapshot.bodyFat) : tapeBodyFat;
    const display = weightDisplaySettings();
    el.currentBodyWeight.textContent = displayWeight(currentWeightKg, 1);
    el.bodyWeightUnit.textContent = loadUnit();
    el.currentWeightViewButton.querySelector("div").classList.toggle("hidden", !display.currentWeight);
    el.bmiValue.textContent = bmi || "--";
    el.bmiCategory.textContent = bmi ? core.bmiCategory(bmi) : "Add your height";
    el.bodyFatValue.textContent = bodyFat ? core.round(bodyFat, 1) + "%" : "--";
    el.bodyFatCategory.textContent = bodyFat
      ? (snapshot.bodyFatSource === "manual" ? "Manual entry" : "Tape estimate")
      : (state.profile.standard === "female" ? "Needs waist, neck, and hips" : "Needs waist and neck");

    const weightViewDetails = {
      recent: { title: "Past 7 days", description: "Your most recent week of weigh-ins", hint: "Tap for trajectory" },
      trajectory: { title: "Trajectory", description: "Required path compared with your current trend", hint: "Tap for full timeline" },
      full: { title: "Full timeline", description: "Every saved body-weight entry", hint: "Tap for past 7 days" }
    };
    const view = weightViewDetails[bodyWeightView] || weightViewDetails.recent;
    el.weightChartTitle.textContent = view.title;
    el.weightChartDescription.textContent = view.description;
    el.weightViewTapHint.textContent = view.hint;
    const weightLegendItems = el.weightTrajectoryLegend.querySelectorAll("span");
    if (bodyWeightView === "trajectory") {
      weightLegendItems[0].lastChild.textContent = "Needed to goal";
      weightLegendItems[1].lastChild.textContent = "Current trajectory";
      weightLegendItems[1].classList.toggle("hidden", !display.trendline);
      el.weightTrajectoryLegend.classList.remove("hidden");
    } else {
      weightLegendItems[0].lastChild.textContent = "Saved weight";
      weightLegendItems[1].lastChild.textContent = "Trendline";
      weightLegendItems[1].classList.remove("hidden");
      el.weightTrajectoryLegend.classList.toggle("hidden", !display.trendline);
    }
    const goalSet = Number(state.settings.weightGoalKg) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(String(state.settings.weightGoalDate || ""));
    el.openWeightGoalFromBody.textContent = goalSet
      ? "Goal: " + displayWeight(state.settings.weightGoalKg, 1) + " " + loadUnit() + " by " + dateLabel(state.settings.weightGoalDate + "T12:00:00", false) + " · Edit"
      : "Set a weight goal";

    const change = weightChangeForView(entries, currentWeightKg);
    if (change) {
      const difference = core.kgToDisplay(Math.abs(change.differenceKg), state.profile.units);
      el.bodyWeightChange.textContent = change.label + " " + (change.differenceKg > 0 ? "+" : change.differenceKg < 0 ? "-" : "") + core.round(difference, 1) + " " + loadUnit();
      el.bodyWeightChange.className = "change-pill " + (change.differenceKg > 0 ? "positive" : change.differenceKg < 0 ? "negative" : "neutral");
    } else {
      el.bodyWeightChange.textContent = (bodyWeightView === "full" ? "ALL" : bodyWeightView === "trajectory" ? "GOAL" : "7D") + " --";
      el.bodyWeightChange.className = "change-pill neutral";
    }
    el.bodyWeightChange.classList.toggle("hidden", !display.change);
    const range = weightViewRange(entries);
    el.weightStartDate.textContent = "START " + (Number.isFinite(range.startTime) ? dateLabel(new Date(range.startTime).toISOString(), false) : "--");
    el.weightEndDate.textContent = "END " + (Number.isFinite(range.endTime) ? dateLabel(new Date(range.endTime).toISOString(), false) : "--");
    el.weightStartDate.classList.toggle("hidden", !display.startDate);
    el.weightEndDate.classList.toggle("hidden", !display.endDate);
    el.weightDateRange.classList.toggle("hidden", !display.startDate && !display.endDate);
    el.weightXAxisLabel.classList.toggle("hidden", !display.xAxis);
    el.weightYAxisLabel.textContent = "WEIGHT (" + loadUnit().toUpperCase() + ")";
    el.weightYAxisLabel.classList.toggle("hidden", !display.yAxis);
    el.weightAxisCopy.classList.toggle("hidden", !display.xAxis && !display.yAxis);
    renderWeightMetrics(currentWeightKg, change);
    renderMeasurementDisplayOptions();

    el.measurementDate.textContent = latest ? dateLabel(latest.date, false) : "No entry";
    const targets = proportionalTargets(snapshot);
    el.measurementGrid.innerHTML = MEASUREMENTS.map(function (measurement) {
      let value = snapshot[measurement.key];
      if (measurement.key === "bodyFat" && !(Number(value) > 0)) value = tapeBodyFat;
      const shown = Number(value) > 0
        ? (measurement.kind === "percent" ? core.round(value, 1) : displayLength(value, 1))
        : "--";
      const unit = measurement.kind === "percent" ? "%" : lengthUnit();
      return '<article class="measurement-card"><button class="measurement-update-button" type="button" data-quick-measurement="' + measurement.key + '" aria-label="Update ' + escapeHtml(measurement.label.toLowerCase()) + '">' +
        '<span class="measurement-label">' + escapeHtml(measurement.label.toUpperCase()) + '</span>' + proportionalTargetMarkup(measurement, value, targets) +
        '<strong>' + shown + '</strong><em>' + unit + '</em><small>Update</small></button></article>';
    }).join("");

    setSegment(el.unitsSetting, state.profile.units);
    setSegment(el.standardSetting, state.profile.standard);
    renderProportionalTargets();
    renderMeasurementHistory();
    setTimeout(drawWeightChart, 30);
  }

  function drawWeightChart() {
    const entries = weightMeasurements();
    const display = weightDisplaySettings();
    const range = weightViewRange(entries);
    const accent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#B9F64A";
    const chartOptions = {
      showGrid: true,
      showXLabels: display.xAxis,
      showYLabels: display.yAxis,
      valueFormatter: function (value) { return core.round(value, 1) + " " + loadUnit(); }
    };
    if (bodyWeightView !== "trajectory") {
      const actualPoints = range.entries.map(function (entry) {
        return { time: new Date(entry.date).getTime(), value: core.kgToDisplay(entry.weightKg, state.profile.units) };
      });
      const trendPoints = display.trendline ? weightTrendPoints(range.entries, range.startTime, range.endTime) : [];
      drawDatedSeriesChart(el.weightChart, [
        { points: actualPoints, color: accent, width: 5 },
        { points: trendPoints, color: "#59A8FF", width: 3, dash: [10, 7] }
      ], el.chartEmpty, bodyWeightView === "recent"
        ? "Log weight twice within 7 days to see this graph."
        : "Log weight twice to see your full timeline.", chartOptions);
      return;
    }
    const goalKg = Number(state.settings.weightGoalKg);
    const goalDate = String(state.settings.weightGoalDate || "");
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(goalDate) ? new Date(goalDate + "T12:00:00").getTime() : NaN;
    const now = Date.now();
    const currentKg = entries.length ? Number(entries[entries.length - 1].weightKg) : Number(state.profile.bodyWeightKg);
    if (!(goalKg > 0) || !Number.isFinite(goalTime) || goalTime <= now || !(currentKg > 0)) {
      drawDatedSeriesChart(el.weightChart, [], el.chartEmpty, "Set a future weight goal in Settings to see trajectory.");
      return;
    }
    const goalPoints = [
      { time: now, value: core.kgToDisplay(currentKg, state.profile.units) },
      { time: goalTime, value: core.kgToDisplay(goalKg, state.profile.units) }
    ];
    const trendEntries = entries.slice(-30);
    const trendPoints = display.trendline ? weightTrendPoints(trendEntries, now, goalTime) : [];
    drawDatedSeriesChart(el.weightChart, [
      { points: goalPoints, color: accent, width: 5 },
      { points: trendPoints, color: "#59A8FF", width: 4, dash: [12, 8] }
    ], el.chartEmpty, trendEntries.length < 2 ? "Log weight twice to calculate your current trajectory." : "Set a future weight goal in Settings.", chartOptions);
  }

  function currentWeightKgValue() {
    const entries = weightMeasurements();
    return entries.length ? Number(entries[entries.length - 1].weightKg) : Number(state.profile.bodyWeightKg);
  }

  function isoDateAfterDays(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function updateWeightGoalPreview() {
    const displayGoal = Number(el.weightGoalInput.value);
    const goalKg = displayGoal > 0 ? core.displayToKg(displayGoal, state.profile.units) : 0;
    const dateText = el.weightGoalDateInput.value;
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(dateText) ? new Date(dateText + "T12:00:00").getTime() : NaN;
    const currentKg = currentWeightKgValue();
    if (!(goalKg > 0) || !Number.isFinite(goalTime) || goalTime <= Date.now()) {
      el.weightGoalPreview.textContent = "Choose a target weight and a future date.";
      return;
    }
    const days = Math.max(1, Math.ceil((goalTime - Date.now()) / 86400000));
    const difference = core.kgToDisplay(goalKg - currentKg, state.profile.units);
    const perWeek = difference / days * 7;
    el.weightGoalPreview.textContent = (difference > 0 ? "+" : "") + core.round(difference, 1) + " " + loadUnit() + " over " + days + " days · " + (perWeek > 0 ? "+" : "") + core.round(perWeek, 2) + " " + loadUnit() + " per week";
  }

  function openWeightGoalEditor() {
    const currentKg = currentWeightKgValue();
    el.weightGoalCurrentValue.textContent = displayWeight(currentKg, 1) + " " + loadUnit();
    el.weightGoalUnit.textContent = loadUnit().toUpperCase();
    el.weightGoalInput.value = Number(state.settings.weightGoalKg) > 0 ? displayWeight(state.settings.weightGoalKg, 1) : displayWeight(currentKg, 1);
    el.weightGoalDateInput.min = isoDateAfterDays(1);
    el.weightGoalDateInput.value = /^\d{4}-\d{2}-\d{2}$/.test(String(state.settings.weightGoalDate || "")) ? state.settings.weightGoalDate : isoDateAfterDays(90);
    el.clearWeightGoalButton.classList.toggle("hidden", !(Number(state.settings.weightGoalKg) > 0));
    updateWeightGoalPreview();
    openModal("weightGoalModal");
  }

  function saveWeightGoal() {
    const displayGoal = Number(el.weightGoalInput.value);
    const goalKg = core.displayToKg(displayGoal, state.profile.units);
    const goalDate = String(el.weightGoalDateInput.value || "");
    const goalTime = /^\d{4}-\d{2}-\d{2}$/.test(goalDate) ? new Date(goalDate + "T12:00:00").getTime() : NaN;
    if (!(displayGoal > 0)) {
      showToast("Enter a goal weight greater than zero.");
      return;
    }
    if (!Number.isFinite(goalTime) || goalTime <= Date.now()) {
      showToast("Choose a future goal date.");
      return;
    }
    state.settings.weightGoalKg = goalKg;
    state.settings.weightGoalDate = goalDate;
    bodyWeightView = "trajectory";
    saveState();
    closeModal("weightGoalModal");
    renderAll();
    showToast("Weight goal saved.");
  }

  function clearWeightGoal() {
    state.settings.weightGoalKg = null;
    state.settings.weightGoalDate = "";
    bodyWeightView = "recent";
    saveState();
    closeModal("weightGoalModal");
    renderAll();
    showToast("Weight goal cleared.");
  }

  function openMeasurements() {
    const latest = measurementSnapshot();
    const fields = [
      { key: "weightKg", label: "Body weight", kind: "weight", value: latest.weightKg || state.profile.bodyWeightKg },
      { key: "heightCm", label: "Height", kind: "length", value: latest.heightCm || state.profile.heightCm },
      { key: "bodyFat", label: "Body fat, optional", kind: "percent", value: latest.bodyFat },
      { key: "waistCm", label: "Waist", kind: "length", value: latest.waistCm },
      { key: "neckCm", label: "Neck", kind: "length", value: latest.neckCm },
      { key: "hipCm", label: "Hips", kind: "length", value: latest.hipCm },
      { key: "shoulderCm", label: "Shoulders", kind: "length", value: latest.shoulderCm },
      { key: "wristCm", label: "Wrist", kind: "length", value: latest.wristCm },
      { key: "chestCm", label: "Chest", kind: "length", value: latest.chestCm },
      { key: "armCm", label: "Upper arm", kind: "length", value: latest.armCm },
      { key: "forearmCm", label: "Forearm", kind: "length", value: latest.forearmCm },
      { key: "thighCm", label: "Thigh", kind: "length", value: latest.thighCm },
      { key: "calfCm", label: "Calf", kind: "length", value: latest.calfCm }
    ];
    el.measurementForm.innerHTML = fields.map(function (field) {
      const value = Number(field.value) > 0
        ? (field.kind === "weight" ? displayWeight(field.value, 1) : field.kind === "length" ? displayLength(field.value, 1) : core.round(field.value, 1))
        : "";
      const unit = field.kind === "weight" ? loadUnit() : field.kind === "length" ? lengthUnit() : "%";
      return '<div class="measurement-field-wrap"><label class="measurement-field"><span>' + escapeHtml(field.label) + ' (' + unit + ')</span><input data-measurement-key="' + field.key + '" data-kind="' + field.kind + '" type="number" inputmode="decimal" min="0" value="' + value + '" /></label><small class="measurement-field-instruction">' + escapeHtml(measurementInstruction(field.key)) + '</small></div>';
    }).join("");
    openModal("measurementModal");
  }

  function renderQuickMeasurementProgress() {
    const measurement = MEASUREMENTS.find(function (item) { return item.key === activeQuickMeasurementKey; });
    if (!measurement || (measurement.kind !== "length" && measurement.kind !== "percent")) {
      el.quickMeasurementProgress.classList.add("hidden");
      return;
    }
    const snapshot = measurementSnapshot();
    const displayValue = Number(el.quickMeasurementInput.value);
    const currentValue = Number.isFinite(displayValue) && displayValue > 0
      ? (measurement.kind === "length" ? core.displayToCm(displayValue, state.profile.units) : displayValue)
      : 0;
    if (currentValue > 0) snapshot[measurement.key] = currentValue;
    const target = Number(proportionalTargets(snapshot)[measurement.key]);
    const unit = measurement.kind === "percent" ? "%" : lengthUnit();
    const displayTarget = measurement.kind === "percent" ? core.round(target, 1) : displayLength(target, 1);
    if (!(target > 0)) {
      el.quickMeasurementProgress.classList.remove("hidden");
      el.quickMeasurementTargetValue.textContent = "-- " + unit;
      el.quickMeasurementProgressFill.style.width = "0%";
      el.quickMeasurementProgressFill.classList.remove("reached");
      el.quickMeasurementProgressTrack.setAttribute("aria-valuenow", "0");
      el.quickMeasurementProgressCopy.textContent = "Enter this measurement to calculate its target.";
      return;
    }
    const ratio = currentValue > 0 ? currentValue / target : 0;
    const difference = currentValue > 0 ? Math.abs(currentValue - target) : 0;
    el.quickMeasurementProgress.classList.remove("hidden");
    el.quickMeasurementTargetValue.textContent = displayTarget + " " + unit;
    el.quickMeasurementProgressFill.style.width = core.clamp(ratio * 100, 0, 100) + "%";
    el.quickMeasurementProgressFill.classList.toggle("reached", ratio >= 1);
    el.quickMeasurementProgressTrack.setAttribute("aria-valuenow", String(Math.round(core.clamp(ratio * 100, 0, 100))));
    el.quickMeasurementProgressCopy.textContent = currentValue > 0
      ? (difference < 0.1 ? "You are at this target." : (measurement.kind === "percent" ? core.round(difference, 1) : displayLength(difference, 1)) + " " + unit + " from this target.")
      : "Add a value to compare it with your target.";
  }

  function openQuickMeasurement(key) {
    const measurement = MEASUREMENTS.find(function (item) { return item.key === key; });
    if (!measurement) return;
    activeQuickMeasurementKey = key;
    const snapshot = measurementSnapshot();
    let value = snapshot[key];
    if (key === "bodyFat" && !(Number(value) > 0)) {
      value = core.estimateTapeBodyFat(state.profile.standard, snapshot.heightCm, snapshot.waistCm, snapshot.neckCm, snapshot.hipCm);
    }
    const displayValue = Number(value) > 0
      ? (measurement.kind === "length" ? displayLength(value, 1) : core.round(value, 1))
      : "";
    const unit = measurement.kind === "length" ? lengthUnit() : "%";
    el.quickMeasurementTitle.textContent = "Update " + measurement.label.toLowerCase();
    el.quickMeasurementLabel.textContent = measurement.label + " (" + unit + ")";
    el.quickMeasurementUnit.textContent = unit.toUpperCase();
    el.quickMeasurementInput.value = displayValue;
    el.quickMeasurementInstruction.textContent = measurementInstruction(measurement.key);
    openModal("quickMeasurementModal");
    renderQuickMeasurementProgress();
    setTimeout(function () { el.quickMeasurementInput.focus(); }, 80);
  }

  function saveQuickMeasurement() {
    const measurement = MEASUREMENTS.find(function (item) { return item.key === activeQuickMeasurementKey; });
    const value = Number(el.quickMeasurementInput.value);
    if (!measurement || !Number.isFinite(value) || value <= 0) {
      showToast("Enter a value greater than zero.");
      return;
    }
    if (measurement.kind === "percent" && value > 70) {
      showToast("Enter a body-fat value from 1 to 70 percent.");
      return;
    }
    const entry = { id: uid("measurement"), date: new Date().toISOString() };
    entry[measurement.key] = measurement.kind === "length" ? core.displayToCm(value, state.profile.units) : value;
    if (measurement.key === "bodyFat") entry.bodyFatSource = "manual";
    if (measurement.key === "heightCm") state.profile.heightCm = entry.heightCm;
    state.measurements.push(entry);
    saveState();
    renderAll();
    closeModal("quickMeasurementModal");
    showToast(measurement.label + " updated.");
  }

  function saveMeasurements() {
    const entry = { id: uid("measurement"), date: new Date().toISOString() };
    let anyValue = false;
    el.measurementForm.querySelectorAll("input[data-measurement-key]").forEach(function (input) {
      const value = Number(input.value);
      if (!Number.isFinite(value) || value <= 0) return;
      anyValue = true;
      if (input.dataset.kind === "weight") entry[input.dataset.measurementKey] = core.displayToKg(value, state.profile.units);
      else if (input.dataset.kind === "length") entry[input.dataset.measurementKey] = core.displayToCm(value, state.profile.units);
      else entry[input.dataset.measurementKey] = value;
    });
    if (!anyValue) {
      showToast("Enter at least one measurement.");
      return;
    }
    if (entry.weightKg) state.profile.bodyWeightKg = entry.weightKg;
    if (entry.heightCm) state.profile.heightCm = entry.heightCm;
    if (entry.bodyFat) {
      entry.bodyFatSource = "manual";
    } else {
      const estimate = core.estimateTapeBodyFat(
        state.profile.standard,
        entry.heightCm || state.profile.heightCm,
        entry.waistCm,
        entry.neckCm,
        entry.hipCm
      );
      if (estimate) {
        entry.bodyFat = estimate;
        entry.bodyFatSource = "tape";
      }
    }
    state.measurements.push(entry);
    saveState();
    renderAll();
    closeModal("measurementModal");
    showToast("Measurements saved.");
  }

  function datetimeLocalValue(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }

  function syncProfileFromMeasurementHistory() {
    const ordered = state.measurements.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    const latestWeight = ordered.filter(function (entry) { return Number(entry.weightKg) > 0; }).at(-1);
    const latestHeight = ordered.filter(function (entry) { return Number(entry.heightCm) > 0; }).at(-1);
    if (latestWeight) state.profile.bodyWeightKg = Number(latestWeight.weightKg);
    if (latestHeight) state.profile.heightCm = Number(latestHeight.heightCm);
  }

  function openMeasurementHistoryEdit(entryId) {
    const entry = state.measurements.find(function (item) { return item.id === entryId; });
    if (!entry) return;
    activeMeasurementHistoryId = entry.id;
    el.measurementHistoryDate.value = datetimeLocalValue(entry.date);
    const fields = measurementDefinitions().filter(function (definition) { return Number(entry[definition.key]) > 0; });
    el.measurementHistoryEditForm.innerHTML = fields.map(function (field) {
      const value = field.kind === "weight"
        ? displayWeight(entry[field.key], 1)
        : field.kind === "length"
          ? displayLength(entry[field.key], 1)
          : core.round(entry[field.key], 1);
      const unit = field.kind === "weight" ? loadUnit() : field.kind === "length" ? lengthUnit() : "%";
      return '<div class="measurement-field-wrap"><label class="measurement-field"><span>' + escapeHtml(field.label) + ' (' + unit + ')</span><input data-history-measurement-key="' + field.key + '" data-kind="' + field.kind + '" type="number" inputmode="decimal" min="0" value="' + value + '" /></label><small class="measurement-field-instruction">' + escapeHtml(measurementInstruction(field.key)) + '</small></div>';
    }).join("");
    openModal("measurementHistoryEditModal");
  }

  function saveMeasurementHistoryEdit() {
    const index = state.measurements.findIndex(function (entry) { return entry.id === activeMeasurementHistoryId; });
    if (index < 0) return;
    const date = new Date(el.measurementHistoryDate.value);
    if (Number.isNaN(date.getTime())) {
      showToast("Choose a valid date and time.");
      return;
    }
    const original = state.measurements[index];
    const updated = { id: original.id, date: date.toISOString() };
    let valid = true;
    let count = 0;
    el.measurementHistoryEditForm.querySelectorAll("input[data-history-measurement-key]").forEach(function (input) {
      const value = Number(input.value);
      if (!(value > 0) || (input.dataset.kind === "percent" && value > 70)) {
        valid = false;
        return;
      }
      count += 1;
      if (input.dataset.kind === "weight") updated[input.dataset.historyMeasurementKey] = core.displayToKg(value, state.profile.units);
      else if (input.dataset.kind === "length") updated[input.dataset.historyMeasurementKey] = core.displayToCm(value, state.profile.units);
      else updated[input.dataset.historyMeasurementKey] = value;
    });
    if (!valid || !count) {
      showToast("Every saved value must be greater than zero. Body fat must be 70% or less.");
      return;
    }
    if (Number(updated.bodyFat) > 0) updated.bodyFatSource = original.bodyFatSource || "manual";
    state.measurements[index] = updated;
    syncProfileFromMeasurementHistory();
    saveState();
    renderAll();
    closeModal("measurementHistoryEditModal");
    showToast("Measurement history updated.");
  }

  function deleteMeasurementHistoryEntry() {
    const entry = state.measurements.find(function (item) { return item.id === activeMeasurementHistoryId; });
    if (!entry) return;
    askConfirm({
      title: "Delete this measurement entry?",
      message: "This removes the saved values from " + dateTimeLabel(entry.date, true) + ". Your other measurement history stays intact.",
      button: "Delete"
    }, function () {
      state.measurements = state.measurements.filter(function (item) { return item.id !== entry.id; });
      activeMeasurementHistoryId = null;
      syncProfileFromMeasurementHistory();
      saveState();
      renderAll();
      closeModal("measurementHistoryEditModal");
      showToast("Measurement entry deleted.");
    });
  }

  function setSetupHeightFields(heightCm, units) {
    const cm = Number(heightCm) > 0 ? Number(heightCm) : core.displayToCm(69, "lb");
    if (units === "kg") {
      el.setupHeightCm.value = core.round(cm, 1);
      el.setupHeightMetric.classList.remove("hidden");
      el.setupHeightImperial.classList.add("hidden");
      return;
    }
    const totalInches = core.cmToDisplay(cm, "lb");
    let feet = Math.floor(totalInches / 12);
    let inches = core.round(totalInches - feet * 12, 1);
    if (inches >= 12) {
      feet += 1;
      inches = 0;
    }
    el.setupHeightFeet.value = feet;
    el.setupHeightInches.value = inches;
    el.setupHeightImperial.classList.remove("hidden");
    el.setupHeightMetric.classList.add("hidden");
  }

  function setupHeightCmValue(units) {
    if (units === "kg") {
      const centimeters = Number(el.setupHeightCm.value);
      return Number.isFinite(centimeters) && centimeters > 0 ? centimeters : null;
    }
    const feet = Number(el.setupHeightFeet.value);
    const inches = Number(el.setupHeightInches.value);
    if (!Number.isFinite(feet) || feet <= 0 || !Number.isFinite(inches) || inches < 0 || inches >= 12) return null;
    return core.displayToCm(feet * 12 + inches, "lb");
  }

  function showSetupStep(step) {
    setupCurrentStep = step === 2 || step === 3 ? step : 1;
    const profileStep = setupCurrentStep === 1;
    const locationStep = setupCurrentStep === 2;
    const physiqueStep = setupCurrentStep === 3;
    el.setupProfileStep.classList.toggle("hidden", !profileStep);
    el.setupLocationStep.classList.toggle("hidden", !locationStep);
    el.setupPhysiqueStep.classList.toggle("hidden", !physiqueStep);
    el.setupStepLabel.textContent = "STEP " + setupCurrentStep + " OF 3";
    el.setupTitle.textContent = profileStep ? "Start with your profile." : (locationStep ? "Where do you train?" : "What is your ideal physique?");
    el.setupCopy.textContent = profileStep
      ? "These three details set your strength and body-weight comparisons."
      : (locationStep
        ? "Pick every place you use. Foss Gym will only show exercises that fit the equipment there."
        : "Choose the proportional reference you want to emulate. You can change it whenever you want.");
    el.setupModal.scrollTop = 0;
  }

  function setupPhysiqueById(id) {
    return allProportionalPhysiques().find(function (item) { return item.id === id; }) || PROPORTIONAL_PHYSIQUES[0];
  }

  function updateSetupPhysiquePreview() {
    const physique = setupPhysiqueById(el.setupPhysiqueSelect.value);
    el.setupPhysiqueName.textContent = physique.name;
    el.setupPhysiqueDescription.textContent = physique.description;
  }

  function renderSetupPhysiques() {
    const selected = setupPhysiqueById(state.settings.proportionalPhysique);
    el.setupPhysiqueSelect.innerHTML = allProportionalPhysiques().map(function (item) {
      return '<option value="' + item.id + '">' + escapeHtml(item.name + (item.custom ? " · Custom" : "")) + '</option>';
    }).join("");
    el.setupPhysiqueSelect.value = selected.id;
    updateSetupPhysiquePreview();
  }

  function validateSetupProfile() {
    const unitsButton = el.setupUnits.querySelector("button.active");
    const units = unitsButton ? unitsButton.dataset.value : "lb";
    const weight = Number(el.setupWeight.value);
    const heightCm = setupHeightCmValue(units);
    if (!Number.isFinite(weight) || weight <= 0) {
      showToast("Enter your body weight.");
      return false;
    }
    if (!(heightCm > 0)) {
      showToast(units === "kg" ? "Enter your height in centimeters." : "Enter feet and 0 to 11.9 inches.");
      return false;
    }
    return true;
  }

  function advanceSetup() {
    if (!validateSetupProfile()) return;
    showSetupStep(2);
  }

  function validateSetupLocations() {
    if (!setupLocationDraft.length) {
      showToast("Choose at least one training location.");
      return false;
    }
    const missingEquipmentLocation = setupLocationDraft.find(function (locationId) {
      return locationId !== "home" && !(setupLocationEquipmentDraft[locationId] || []).length;
    });
    if (missingEquipmentLocation) {
      showToast("Choose equipment for " + locationById(missingEquipmentLocation).name + ".");
      openEquipmentEditor(missingEquipmentLocation, true);
      return false;
    }
    return true;
  }

  function advanceSetupLocations() {
    if (!validateSetupLocations()) return;
    showSetupStep(3);
  }

  function openSetup(editMode) {
    setupIsEdit = Boolean(editMode);
    const units = state.profile.units || "lb";
    setupLocationDraft = normalizeLocationIds(state.settings.availableLocations);
    setupLocationEquipmentDraft = normalizeLocationEquipment(state.settings.locationEquipment);
    setupCustomEquipmentDraft = normalizeCustomEquipment(state.settings.customEquipment);
    setupEquipmentPreferenceDraft = state.settings.equipmentPreference || "none";
    el.setupWeight.value = displayWeight(state.profile.bodyWeightKg, 1);
    setSetupHeightFields(state.profile.heightCm, units);
    setSegment(el.setupUnits, units);
    setSegment(el.setupStandard, state.profile.standard || "male");
    setSegment(el.setupEquipmentPreference, setupEquipmentPreferenceDraft);
    renderSetupLocations();
    renderSetupPhysiques();
    el.finishSetupButton.textContent = setupIsEdit ? "Save profile" : "Start tracking";
    showSetupStep(1);
    openModal("setupModal");
  }

  function finishSetup() {
    const unitsButton = el.setupUnits.querySelector("button.active");
    const standardButton = el.setupStandard.querySelector("button.active");
    const units = unitsButton ? unitsButton.dataset.value : "lb";
    const standard = standardButton ? standardButton.dataset.value : "male";
    const weight = Number(el.setupWeight.value);
    const heightCm = setupHeightCmValue(units);
    if (!validateSetupProfile()) {
      showSetupStep(1);
      return;
    }
    if (!validateSetupLocations()) {
      showSetupStep(2);
      return;
    }
    state.profile.units = units;
    state.profile.standard = standard;
    state.profile.bodyWeightKg = core.displayToKg(weight, units);
    state.profile.heightCm = heightCm;
    state.profile.onboarded = true;
    state.settings.availableLocations = normalizeLocationIds(setupLocationDraft);
    state.settings.locationEquipment = normalizeLocationEquipment(setupLocationEquipmentDraft);
    state.settings.customEquipment = normalizeCustomEquipment(setupCustomEquipmentDraft);
    state.settings.equipmentPreference = setupEquipmentPreferenceDraft;
    state.settings.proportionalPhysique = setupPhysiqueById(el.setupPhysiqueSelect.value).id;
    state.settings.activeLocation = state.settings.availableLocations.includes(state.settings.activeLocation)
      ? state.settings.activeLocation
      : state.settings.availableLocations[0];
    state.settings.locationSetupComplete = true;
    if (!state.measurements.length) {
      state.measurements.push({ id: uid("measurement"), date: new Date().toISOString(), weightKg: state.profile.bodyWeightKg, heightCm: state.profile.heightCm });
    }
    saveState();
    closeModal("setupModal");
    renderAll();
    showToast(setupIsEdit ? "Profile updated." : "You are ready. Tap any muscle card to start.");
  }

  function renderAll() {
    applyAppearance();
    renderActiveLocationSelector();
    renderStrength();
    renderWorkouts();
    renderDashboard();
    renderCardio();
    renderBody();
    renderSettings();
    scheduleWidgetSync();
    scheduleDonationReminder();
  }

  function exerciseArtFor(exercise) {
    if (exercise && window.FossExerciseIcons && window.FossExerciseIcons.has(exercise.id)) {
      return window.FossExerciseIcons.get(exercise.id);
    }
    return exerciseArt(exercise && exercise.motion, exercise && exercise.customIcon, exercise && exercise.customIconWidth);
  }

  function exerciseArt(motion, customIcon, customIconWidth) {
    if (motion === "custom" && normalizeIconStrokes(customIcon, customIconWidth).length) return drawnPlanIconArt(customIcon, customIconWidth);
    const common = 'viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
    const art = {
      press: '<svg ' + common + '><path d="M8 45h47M15 45V34h27v11M22 33l8-8 13 2M9 19h46M13 15v8M51 15v8"/><circle cx="25" cy="25" r="4"/><path d="M30 25l7-6 8 1"/></svg>',
      row: '<svg ' + common + '><circle cx="27" cy="15" r="5"/><path d="M25 21l-9 14 17 3 9-13M18 34l-5 15M31 38l8 12M9 48h38M16 30l21 5M37 30v10M33 30h8"/></svg>',
      pull: '<svg ' + common + '><path d="M9 9h46M13 6v6M51 6v6"/><circle cx="32" cy="21" r="5"/><path d="M29 26l-4 12 7 12M35 26l4 12-7 12M27 28l-9-10M37 28l9-10"/></svg>',
      shoulder: '<svg ' + common + '><circle cx="32" cy="23" r="5"/><path d="M32 28v17M32 34l-10-9M32 34l10-9M26 45l-6 11M38 45l6 11M12 14h40M16 10v8M48 10v8M22 25l-6-11M42 25l6-11"/></svg>',
      shrug: '<svg ' + common + '><circle cx="32" cy="13" r="5"/><path d="M32 18v22M21 24l11-5 11 5M21 24l-7 16M43 24l7 16M13 40h38M17 36v8M47 36v8M32 40l-8 16M32 40l8 16"/></svg>',
      curl: '<svg ' + common + '><circle cx="32" cy="13" r="5"/><path d="M32 18v18M32 23l-10 7 4 8M32 23l10 7-4 8M26 36l-7-4M38 36l7-4M23 40h18M32 36l-8 20M32 36l8 20"/></svg>',
      triceps: '<svg ' + common + '><path d="M8 46h47M15 46V34h27v12M21 33l8-8 13 2"/><circle cx="25" cy="25" r="4"/><path d="M30 25l7-3M35 22l2-11M37 11l9 4M42 12l3 6"/></svg>',
      pushup: '<svg ' + common + '><circle cx="45" cy="23" r="4"/><path d="M41 25L26 31 15 42M27 31l16 7M43 38l8 11M15 42l-5 8M11 51h44M25 32l-4 13"/></svg>',
      dip: '<svg ' + common + '><circle cx="32" cy="14" r="5"/><path d="M32 19v20M32 24l-10 8M32 24l10 8M22 32v14M42 32v14M14 30h8M42 30h8M32 39l-7 17M32 39l7 17"/></svg>',
      core: '<svg ' + common + '><path d="M12 48h40"/><circle cx="24" cy="24" r="5"/><path d="M28 27l10 10M38 37l11 4M28 29l-7 11M21 40l-4 8M35 35l-3 13"/><path d="M15 20l8 4"/></svg>',
      legraise: '<svg ' + common + '><path d="M8 50h48"/><circle cx="17" cy="40" r="4"/><path d="M21 41l16 5M37 46l14-15M21 42l-8 8M28 44l-4-13"/></svg>',
      squat: '<svg ' + common + '><circle cx="34" cy="15" r="5"/><path d="M33 20l-8 14 13 7M25 34l-7 13 10 9M38 41l10 5-2 10M11 24h44M15 20v8M51 20v8M25 25h20"/></svg>',
      lunge: '<svg ' + common + '><circle cx="31" cy="12" r="5"/><path d="M31 17v20M31 23l-10 8M31 23l9 9M31 37l-14 8-8 10M31 37l13 8 11 1M11 56h45"/></svg>',
      hinge: '<svg ' + common + '><circle cx="30" cy="14" r="5"/><path d="M29 19l-11 14 18 4 9-12M18 33l5 17M36 37l6 13M9 50h46M12 46v8M52 46v8M16 50h32"/></svg>',
      bridge: '<svg ' + common + '><path d="M8 51h48"/><circle cx="15" cy="40" r="4"/><path d="M19 41l13-9 13 10M45 42l7 9M32 32l-7 18M20 42l-5 9"/></svg>',
      calf: '<svg ' + common + '><circle cx="31" cy="12" r="5"/><path d="M31 17v21M31 23l-9 10M31 23l9 10M31 38l-6 16M31 38l8 13M16 55h34M24 54l-4-4M39 51l4 4M46 18v32"/></svg>',
      grip: '<svg ' + common + '><path d="M23 16c2-5 5-8 9-8s7 3 9 8M26 20c2-3 4-5 6-5s4 2 6 5M22 17c-3 8-2 16 3 23l-6 16M42 17c3 8 2 16-3 23l6 16M25 40h14M19 56l7-3M45 56l-7-3"/></svg>'
    };
    return art[motion] || art.press;
  }

  function bindEvents() {
    document.querySelectorAll(".nav-item[data-tab]").forEach(function (button) {
      button.addEventListener("click", function () { navigate(button.dataset.tab); });
    });

    document.querySelectorAll("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.dataset.close === "planModal") requestClosePlanEditor();
        else closeModal(button.dataset.close);
      });
    });

    el.infoButton.addEventListener("click", function () { openModal("infoModal"); });
    el.activeLocationSelect.addEventListener("change", function () {
      const next = el.activeLocationSelect.value;
      if (!state.settings.availableLocations.includes(next)) return;
      state.settings.activeLocation = next;
      saveState();
      renderAll();
      showToast(locationById(next).name + " is active.");
    });
    el.settingsButton.addEventListener("click", function () {
      el.progressionDropdown.classList.add("hidden");
      el.progressionSettingButton.setAttribute("aria-expanded", "false");
      renderSettings();
      openModal("settingsModal");
    });
    el.overallScoreCard.addEventListener("click", function () { openModal("infoModal"); });

    el.muscleGrid.addEventListener("click", function (event) {
      const card = event.target.closest("[data-muscle-card]");
      if (card) openLift(card.dataset.muscleCard);
    });

    el.liftExerciseChips.addEventListener("click", function (event) {
      const button = event.target.closest("[data-lift-exercise]");
      if (!button) return;
      activeExerciseId = button.dataset.liftExercise;
      liftScoresExpanded = false;
      renderLiftModal(true);
    });
    el.liftWeightInput.addEventListener("input", updateLiveRank);
    el.liftRepsInput.addEventListener("input", updateLiveRank);
    el.liftInfoButton.addEventListener("click", function () { openExerciseInfo(activeExerciseId); });
    el.liftCooldownButton.addEventListener("click", toggleCooldownVisibility);
    el.saveLiftButton.addEventListener("click", saveLift);
    el.viewAllLiftScores.addEventListener("click", function () {
      liftScoresExpanded = !liftScoresExpanded;
      const exercise = exerciseById(activeExerciseId);
      if (exercise) renderLiftScoreHistory(exercise);
    });
    el.liftScoreHistory.addEventListener("click", function (event) {
      const button = event.target.closest("[data-delete-bundle]");
      if (!button) return;
      const exercise = exerciseById(activeExerciseId);
      if (!exercise) return;
      const entries = state.lifts.filter(function (lift) { return lift.exerciseId === exercise.id; });
      const bundle = bundleLiftHistory(entries).find(function (item) { return item.id === button.dataset.deleteBundle; });
      if (!bundle) return;
      const ids = bundle.lifts.map(function (lift) { return lift.id; });
      askConfirm({
        title: "Delete this exercise session?",
        message: "This removes " + bundle.lifts.length + (bundle.lifts.length === 1 ? " saved set" : " saved sets") + ". If one is the high score, the next best saved set will take its place.",
        button: "Delete"
      }, function () {
        state.lifts = state.lifts.filter(function (item) { return !ids.includes(item.id); });
        saveState();
        renderAll();
        renderLiftModal(false);
        showToast("Exercise session deleted.");
      });
    });

    el.newPlanButton.addEventListener("click", function () { openPlanEditor(selectedPlanId || null); });
    el.editCurrentWorkout.addEventListener("click", function () {
      if (selectedPlanId) openPlanEditor(selectedPlanId);
    });
    el.clearWorkoutSelection.addEventListener("click", function () {
      selectedPlanId = null;
      workoutHighScoresOpen = false;
      renderWorkouts();
      window.scrollTo(0, 0);
    });
    el.viewAllWorkoutHighScores.addEventListener("click", function () {
      selectedPlanId = null;
      workoutHighScoresOpen = true;
      renderWorkouts();
      window.scrollTo(0, 0);
    });
    el.closeWorkoutHighScores.addEventListener("click", function () {
      workoutHighScoresOpen = false;
      renderWorkouts();
      window.scrollTo(0, 0);
    });
    el.restTimerToggle.addEventListener("click", function () {
      if (suppressCooldownClick) {
        suppressCooldownClick = false;
        scheduleCooldownStationary();
        return;
      }
      if (cooldownPositioning) {
        scheduleCooldownStationary();
        return;
      }
      toggleRestTimer();
    });
    el.restTimerToggle.addEventListener("pointerdown", startCooldownPointer);
    el.restTimerToggle.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      enterCooldownPositioning();
    });
    window.addEventListener("pointermove", moveCooldownPointer, { passive: false });
    window.addEventListener("pointerup", finishCooldownPointer);
    window.addEventListener("pointercancel", function (event) {
      cancelCooldownHold();
      finishCooldownPointer(event);
    });
    document.addEventListener("pointerdown", function (event) {
      if (!cooldownPositioning || !el.cooldownDock || el.cooldownDock.contains(event.target)) return;
      cancelCooldownHold();
      clearTimeout(cooldownIdleTimer);
      cooldownDragging = false;
      cooldownPositioning = false;
      suppressCooldownClick = false;
      applyCooldownPlacement();
    });
    el.closeCooldownTimer.addEventListener("click", function (event) {
      event.stopPropagation();
      hideCooldownTimer();
    });
    el.cooldownEditControls.addEventListener("click", function (event) {
      const preset = event.target.closest("[data-cooldown-seconds]");
      if (!preset) return;
      event.stopPropagation();
      setRestDuration(Number(preset.dataset.cooldownSeconds));
      cooldownPositioning = true;
      applyCooldownPlacement();
      scheduleCooldownStationary();
    });
    el.showCooldownTimer.addEventListener("click", toggleCooldownVisibility);
    el.workoutFilterStrip.addEventListener("click", function (event) {
      const button = event.target.closest("[data-workout-filter]");
      if (!button) return;
      workoutLibraryFilter = button.dataset.workoutFilter;
      renderWorkouts();
    });
    el.workoutGroupFilter.addEventListener("change", function () {
      workoutGroupFilter = el.workoutGroupFilter.value;
      renderWorkouts();
    });
    el.planList.addEventListener("click", function (event) {
      const edit = event.target.closest("[data-edit-plan]");
      const select = event.target.closest("[data-select-plan]");
      const build = event.target.closest("[data-build-empty-plan]");
      if (edit) openPlanEditor(edit.dataset.editPlan);
      if (select) {
        selectedPlanId = select.dataset.selectPlan;
        workoutHighScoresOpen = false;
        renderWorkouts();
        window.scrollTo(0, 0);
      }
      if (build) openPlanEditor(null);
    });
    el.workoutLogger.addEventListener("click", function (event) {
      const info = event.target.closest("[data-exercise-info]");
      const detail = event.target.closest("[data-open-exercise-detail]");
      const save = event.target.closest("[data-save-quick-score]");
      if (info) {
        openExerciseInfo(info.dataset.exerciseInfo);
        return;
      }
      if (detail) {
        const exercise = exerciseById(detail.dataset.openExerciseDetail);
        if (exercise) openLift(exercise.group, exercise.id);
        return;
      }
      if (save) saveQuickScore(save.dataset.saveQuickScore, save.closest("[data-quick-exercise]"));
    });
    [el.workoutHighScores, el.workoutAllHighScores, el.dashboardHighScores, el.dashboardAllHighScores].forEach(function (container) {
      container.addEventListener("click", function (event) {
        const button = event.target.closest("[data-open-high-score]");
        if (!button) return;
        const exercise = exerciseById(button.dataset.openHighScore);
        if (exercise) openLift(exercise.group, exercise.id);
      });
    });
    el.planNameInput.addEventListener("input", function () { if (editingPlan) editingPlan.name = el.planNameInput.value; });
    el.planEditorList.addEventListener("input", function (event) {
      const input = event.target.closest("[data-editor-field]");
      if (!input || !editingPlan) return;
      const index = Number(input.dataset.index);
      editingPlan.exercises[index][input.dataset.editorField] = Number(input.value);
    });
    el.planEditorList.addEventListener("click", function (event) {
      const info = event.target.closest("[data-exercise-info]");
      const remove = event.target.closest("[data-remove-exercise]");
      if (info) {
        openExerciseInfo(info.dataset.exerciseInfo);
        return;
      }
      if (!remove || !editingPlan) return;
      editingPlan.exercises.splice(Number(remove.dataset.removeExercise), 1);
      renderPlanEditor();
    });
    el.planIconPicker.addEventListener("click", function (event) {
      const draw = event.target.closest("[data-draw-plan-icon]");
      const button = event.target.closest("[data-plan-icon]");
      if (draw) {
        openIconDrawing("plan");
        return;
      }
      if (!button || !editingPlan) return;
      editingPlan.icon = button.dataset.planIcon;
      renderPlanIconPicker();
    });
    el.iconDrawCanvas.addEventListener("pointerdown", function (event) {
      const point = iconPointFromEvent(event);
      if (!point) return;
      activeIconDrawingTool = iconDrawingTool;
      if (activeIconDrawingTool === "draw" && iconDrawingStrokes.length >= 60) {
        showToast("Icon has reached the line limit.");
        return;
      }
      event.preventDefault();
      rememberIconDrawingState();
      iconDrawingActive = true;
      if (activeIconDrawingTool === "erase") {
        activeIconStroke = null;
        activeIconEraserPoint = point;
        eraseIconArea(point);
      } else {
        activeIconStroke = { width: normalizeIconWidth(iconDrawingStrokeWidth), points: [point] };
        iconDrawingStrokes.push(activeIconStroke);
      }
      if (el.iconDrawCanvas.setPointerCapture) el.iconDrawCanvas.setPointerCapture(event.pointerId);
      renderIconDrawing();
    });
    el.iconDrawCanvas.addEventListener("pointermove", function (event) {
      if (!iconDrawingActive) return;
      const point = iconPointFromEvent(event);
      if (!point) return;
      event.preventDefault();
      if (activeIconDrawingTool === "erase") {
        activeIconEraserPoint = point;
        eraseIconArea(point);
      }
      else appendInterpolatedIconPoints(activeIconStroke, point);
      renderIconDrawing();
    });
    ["pointerup", "pointercancel"].forEach(function (eventName) {
      el.iconDrawCanvas.addEventListener(eventName, function () {
        if (activeIconStroke && activeIconStroke.points.length === 1) {
          activeIconStroke.points.push({ x: core.clamp(activeIconStroke.points[0].x + 0.15, 0, 100), y: activeIconStroke.points[0].y });
        }
        iconDrawingActive = false;
        activeIconStroke = null;
        activeIconEraserPoint = null;
        renderIconDrawing();
      });
    });
    el.undoIconStrokeButton.addEventListener("click", function () {
      if (!iconDrawingUndoStack.length) return;
      iconDrawingRedoStack.push(cloneIconStrokes(iconDrawingStrokes));
      iconDrawingStrokes = iconDrawingUndoStack.pop();
      renderIconDrawing();
    });
    el.redoIconStrokeButton.addEventListener("click", function () {
      if (!iconDrawingRedoStack.length) return;
      iconDrawingUndoStack.push(cloneIconStrokes(iconDrawingStrokes));
      iconDrawingStrokes = iconDrawingRedoStack.pop();
      renderIconDrawing();
    });
    el.clearIconDrawingButton.addEventListener("click", function () {
      if (!iconDrawingStrokes.length) return;
      rememberIconDrawingState();
      iconDrawingStrokes = [];
      renderIconDrawing();
    });
    el.eraseIconToolButton.addEventListener("click", function () {
      setIconDrawingTool(iconDrawingTool === "erase" ? "draw" : "erase");
    });
    el.iconStrokeWidth.addEventListener("input", function () {
      iconDrawingStrokeWidth = normalizeIconWidth(el.iconStrokeWidth.value);
      renderIconDrawing();
    });
    el.iconDrawCanvas.addEventListener("contextmenu", function (event) { event.preventDefault(); });
    el.saveIconDrawingButton.addEventListener("click", saveIconDrawing);
    el.addExerciseButton.addEventListener("click", function () {
      el.exerciseSearchInput.value = "";
      renderExercisePicker("");
      openModal("exercisePickerModal");
    });
    el.exerciseSearchInput.addEventListener("input", function () { renderExercisePicker(el.exerciseSearchInput.value); });
    el.exerciseFilterStrip.addEventListener("click", function (event) {
      const button = event.target.closest("[data-exercise-filter]");
      if (!button) return;
      exerciseLibraryFilter = button.dataset.exerciseFilter;
      renderExercisePicker(el.exerciseSearchInput.value);
    });
    el.exerciseGroupFilter.addEventListener("change", function () {
      exerciseGroupFilter = el.exerciseGroupFilter.value;
      renderExercisePicker(el.exerciseSearchInput.value);
    });
    el.exercisePickerList.addEventListener("click", function (event) {
      const info = event.target.closest("[data-exercise-info]");
      const button = event.target.closest("[data-pick-exercise]");
      if (info) {
        openExerciseInfo(info.dataset.exerciseInfo);
        return;
      }
      if (!button || !editingPlan) return;
      editingPlan.exercises.push({ exerciseId: button.dataset.pickExercise, sets: 3, reps: 8, weightKg: null });
      closeModal("exercisePickerModal");
      renderPlanEditor();
    });
    el.savePlanButton.addEventListener("click", savePlan);
    el.deletePlanButton.addEventListener("click", deleteEditingPlan);

    el.dashboardChartTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-chart-mode]");
      if (!button) return;
      dashboardChartMode = button.dataset.chartMode;
      renderDashboard();
    });
    el.viewAllDashboardScores.addEventListener("click", function () {
      dashboardAllScoresOpen = true;
      renderDashboard();
      window.scrollTo(0, 0);
    });
    el.closeDashboardScores.addEventListener("click", function () {
      dashboardAllScoresOpen = false;
      renderDashboard();
      window.scrollTo(0, 0);
    });

    el.cardioChartTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-cardio-chart]");
      if (!button) return;
      cardioChartMode = button.dataset.cardioChart === "fastest-mile" ? "fastest-mile" : "longest-run";
      renderCardio();
    });
    el.cardioActivityTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-cardio-activity]");
      if (!button) return;
      el.cardioActivitySelect.value = cardioActivityById(button.dataset.cardioActivity).id;
      renderCardio();
    });
    el.cardioActivitySelect.addEventListener("change", renderCardio);
    el.saveCardioScoreButton.addEventListener("click", saveCardioScore);
    el.openCardioGoalFromLogger.addEventListener("click", function () { openCardioGoalEditor(el.cardioActivitySelect.value); });
    el.openCardioGoalButton.addEventListener("click", function () { openCardioGoalEditor(cardioChartMode); });
    el.openCardioGoalSettingsButton.addEventListener("click", function () {
      const existing = Object.keys(state.settings.cardioGoals || {})[0];
      openCardioGoalEditor(existing || el.cardioActivitySelect.value || "longest-run");
    });
    el.cardioGoalActivitySelect.addEventListener("change", function () {
      activeCardioGoalId = cardioActivityById(el.cardioGoalActivitySelect.value).id;
      const goal = cardioGoalFor(activeCardioGoalId);
      el.cardioGoalDateInput.value = goal ? goal.date : isoDateAfterDays(90);
      renderCardioGoalValueFields();
    });
    el.cardioGoalValueFields.addEventListener("input", updateCardioGoalPreview);
    el.cardioGoalDateInput.addEventListener("input", updateCardioGoalPreview);
    el.saveCardioGoalButton.addEventListener("click", saveCardioGoal);
    el.clearCardioGoalButton.addEventListener("click", clearCardioGoal);
    el.focusCardioLoggerButton.addEventListener("click", function () {
      el.cardioLogger.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    el.cardioHistoryList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-delete-cardio]");
      if (button) deleteCardioScore(button.dataset.deleteCardio);
    });

    el.logMeasurementsButton.addEventListener("click", openMeasurements);
    el.openMeasurementDisplayButton.addEventListener("click", function () {
      renderMeasurementDisplayOptions();
      openModal("measurementDisplayModal");
    });
    el.measurementDisplayOptions.addEventListener("click", function (event) {
      const button = event.target.closest("[data-weight-display]");
      if (!button) return;
      const key = button.dataset.weightDisplay;
      const display = weightDisplaySettings();
      if (!Object.prototype.hasOwnProperty.call(DEFAULT_WEIGHT_DISPLAY, key)) return;
      display[key] = !display[key];
      state.settings.weightDisplay = display;
      saveState();
      renderBody();
      renderMeasurementDisplayOptions();
    });
    el.currentWeightViewButton.addEventListener("click", function () {
      bodyWeightView = bodyWeightView === "recent" ? "trajectory" : bodyWeightView === "trajectory" ? "full" : "recent";
      renderBody();
    });
    el.openWeightGoalFromBody.addEventListener("click", openWeightGoalEditor);
    el.bodyMethodButton.addEventListener("click", function () { openModal("bodyInfoModal"); });
    el.quickMeasurementInput.addEventListener("input", renderQuickMeasurementProgress);
    el.saveMeasurementsButton.addEventListener("click", saveMeasurements);
    el.saveQuickMeasurementButton.addEventListener("click", saveQuickMeasurement);
    el.measurementGrid.addEventListener("pointerdown", function (event) {
      const card = event.target.closest("[data-quick-measurement]");
      if (!card) return;
      clearTimeout(measurementHoldTimer);
      suppressMeasurementClick = false;
      measurementHoldTimer = setTimeout(function () {
        suppressMeasurementClick = true;
        openQuickMeasurement(card.dataset.quickMeasurement);
      }, 500);
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
      el.measurementGrid.addEventListener(eventName, function () { clearTimeout(measurementHoldTimer); });
    });
    el.measurementGrid.addEventListener("click", function (event) {
      const card = event.target.closest("[data-quick-measurement]");
      if (!card) return;
      clearTimeout(measurementHoldTimer);
      if (suppressMeasurementClick) {
        suppressMeasurementClick = false;
        return;
      }
      openQuickMeasurement(card.dataset.quickMeasurement);
    });
    el.viewAllMeasurementsButton.addEventListener("click", function () {
      renderMeasurementHistory();
      openModal("measurementHistoryModal");
    });
    [el.measurementHistoryPreview, el.measurementHistoryList].forEach(function (container) {
      container.addEventListener("click", function (event) {
        const button = event.target.closest("[data-edit-measurement-entry]");
        if (button) openMeasurementHistoryEdit(button.dataset.editMeasurementEntry);
      });
    });
    el.saveMeasurementHistoryEdit.addEventListener("click", saveMeasurementHistoryEdit);
    el.deleteMeasurementHistoryEntry.addEventListener("click", deleteMeasurementHistoryEntry);
    el.editProfileButton.addEventListener("click", function () { openSetup(true); });
    el.openWeightGoalButton.addEventListener("click", openWeightGoalEditor);
    el.weightGoalInput.addEventListener("input", updateWeightGoalPreview);
    el.weightGoalDateInput.addEventListener("input", updateWeightGoalPreview);
    el.saveWeightGoalButton.addEventListener("click", saveWeightGoal);
    el.clearWeightGoalButton.addEventListener("click", clearWeightGoal);
    el.locationSettings.addEventListener("click", function (event) {
      const edit = event.target.closest("[data-edit-location-equipment]");
      const toggle = event.target.closest("[data-toggle-location]");
      if (edit) {
        pendingLocationActivation = null;
        openEquipmentEditor(edit.dataset.editLocationEquipment, false);
        return;
      }
      if (!toggle) return;
      const locationId = toggle.dataset.toggleLocation;
      const available = normalizeLocationIds(state.settings.availableLocations);
      if (available.includes(locationId)) {
        if (available.length === 1) {
          showToast("Keep at least one training location.");
          return;
        }
        state.settings.availableLocations = available.filter(function (id) { return id !== locationId; });
        if (state.settings.activeLocation === locationId) state.settings.activeLocation = state.settings.availableLocations[0];
        selectedPlanId = null;
        saveState();
        renderAll();
        showToast(locationById(locationId).name + " removed.");
        return;
      }
      const ids = locationEquipmentIds(locationId);
      if (locationId !== "home" && !ids.length) {
        pendingLocationActivation = locationId;
        openEquipmentEditor(locationId, false);
        return;
      }
      state.settings.availableLocations = normalizeLocationIds(available.concat(locationId));
      state.settings.locationSetupComplete = true;
      saveState();
      renderAll();
      showToast(locationById(locationId).name + " added.");
    });
    bindSegment(el.equipmentPreferenceSetting, function (value) {
      state.settings.equipmentPreference = value === "machines" || value === "free_weights" ? value : "none";
      saveState();
      renderAll();
      renderExercisePicker(el.exerciseSearchInput.value);
    });
    el.equipmentPicker.addEventListener("click", function (event) {
      const button = event.target.closest("[data-equipment-choice]");
      if (!button) return;
      const id = button.dataset.equipmentChoice;
      equipmentEditorDraft = equipmentEditorDraft.includes(id)
        ? equipmentEditorDraft.filter(function (item) { return item !== id; })
        : equipmentEditorDraft.concat(id);
      renderEquipmentEditor();
    });
    el.noEquipmentChoice.addEventListener("click", function () {
      if (equipmentEditorLocation !== "home") return;
      equipmentEditorDraft = [];
      renderEquipmentEditor();
    });
    el.equipmentSearchInput.addEventListener("input", function () {
      equipmentSearchQuery = el.equipmentSearchInput.value;
      renderEquipmentEditor();
    });
    el.addOtherEquipmentButton.addEventListener("click", addCustomEquipmentFromEditor);
    el.customEquipmentInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addCustomEquipmentFromEditor();
      }
    });
    el.saveEquipmentButton.addEventListener("click", saveEquipmentEditor);
    el.resetDataButton.addEventListener("click", function () {
      askConfirm({
        title: "Reset everything?",
        message: "All high scores, workout plans, custom exercises, custom ratios, and body measurements will be erased from this device.",
        button: "Reset"
      }, function () {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        selectedPlanId = null;
        workoutHighScoresOpen = false;
        dashboardAllScoresOpen = false;
        restDuration = Number(state.settings.restSeconds) || 60;
        resetRestTimer();
        saveState();
        renderAll();
        navigate("strength");
        closeModal("settingsModal");
        openSetup(false);
      });
    });

    bindSegment(el.unitsSetting, function (value) {
      state.profile.units = value;
      saveState();
      renderAll();
    });
    el.standardSetting.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      const next = button.dataset.value === "female" ? "female" : "male";
      setSegment(el.standardSetting, state.profile.standard);
      if (next === state.profile.standard) return;
      confirmComparisonProfile(next, function () {
        state.profile.standard = next;
        saveState();
        renderAll();
        showToast((next === "female" ? "Female" : "Male") + " comparison profile selected.");
      });
    });
    bindSegment(el.rankTargetModeSetting, function (value) {
      state.settings.rankTargetMode = value === "world_record" ? "world_record" : "training";
      saveState();
      renderAll();
      if (el.liftModal.classList.contains("open")) renderLiftModal(false);
      showToast(worldRecordMode() ? "World-record progression selected." : "Training-level progression selected.");
    });
    el.historyBundleWindow.addEventListener("change", function () {
      state.settings.historyBundleWindow = ["30", "60", "120", "240", "day"].includes(el.historyBundleWindow.value) ? el.historyBundleWindow.value : "day";
      saveState();
      renderSettings();
      if (el.liftModal.classList.contains("open")) renderLiftScoreHistory(exerciseById(activeExerciseId));
      showToast("History now bundles sets within " + historyBundleWindowLabel() + ".");
    });
    el.recentTrainingWindow.addEventListener("change", function () {
      const days = Number(el.recentTrainingWindow.value);
      state.settings.recentTrainingWindowDays = [3, 7, 10, 14, 21, 30].includes(days) ? days : 7;
      saveState();
      renderAll();
      showToast("Recent training now fades over " + state.settings.recentTrainingWindowDays + " days.");
    });
    el.openProportionalTargetsButton.addEventListener("click", function () {
      renderProportionalTargets();
      openModal("proportionalTargetsModal");
    });
    el.proportionalPhysiqueSelect.addEventListener("change", function () {
      state.settings.proportionalPhysique = allProportionalPhysiques().some(function (item) { return item.id === el.proportionalPhysiqueSelect.value; })
        ? el.proportionalPhysiqueSelect.value
        : "golden";
      saveState();
      renderAll();
      showToast("Proportional targets updated.");
    });
    el.addCustomPhysiqueButton.addEventListener("click", function () { openCustomPhysiqueEditor(null); });
    el.customPhysiqueList.addEventListener("click", function (event) {
      const useButton = event.target.closest("[data-use-custom-physique]");
      const editButton = event.target.closest("[data-edit-custom-physique]");
      const deleteButton = event.target.closest("[data-delete-custom-physique]");
      if (useButton) {
        const physique = customPhysiqueById(useButton.dataset.useCustomPhysique);
        if (!physique) return;
        state.settings.proportionalPhysique = physique.id;
        saveState();
        renderAll();
        showToast(physique.name + " selected.");
      } else if (editButton) openCustomPhysiqueEditor(editButton.dataset.editCustomPhysique);
      else if (deleteButton) deleteCustomPhysique(deleteButton.dataset.deleteCustomPhysique);
    });
    el.saveCustomPhysiqueButton.addEventListener("click", saveCustomPhysique);
    el.proportionalMassBias.addEventListener("input", function () {
      state.settings.proportionalMassBias = Math.round(core.clamp(
        Number(el.proportionalMassBias.value) || 0,
        Number(el.proportionalMassBias.min) || -85,
        Number(el.proportionalMassBias.max) || 150
      ));
      renderBody();
    });
    el.proportionalMassBias.addEventListener("change", function () {
      saveState();
      renderAll();
      showToast("Target mass saved.");
    });
    el.progressionSettingButton.addEventListener("click", function () {
      const isOpen = !el.progressionDropdown.classList.contains("hidden");
      el.progressionDropdown.classList.toggle("hidden", isOpen);
      el.progressionSettingButton.setAttribute("aria-expanded", String(!isOpen));
    });
    el.progressionSelect.addEventListener("change", function () {
      state.settings.progression = el.progressionSelect.value;
      saveState();
      renderAll();
      if (el.liftModal.classList.contains("open")) renderLiftModal(false);
      showToast(state.settings.progression === "baki" ? "Baki logic enabled. Physics has been disabled." : "Progression style changed.");
    });
    el.pointLabelSelect.addEventListener("change", function () {
      state.settings.pointLabel = el.pointLabelSelect.value;
      saveState();
      renderAll();
      showToast("Score name changed.");
    });
    el.customPointLabelInput.addEventListener("change", function () {
      const custom = el.customPointLabelInput.value.trim().slice(0, 18);
      state.settings.customPointLabel = custom || "Points";
      saveState();
      renderAll();
      showToast("Custom score name saved.");
    });
    el.weightedScoreModeSetting.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      const nextMode = button.dataset.value;
      const currentMode = weightedScoreMode();
      setSegment(el.weightedScoreModeSetting, currentMode);
      if (nextMode === currentMode) return;
      const explanation = nextMode === "one_rep_max"
        ? "Only saved weighted sets with exactly 1 rep will count as an actual 1RM. Multi-rep sets will remain in history."
        : nextMode === "estimated_one_rep_max"
          ? "Saved weight and reps will calculate an estimated 1RM with the Epley formula."
          : "The largest weight saved will count, regardless of the rep count.";
      askConfirm({
        title: "Are you sure?",
        message: "Change weighted high scores to " + weightedModeName(nextMode) + "? " + explanation + " Every saved set will be kept. Nothing will be deleted or rewritten.",
        button: "Change"
      }, function () {
        state.settings.weightedScoreMode = nextMode;
        saveState();
        renderAll();
        showToast(weightedModeName(nextMode) + " selected.");
      });
    });
    el.themeOptions.addEventListener("click", function (event) {
      const custom = event.target.closest("[data-custom-color]");
      const button = event.target.closest("[data-theme-choice]");
      if (custom) {
        openCustomColorPicker();
        return;
      }
      if (!button) return;
      state.settings.theme = button.dataset.themeChoice;
      state.settings.useCustomAccent = false;
      saveState();
      renderAll();
    });
    el.colorSpectrum.addEventListener("pointerdown", function (event) {
      colorSpectrumDragging = true;
      if (el.colorSpectrum.setPointerCapture) el.colorSpectrum.setPointerCapture(event.pointerId);
      setColorFromSpectrum(event);
    });
    el.colorSpectrum.addEventListener("pointermove", function (event) {
      if (colorSpectrumDragging) setColorFromSpectrum(event);
    });
    ["pointerup", "pointercancel"].forEach(function (eventName) {
      el.colorSpectrum.addEventListener(eventName, function () { colorSpectrumDragging = false; });
    });
    el.colorHueSlider.addEventListener("input", function () {
      colorPickerHue = Math.round(Number(el.colorHueSlider.value) || 0);
      renderColorPicker();
    });
    el.customAccentHex.addEventListener("change", function () {
      const color = normalizeHexColor(el.customAccentHex.value);
      if (!color) {
        el.customAccentHex.value = selectedPickerHex();
        showToast("Enter a hex color like #B9F64A.");
        return;
      }
      const hsv = hexToHsv(color);
      colorPickerHue = hsv.hue;
      colorPickerSaturation = hsv.saturation;
      colorPickerValue = hsv.value;
      renderColorPicker();
      el.customAccentHex.value = color;
    });
    el.saveCustomAccentButton.addEventListener("click", function () {
      const color = normalizeHexColor(el.customAccentHex.value) || selectedPickerHex();
      state.settings.customAccent = color;
      state.settings.useCustomAccent = true;
      saveState();
      renderAll();
      closeModal("colorPickerModal");
      showToast(color + " accent selected.");
    });
    el.logoOptions.addEventListener("click", function (event) {
      const button = event.target.closest("[data-logo-choice]");
      if (!button) return;
      state.settings.logo = button.dataset.logoChoice;
      saveState();
      renderAll();
    });
    el.drawAppMarkButton.addEventListener("click", function () { openIconDrawing("app"); });
    el.appTitleInput.addEventListener("input", function () {
      state.settings.appTitle = String(el.appTitleInput.value || "").replace(/\s+/g, " ").slice(0, 24);
      saveState();
      applyAppearance();
    });
    el.appTitleInput.addEventListener("change", function () {
      state.settings.appTitle = normalizeAppTitle(el.appTitleInput.value);
      el.appTitleInput.value = state.settings.appTitle;
      saveState();
      applyAppearance();
    });
    el.addCustomExerciseButton.addEventListener("click", openCustomExercise);
    bindSegment(el.customExerciseType, function () {});
    bindSegment(el.showExerciseTagsSetting, function (value) {
      state.settings.showExerciseTags = value !== "false";
      saveState();
      renderAll();
      renderExercisePicker(el.exerciseSearchInput.value);
    });
    bindSegment(el.cooldownTimerSetting, function (value) {
      setRestDuration(value);
    });
    el.customExerciseIcons.addEventListener("click", function (event) {
      const draw = event.target.closest("[data-draw-exercise-icon]");
      const button = event.target.closest("[data-custom-icon]");
      if (draw) {
        openIconDrawing("exercise");
        return;
      }
      if (!button) return;
      customExerciseMotion = button.dataset.customIcon;
      renderCustomExerciseIconPicker();
    });
    el.customExerciseGroups.addEventListener("click", function (event) {
      const button = event.target.closest("[data-custom-exercise-group]");
      if (!button) return;
      const groupId = button.dataset.customExerciseGroup;
      if (customExerciseGroupIds.includes(groupId)) {
        if (customExerciseGroupIds.length === 1) {
          showToast("Keep at least one muscle group selected.");
          return;
        }
        customExerciseGroupIds = customExerciseGroupIds.filter(function (item) { return item !== groupId; });
      } else {
        if (customExerciseGroupIds.length >= 6) {
          showToast("Choose up to six muscle groups.");
          return;
        }
        customExerciseGroupIds.push(groupId);
      }
      renderCustomExerciseGroups();
    });
    el.saveCustomExerciseButton.addEventListener("click", saveCustomExercise);
    el.exportDataButton.addEventListener("click", exportAllData);
    el.importDataButton.addEventListener("click", openBackupImport);
    el.openDeveloperNoteButton.addEventListener("click", function () { openModal("developerNoteModal"); });
    el.openCopyrightButton.addEventListener("click", function () { openModal("copyrightModal"); });
    [el.donateButton, el.developerNoteDonateButton, el.copyrightDonateButton].forEach(function (button) {
      button.addEventListener("click", openDonatePage);
    });
    el.donationReminderButton.addEventListener("click", function () {
      donationReminderHandled();
      openDonatePage();
    });
    el.donationReminderClose.addEventListener("click", donationReminderHandled);
    el.donationTabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-donation-tab]");
      if (!button) return;
      donationTab = button.dataset.donationTab === "one-time" ? "one-time" : "monthly";
      renderDonationPage();
    });
    el.monthlyDonationSlider.addEventListener("input", function () {
      donationMonthlyIndex = Math.round(core.clamp(Number(el.monthlyDonationSlider.value) || 0, 0, MONTHLY_DONATIONS.length - 1));
      renderDonationPage();
    });
    el.donationSubmitButton.addEventListener("click", function () {
      launchDonation(donationTab === "monthly" ? MONTHLY_DONATIONS[donationMonthlyIndex].id : ONE_TIME_DONATION.id);
    });
    el.importCsvInput.addEventListener("change", function () {
      const file = el.importCsvInput.files && el.importCsvInput.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast("The backup is larger than 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = function () { queueBackupImport(reader.result); };
      reader.onerror = function () { showToast("Could not read that backup file."); };
      reader.readAsText(file);
    });
    el.customExerciseList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-delete-custom]");
      if (!button) return;
      const exercise = exerciseById(button.dataset.deleteCustom);
      if (!exercise) return;
      askConfirm({
        title: "Delete " + exercise.name + "?",
        message: "This removes the custom exercise from plans and deletes its saved scores.",
        button: "Delete"
      }, function () {
        state.customExercises = state.customExercises.filter(function (item) { return item.id !== exercise.id; });
        state.lifts = state.lifts.filter(function (lift) { return lift.exerciseId !== exercise.id; });
        state.plans.forEach(function (plan) { plan.exercises = plan.exercises.filter(function (entry) { return entry.exerciseId !== exercise.id; }); });
        saveState();
        renderAll();
        showToast(exercise.name + " deleted.");
      });
    });
    el.setupLocations.addEventListener("click", function (event) {
      const button = event.target.closest("[data-setup-location]");
      if (!button) return;
      const locationId = button.dataset.setupLocation;
      setupLocationDraft = setupLocationDraft.includes(locationId)
        ? setupLocationDraft.filter(function (id) { return id !== locationId; })
        : setupLocationDraft.concat(locationId);
      renderSetupLocations();
    });
    el.setupEquipmentSummaries.addEventListener("click", function (event) {
      const button = event.target.closest("[data-setup-equipment]");
      if (button) openEquipmentEditor(button.dataset.setupEquipment, true);
    });
    bindSegment(el.setupEquipmentPreference, function (value) {
      setupEquipmentPreferenceDraft = value === "machines" || value === "free_weights" ? value : "none";
    });
    bindSegment(el.setupUnits, function (value) {
      const current = Number(el.setupWeight.value);
      const oldUnits = value === "kg" ? "lb" : "kg";
      const currentHeightCm = setupHeightCmValue(oldUnits) || state.profile.heightCm;
      if (Number.isFinite(current) && current > 0) {
        const kg = core.displayToKg(current, oldUnits);
        el.setupWeight.value = core.round(core.kgToDisplay(kg, value), 1);
      }
      setSetupHeightFields(currentHeightCm, value);
    });
    el.setupStandard.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-value]");
      if (!button) return;
      const next = button.dataset.value === "female" ? "female" : "male";
      const active = el.setupStandard.querySelector("button.active");
      const current = active ? active.dataset.value : state.profile.standard;
      if (next === current) return;
      if (!setupIsEdit) {
        setSegment(el.setupStandard, next);
        return;
      }
      confirmComparisonProfile(next, function () { setSegment(el.setupStandard, next); });
    });
    el.setupNextButton.addEventListener("click", advanceSetup);
    el.setupBackButton.addEventListener("click", function () { showSetupStep(1); });
    el.setupLocationNextButton.addEventListener("click", advanceSetupLocations);
    el.setupPhysiqueBackButton.addEventListener("click", function () { showSetupStep(2); });
    el.setupPhysiqueSelect.addEventListener("change", updateSetupPhysiquePreview);
    el.finishSetupButton.addEventListener("click", finishSetup);

    el.confirmCancel.addEventListener("click", closeConfirm);
    el.confirmOkay.addEventListener("click", function () {
      const action = pendingConfirm;
      closeConfirm();
      if (action) action();
    });
  }

  function init() {
    cacheElements();
    restoreNativeTimerState();
    initializeBackNavigation();
    bindEvents();
    renderExercisePicker("");
    renderAll();
    saveState();
    if (!state.profile.onboarded || !state.settings.locationSetupComplete) openSetup(false);
  }

  init();
})();

# Foss Gym

Foss Gym is a private, offline-first Android strength and workout tracker.

## What it does

- Shows an original front-and-back heat map for 15 major muscle groups, with separately drawn left and right muscles that always highlight together
- Refines the heat map with thicker forearms and front thighs, wider lower biceps, and smaller lower abdominal sections
- Splits first-run setup into three readable pages for profile details, training locations, and the ideal physique the user wants to emulate
- Keeps the active training location directly left of Build/Edit on the Workouts tab, using only the location name and dropdown arrow
- Loads editable Planet Fitness and Crunch Fitness equipment defaults, requires an equipment list for apartment gyms, and supports a true no-equipment home setup
- Stores a machines, free weights, or no-preference choice and uses it to order available exercises without hiding other valid options
- Includes a 70-item equipment catalog and exercise-to-equipment alternatives for every built-in weighted movement
- Ranks weighted exercises by an actual one-rep max, the heaviest saved set, or an estimated one-rep max
- Ranks bodyweight exercises by the highest clean rep count saved
- Uses a universal 0 to 9,900 score that defaults to XP and can be renamed in Settings
- Displays the same score through 13 selectable progression styles, with Training Level as the default
- Includes 120 weighted and rep-based bodyweight exercises, including Leg Press, Calf Press, an adjustable hand gripper, and an expanded core library
- Uses 49 reviewed, exercise-specific vector icons for Chest through Forearms, with app-theme colors and generic fallbacks for the unreviewed exercises
- Filters workout plans and exercises by all, no equipment, equipment, or muscle group without redundant bodyweight and weighted filters
- Guarantees that every no-equipment result is a bodyweight exercise
- Shows optional compact tags with distinct colors for muscle group, equipment, and scoring type
- Adds more rep-based, no-equipment exercises for training at home without bringing timed workouts back
- Supports custom exercises with up to six selected muscle groups, blended ranking standards, and evenly split overall strength credit
- Supports drawn custom-exercise icons as well as the built-in icon choices
- Builds custom workout plans with selectable plan icons or a simple icon you draw yourself
- Warns before leaving a workout plan with unsaved changes
- Supports undo, redo, per-line stroke widths, and an area eraser sized by the selected width in the icon drawing pad
- Logs sets directly with no workout-session start, stop, or finish flow
- Keeps the current workout name pinned at the top, with Edit and cooldown-toggle controls beside it
- Uses a larger cooldown tile on current-workout and individual-exercise pages, with Cooldown above the countdown and Timer below it; a long press reveals 30, 60, and 90 second choices plus corner placement
- Closes the cooldown positioning controls when you tap outside the tile
- Hides the cooldown move controls and X after five seconds without a touch, remembers the selected corner, and lets the header timer button show or hide the tile
- Keeps the cooldown timer available on individual exercise pages and mirrors an active timer into a public Android lock-screen notification with a one-tap Reset action
- Vibrates three distinct pulses when a cooldown reaches zero
- Flashes a saved exercise green, vibrates the phone, and drops a green confirmation bar from the top; invalid zero-weight entries get a red correction bar
- Opens the full saved-score history and rank ladder when an exercise name or icon is tapped inside the current workout
- Adds an unboxed eye button with a specifically reviewed description, four setup steps, a form tip, and rank targets that stay below the first view until you swipe up
- Bundles same-day sets into one exercise session by default, shows exact times, and supports 30-minute, 1-hour, 2-hour, 4-hour, or same-day bundle windows
- Lets you review and delete a complete bundled exercise session
- Shows only the three latest sessions in a muscle detail by default, with a View all control for the full history
- Includes a dashboard for rank progress, the three highest-rated scores, all exercise scores, strength trends, and weight trends
- Adds a Cardio tab with Strength-style activity tabs for longest-distance and fastest-time scores, including the mile, 40-yard dash, 100 meters, 400 meters, 5K, 10K, half marathon, marathon, rowing, cycling, and stair climbing
- Supports a separate future-dated goal for every cardio activity and shows the selected activity's record, goal, and gap beside the logger
- Shows a complete rank ladder and exact exercise target at the bottom of every muscle-group detail
- Adds a rank-progression bar to every muscle card and a fading accent outline for muscle groups trained within a selectable 3-to-30-day window
- Includes six color themes, a custom HSV spectrum with a compact hex input, five built-in app marks, a drawable custom app mark, and an editable app title
- Keeps the drawing pad above Settings and custom-exercise editors so it accepts finger and stylus input immediately
- Uses a clean multicolor gradient for the custom-color shortcut without the extra center ring or slash
- Accepts imperial height as separate feet and inches fields, such as 6 ft 2 in, or centimeters in metric mode
- Tracks body weight, height, BMI, tape-estimated body fat, and individually updatable body measurements
- Saves a target weight and future date, then cycles the weight chart between the past seven days, required-versus-current trajectory, and the full timeline when the current weight is tapped
- Moves the cardio trend graph into Measurements and keeps the Cardio logger focused on choosing and saving an activity
- Adds a compact Measurements display editor for current weight, date-aware change, trendline, start and end dates, independent X and Y labels, goal gap, and required daily or weekly weight change
- Places repeatable measuring instructions directly inside each measurement entry area without a separate eye button
- Shows the three newest measurement entries on the Body tab and lets you view, edit, redate, or delete the full measurement history
- Keeps the Measurements tab focused on current values, with compact targets in each card's top-right corner and a target progress bar inside the single-measurement update sheet
- Moves Golden Ratio, Grecian, Lean AF, Guts, Steve Reeves, Arnold Schwarzenegger, Clint Walker, old-school symmetry, and the clearly labeled Baki parody preset to a dedicated Proportional Targets settings page
- Scales the height-based Lean AF and Guts measurement references to the user's height, including Guts's estimated visual body-fat target
- Keeps the target-mass scale automatically centered around the user's current weight, from 50 lb below to 25 lb above
- Creates, names, edits, selects, and deletes custom waist-based proportional ratios on their own builder page
- Completes every proportional preset and custom ratio across every logged measurement except height, including a body-fat target
- Uses a dark system color scheme for every dropdown so Android selection menus stay readable at night
- Doubles the mobile labels for Progress target and Weighted high scores choices
- Applies one global pounds/kilograms setting to every weighted exercise, including the adjustable hand gripper
- Offers training-level progression or a world-record chase mode; IPF squat, bench press, and deadlift records change with the male/female comparison profile
- Adds directly comparable untimed Guinness targets for the male comparison profile: consecutive pull-ups, chin-ups, and bodyweight squats
- Keeps World Class at the bottom of the Training Level ladder and hides it anywhere a directly comparable published metric is unavailable
- Confirms Male/Female comparison-profile changes before updating ranks and record targets
- Ships distinctly named and described Android home-screen widgets for the Dashboard, Top Stats, Body Metrics, and independently selectable workout plans
- Exports all app data to CSV and restores that same CSV through Android's file picker
- Includes an in-app developer note, redistribution terms, acknowledgements, and the required Donate controls
- Shows one compact, dismissible donation reminder at most once every 30 days, then opens an in-app monthly or one-time donation chooser before handing the approved Stripe page to the browser
- Stores everything locally on the Android device

## Ranking method

For a weighted exercise, the Weighted high scores setting controls what counts:

- Actual 1RM only changes the high score and rank when the saved set has exactly one rep. Multi-rep sets still save to history.
- Heaviest set changes the high score and rank when you save a heavier weight, regardless of rep count.
- Estimated 1RM uses the saved weight and rep count with the Epley formula. It is an estimate, not a tested maximum.

All three weighted modes use the same saved set history. Switching modes does not delete or rewrite scores. For a bodyweight exercise, Foss Gym compares the highest saved clean rep count with the exercise rep standards.

The weighted reference bands are bodyweight-relative and were audited against current community one-rep-max standards for the corresponding movements. Dumbbell movements labeled "total" use the combined weight of both dumbbells. Machine stacks, lever arms, brands, and setup differ, so a machine score is best treated as a consistent personal reference rather than a universal conversion.

The result is an estimated percentile, which maps to a universal 0 to 9,900 score. The default score name is XP, and Settings can change it to Gym Points, Points, Power Points, or a custom name. The selected progression style only changes how the score is represented. It does not change the underlying score or saved high scores. Styles include Prestige, the F-through-S Tier Scale, RPG, Competitive, Dragon Ball character equivalents, Soulslike, Power Class, Loot Rarity, Boss Ranks, a fixed community-inspired CS:GO knife ladder, Infinite Ammo, Baki Logic, and plain-language Training Levels.

Baki Logic is an explicitly fictional gag mode. Its ladder uses Baki characters as ranks and absurd feats as their subtitles. Suedo is the first target, set at 100 times the exercise's normal top-end target, and every later character becomes dramatically more ridiculous. The app deliberately keeps the user at Human instead of awarding a Baki character rank. Visible XP is intentionally absurd, while the real 0 to 9,900 score, saved weights, reps, and complete history remain unchanged. Its proportional preset is also deliberately impossible and is not presented as a training, health, or body-composition target.

A custom exercise can target one to six muscle groups. Its weighted ranking standards are the average of the selected groups' default reference exercises. Its contribution to overall strength is divided evenly among those selected groups, so selecting more muscles does not multiply one score's influence.

Dragon Ball character equivalents are a just-for-fun text option. Foss Gym does not include official franchise art or claim that the comparison is scientific.

BMI uses the standard adult weight-to-height calculation and adult categories. The optional body-fat estimate uses a circumference method based on height, waist, neck, and hips for the female comparison profile. Both are screening or trend indicators, not diagnoses.

Rankings are not a live leaderboard, medical assessment, or competition result. Training-level labels are also estimates, not certified athlete classifications. Machine setup, equipment, range of motion, and technique can materially change a score.

## World-record progression

World-record mode uses the absolute men's or women's IPF Open Classic record across all bodyweight classes for competition squat, bench press, and deadlift. The app uses the official IPF record tables linked from `https://www.powerlifting.sport/championships/records`; the bundled men's values were checked August 9, 2026 and the women's values June 27, 2026. The IPF table combines legal conventional and sumo deadlifts rather than publishing separate technique records.

For rep-scored movements, Foss Gym only accepts untimed records that match its clean consecutive-rep score. The bundled Guinness targets for the male comparison profile are consecutive pull-ups (1,224), chin-ups (612), and bodyweight squats (1,100). Guinness currently publishes no directly corresponding female record holder for these exact untimed metrics, so Foss Gym does not invent one. Timed push-up, pull-up, squat, and other endurance records are intentionally excluded.

Most machine, dumbbell, cable, bodyweight, and assistance exercises do not have a universal sanctioned setup or directly comparable record. Foss Gym displays “Not standardized” for those movements, keeps their practical training scale active, and omits the World Class row.

## Android widgets

Long-press an empty area of the Android home screen, choose Widgets, and find Foss Gym. Dashboard shows overall rank and coverage, Top Stats shows the three highest-rated exercises, Body shows weight/BMI/body fat, and Workout shows one plan. Multiple Workout widgets can be added; each widget's **Next plan** action selects its routine independently.

Modern Android does not provide ordinary third-party lock-screen AppWidgets on most devices. Foss Gym therefore exposes an active cooldown through a public ongoing notification, with a Reset action that can be used directly from the lock screen. Android 13 and later asks for notification permission the first time this control is needed.

## Gym equipment catalog

The app ships with editable defaults for Planet Fitness and Crunch Fitness. The companion `Foss-Gym-Planet-Fitness-Crunch-Equipment.csv` contains one row per chain and equipment item, its category, availability scope, whether it is enabled by default, correlated exercise IDs, an official source URL, verification date, and an inventory note.

There is no single machine inventory shared by every franchise location. The CSV distinguishes chain-listed equipment, common categories or official club examples, and equipment found only at select or premium locations. Exact brands, quantities, and individual machines must be confirmed against the club being used, which is why every location catalog remains editable in Settings.

## CSV backup

Settings has Export data and Import data actions. A backup CSV includes the profile, settings, saved strength and cardio scores, workout plans, legacy workout records, measurements, custom exercises, custom proportional ratios, weight and cardio goals, chart-display choices, and the local donation-reminder date. Import validates a Foss Gym backup and asks for confirmation before replacing the data currently stored in the app.

## Build

Requires Node.js 18+, npm, Java 8+, and network access for Nitron's small Android resource sidecars on the first build.

```bash
npm install
npm test
npm run build
```

The APK is generated at `dist/app.apk`.

The reviewed exercise artwork is bundled in `exercise-icons.js`. To regenerate that catalog from the standalone icon project, run `node scripts/sync-exercise-icons.mjs [concept-output-directory]` before building.

The prebuild step compiles the Foss Gym Android file-picker and widget bridge, adds the four widget providers and layouts, removes Nitron's default internet permission, and keeps tests, build scripts, native source, and documentation out of the APK web assets.

## Privacy

Foss Gym has no account, ads, analytics, cloud sync, or internet permission. It requests Android's vibration permission for feedback and the Android 13+ notification permission for the optional lock-screen cooldown control. Donation controls hand only the selected approved Stripe URL to the user's browser; the app itself does not make that network request. App data stays in Android WebView local storage and private widget preferences on the device. Uninstalling the app may erase that data, so export a CSV backup first if you want to keep it.

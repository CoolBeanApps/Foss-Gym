(function () {
  "use strict";

  const guides = {};

  function add(id, description, steps, tip) {
    guides[id] = { description: description, steps: steps, tip: tip };
  }

  add("bench-press", "A barbell press performed on a flat bench to train the chest, triceps, and front shoulders.", [
    "Lie on the bench with your eyes under the bar, feet flat, and shoulder blades pulled gently toward each other.",
    "Grip the bar slightly wider than shoulder width, straighten your wrists, and lift the bar over your shoulders.",
    "Lower the bar to the lower half of your chest while keeping your forearms close to vertical.",
    "Press the bar up and slightly back until your elbows are straight, then reset before the next rep."
  ], "Use a spotter or safety arms for heavy attempts. Keep your hips on the bench.");

  add("incline-bench", "A barbell press on an inclined bench that puts more work on the upper chest and front shoulders.", [
    "Set the bench to a low or moderate incline, plant your feet, and place your eyes just behind the bar.",
    "Pull your shoulder blades gently together, grip the bar, and move it over your upper chest.",
    "Lower the bar to the upper chest with your wrists over your forearms and elbows under control.",
    "Press the bar back over your shoulders until your arms are straight."
  ], "A very steep bench turns this into more of a shoulder press. Use a spotter or safety arms.");

  add("dumbbell-bench", "A flat-bench chest press performed with one dumbbell in each hand.", [
    "Sit with the dumbbells on your thighs, lie back, and bring them beside your chest with feet flat.",
    "Keep your shoulder blades against the bench and your wrists directly over your elbows.",
    "Press both dumbbells upward until your arms are straight without banging the weights together.",
    "Lower them slowly beside your chest and keep both sides moving through the same range."
  ], "The saved weight is the total of both dumbbells. Stop if your shoulders roll forward at the bottom.");

  add("dumbbell-fly", "A chest exercise that moves two dumbbells through a wide arc while the elbows stay slightly bent.", [
    "Lie on a flat bench with the dumbbells above your chest and palms facing each other.",
    "Keep a small, fixed bend in your elbows and open your arms out to the sides.",
    "Stop when you feel a chest stretch and your upper arms are roughly level with your torso.",
    "Bring the dumbbells back above your chest through the same wide arc."
  ], "Use much less weight than you would for a press. The saved weight is the total of both dumbbells.");

  add("push-up", "A floor press that trains the chest, triceps, shoulders, and trunk using body weight.", [
    "Place your hands slightly wider than your shoulders and extend your legs behind you.",
    "Tighten your stomach and glutes so your head, hips, and heels form one straight line.",
    "Bend your elbows and lower your chest toward the floor without letting your hips sag.",
    "Push the floor away until your arms are straight, then begin the next rep from the same position."
  ], "Raise your hands on a sturdy surface if floor reps are not yet clean.");

  add("decline-push-up", "A push-up with the feet elevated to shift more work toward the upper chest and shoulders.", [
    "Place your feet on a sturdy bench or step and your hands slightly wider than shoulder width.",
    "Tighten your stomach and glutes so your body stays straight from shoulders to heels.",
    "Lower your chest between your hands while keeping your elbows angled back, not straight out.",
    "Press to straight arms without bending at the hips."
  ], "Start with a low foot elevation. A higher surface makes the exercise harder and less stable.");

  add("wide-push-up", "A push-up with a wider hand position that places more emphasis on the chest.", [
    "Set your hands wider than your shoulders, point your fingers mostly forward, and extend your legs.",
    "Keep your stomach and glutes tight so your body remains straight.",
    "Lower your chest toward the floor while keeping your elbows below shoulder height.",
    "Press back to straight arms without letting your hips drop."
  ], "Do not place your hands so wide that your shoulders feel pinched or you cannot reach a controlled depth.");

  add("wall-push-up", "An upright push-up against a wall that builds pressing strength with less body weight.", [
    "Stand about an arm's length from a wall and place your palms on it at chest height.",
    "Step your feet back until your body forms a straight line from head to heels.",
    "Bend your elbows and bring your chest toward the wall without bending at the hips.",
    "Press the wall away until your arms are straight."
  ], "Move your feet farther from the wall to make the exercise harder while keeping the floor dry and clear.");

  add("bent-row", "A standing barbell row that trains the upper back and lats while the torso remains bent forward.", [
    "Hold the bar just outside your legs, push your hips back, and lean forward with a flat, steady back.",
    "Let your arms hang straight while keeping the bar close to your legs.",
    "Pull the bar toward your lower ribs by driving your elbows behind you.",
    "Lower the bar until your arms are straight without raising or dropping your torso."
  ], "Use less weight if you must jerk your chest upward to finish the pull.");

  add("lat-pulldown", "A cable pull that trains the lats and upper back from an overhead starting position.", [
    "Sit with your thighs secured, take an overhand grip, and lean back only slightly.",
    "Start by pulling your shoulders down away from your ears.",
    "Drive your elbows toward your ribs and bring the bar toward the top of your chest.",
    "Straighten your arms slowly overhead without letting the weight stack slam."
  ], "Pull the bar in front of your head. Do not yank it behind your neck.");

  add("t-bar-row", "A supported or landmine row that trains the lats, middle back, and rear shoulders.", [
    "Stand over the bar or enter the machine, take the handles, and keep your feet planted.",
    "Lean into the chest pad or hold a steady hip-hinged torso with your arms straight.",
    "Pull the handles toward your lower chest by moving your elbows behind you.",
    "Lower the weight until your arms are straight while keeping your torso still."
  ], "Do not shorten the range just to move more plates. Keep your neck in line with your back.");

  add("seated-cable-row", "A seated cable pull that trains the lats and middle back.", [
    "Sit with your feet braced, knees slightly bent, and hands on the handle.",
    "Sit tall with your arms straight and shoulders kept down away from your ears.",
    "Pull the handle toward your lower ribs while keeping your elbows close to your sides.",
    "Straighten your arms slowly without rounding far forward or letting the stack slam."
  ], "Keep your torso mostly still. A small natural lean is enough.");

  add("pull-up", "An overhand bodyweight pull from a hanging position to the top of a pull-up bar.", [
    "Hang from the bar with an overhand grip slightly wider than your shoulders and legs still.",
    "Pull your shoulders down away from your ears before bending your elbows.",
    "Drive your elbows toward your ribs until your chin passes the bar.",
    "Lower under control until your arms are straight before starting the next rep."
  ], "Do not count reps created by kicking, swinging, or shortening the bottom position.");

  add("chin-up", "An underhand bodyweight pull that trains the back and biceps.", [
    "Hang from the bar with palms facing you and hands about shoulder width apart.",
    "Keep your legs quiet and pull your shoulders down before bending your elbows.",
    "Pull your chest toward the bar until your chin clears it.",
    "Lower slowly to straight arms before the next rep."
  ], "Keep your wrists straight and stop if the underhand grip causes elbow pain.");

  add("inverted-row", "A bodyweight row performed under a secure bar or sturdy table.", [
    "Grip the bar or table edge, place your feet securely, and straighten your body under it.",
    "Keep your hips lifted so your ears, shoulders, hips, and heels stay in one line.",
    "Pull your chest toward the support by driving your elbows behind you.",
    "Lower until your arms are straight without letting your hips drop."
  ], "Test the table or bar before using it. It must not slide, tip, or break.");

  add("superman-pull", "A face-down bodyweight exercise that combines a small back lift with an elbow pull.", [
    "Lie face down with your arms reaching overhead, legs straight, and forehead close to the floor.",
    "Lift your chest and arms a small distance while keeping your neck neutral.",
    "Bend your elbows and pull them down toward your ribs as if making a goalpost shape.",
    "Reach your arms overhead again, then lower your chest to complete the rep."
  ], "Keep the lift small. Do not throw your head back or force a large arch in your lower back.");

  add("overhead-press", "A standing barbell press from the shoulders to overhead.", [
    "Stand with feet about hip width, hold the bar at the front of your shoulders, and tighten your stomach.",
    "Move your head slightly back so the bar can travel straight upward.",
    "Press the bar overhead until your arms are straight and the bar is over the middle of your feet.",
    "Move your head back out of the way and lower the bar to your shoulders under control."
  ], "Do not lean far backward to finish the press. Reduce the weight if your lower back arches heavily.");

  add("seated-press", "A seated barbell press that trains the shoulders and triceps.", [
    "Sit tall on a bench with your feet flat and the bar resting at the front of your shoulders.",
    "Grip just outside shoulder width and keep your stomach tight against the bench position.",
    "Press the bar overhead until your elbows are straight without pushing your head forward early.",
    "Lower the bar to the front of your shoulders under control."
  ], "Use a rack and safety setup. Do not lower the bar behind your neck.");

  add("dumbbell-shoulder-press", "A shoulder press performed with one dumbbell in each hand.", [
    "Sit or stand with a dumbbell beside each shoulder, palms mostly forward, and feet stable.",
    "Keep your stomach tight and wrists directly over your elbows.",
    "Press both dumbbells overhead until your arms are straight without banging them together.",
    "Lower them slowly to shoulder level with both sides moving evenly."
  ], "The saved weight is the total of both dumbbells. Do not turn the rep into a standing backbend.");

  add("arnold-press", "A dumbbell shoulder press that begins with the palms facing the body and rotates while pressing.", [
    "Hold both dumbbells in front of your shoulders with palms facing you and elbows in front.",
    "Begin pressing upward while opening your elbows out to the sides.",
    "Finish overhead with palms facing forward and arms straight.",
    "Reverse the motion slowly until the dumbbells return in front of your shoulders."
  ], "Use a smooth rotation and light enough weight to keep both wrists and elbows controlled. Save the total weight.");

  add("lateral-raise", "A dumbbell raise that trains the side of the shoulders.", [
    "Stand tall with a dumbbell in each hand, palms facing your thighs, and elbows slightly bent.",
    "Raise both arms out to the sides while keeping your shoulders down away from your ears.",
    "Stop around shoulder height with your hands and elbows level or nearly level.",
    "Lower the dumbbells slowly to your sides."
  ], "Use lighter weight if you need to swing. The saved weight is the total of both dumbbells.");

  add("pike-push-up", "A bodyweight shoulder press performed with the hips raised in an upside-down V shape.", [
    "Start on hands and feet, then walk your feet toward your hands until your hips are high.",
    "Keep your arms straight, hands about shoulder width, and look toward the space between your hands.",
    "Bend your elbows and lower the top of your head toward the floor slightly in front of your hands.",
    "Press the floor away until your arms are straight while keeping your hips high."
  ], "Bend your knees or elevate your hands if needed. Do not try to keep a straight line from head to heel.");

  add("handstand-push-up", "An advanced vertical bodyweight press performed upside down against a wall or freestanding.", [
    "Place your hands about shoulder width and enter a stable handstand with heels lightly against a wall if needed.",
    "Keep your stomach and glutes tight so your lower back does not fold into a large arch.",
    "Bend your elbows and lower your head between and slightly in front of your hands.",
    "Press back to straight arms without kicking away from the wall."
  ], "Use a padded surface and a safe exit plan. Build pike push-up strength before attempting full reps.");

  add("wall-walk", "A bodyweight shoulder and trunk exercise that walks from a floor plank toward a wall handstand.", [
    "Start face down with your feet touching the wall and hands beside your chest.",
    "Press into a plank, walk your feet up the wall, and take small hand steps toward the wall.",
    "Stop at the closest position you can hold without losing control or heavily arching your lower back.",
    "Walk your hands away and feet down until you return safely to the floor."
  ], "Keep enough strength in reserve to come down. Clear the floor before starting.");

  add("barbell-shrug", "A barbell lift that trains the upper trapezius by raising the shoulders.", [
    "Stand tall with the bar at arm's length in front of your thighs and hands just outside your legs.",
    "Keep your elbows straight and raise both shoulders directly toward your ears.",
    "Pause briefly at the highest controlled position.",
    "Lower your shoulders completely without bending your knees or bouncing the bar."
  ], "Move straight up and down. Do not roll your shoulders in circles.");

  add("dumbbell-shrug", "A shrug performed with one dumbbell in each hand to train the upper trapezius.", [
    "Stand tall with a dumbbell at each side, arms straight, and palms facing inward.",
    "Raise both shoulders directly toward your ears without bending your elbows.",
    "Pause briefly at the top while keeping your head neutral.",
    "Lower your shoulders to a full relaxed position."
  ], "The saved weight is the total of both dumbbells. Do not roll your shoulders.");

  add("upright-row", "A close-to-body pull that trains the shoulders and upper trapezius.", [
    "Stand with the bar or handles in front of your thighs and hands around shoulder width.",
    "Pull the weight upward close to your body by leading with your elbows.",
    "Stop when your elbows reach about shoulder height or earlier if your shoulders feel crowded.",
    "Lower the weight slowly to straight arms."
  ], "A wider grip and a shoulder-height limit are usually more comfortable than pulling high under the chin.");

  add("scapular-pull-up", "A small hanging movement that trains control of the shoulder blades without bending the elbows.", [
    "Hang from a pull-up bar with straight arms and a secure overhand grip.",
    "Keep your elbows locked and pull your shoulders down away from your ears.",
    "Let your body rise a small distance and pause in that active hanging position.",
    "Slowly let your shoulders rise again while your arms remain straight."
  ], "The range is small. If your elbows bend, the movement has turned into a pull-up.");

  add("prone-y-raise", "A face-down arm raise that trains the lower trapezius and muscles around the shoulder blades.", [
    "Lie face down with your forehead supported and arms reaching diagonally overhead to form a Y.",
    "Turn your thumbs upward and keep your shoulders away from your ears.",
    "Lift both arms a few inches by squeezing the muscles below and between your shoulder blades.",
    "Lower your arms slowly until they rest again."
  ], "The motion is small. Do not lift your chest or force your lower back to arch.");

  add("barbell-curl", "A standing barbell curl that trains the biceps.", [
    "Stand tall with an underhand grip, arms straight, and elbows beside your ribs.",
    "Curl the bar upward by bending your elbows while keeping your upper arms still.",
    "Stop when your forearms are near your upper arms without pushing your elbows far forward.",
    "Lower the bar slowly until your arms are straight."
  ], "Use less weight if your hips or lower back must swing the bar upward.");

  add("preacher-curl", "A curl performed with the upper arms supported on a preacher pad.", [
    "Adjust the seat so your armpits rest near the top of the pad and your upper arms lie flat on it.",
    "Start with the bar or handles held securely and elbows almost straight, not forcefully locked.",
    "Curl the weight upward without lifting your upper arms from the pad.",
    "Lower slowly to the same controlled bottom position."
  ], "Do not drop into the bottom. The supported position can place strong tension on the elbows and biceps.");

  add("dumbbell-curl", "A biceps curl performed with one dumbbell in each hand.", [
    "Stand or sit tall with a dumbbell at each side and palms facing forward.",
    "Keep your elbows beside your ribs and curl both dumbbells upward.",
    "Finish without moving your upper arms far forward or leaning back.",
    "Lower both dumbbells slowly until your arms are straight."
  ], "The saved weight is the total of both dumbbells. You may alternate arms, but count the total reps clearly.");

  add("hammer-curl", "A neutral-grip dumbbell curl that trains the biceps and upper forearms.", [
    "Hold a dumbbell at each side with palms facing your thighs and wrists straight.",
    "Keep your elbows close to your ribs and curl the dumbbells without turning your palms upward.",
    "Pause when your forearms approach your upper arms.",
    "Lower slowly to straight arms while keeping the thumb-up grip."
  ], "The saved weight is the total of both dumbbells. Avoid swinging your torso.");

  add("bodyweight-bicep-curl", "A bodyweight curl performed under a secure bar or against suspension straps.", [
    "Take an underhand grip and place your feet so your body leans back with arms straight.",
    "Keep your body firm from shoulders to knees or heels.",
    "Bend only your elbows to pull your forehead or hands toward the bar or handles.",
    "Straighten your arms slowly without letting your hips sag."
  ], "Use a more upright body angle to make it easier. Test the anchor before every set.");

  add("self-resisted-curl", "A no-equipment curl where one hand supplies resistance to the other arm.", [
    "Place one palm under the opposite wrist and keep the working elbow beside your ribs.",
    "Curl the working hand upward while the other hand presses downward with steady resistance.",
    "Keep the motion slow and continue resisting through the full curl.",
    "Switch arms and use similar effort and range on the other side."
  ], "Count both arms together as the total. Resistance is subjective, so compare your own reps rather than load.");

  add("close-grip-bench", "A flat barbell press with a moderate narrow grip that emphasizes the triceps.", [
    "Lie on the bench with feet planted and hands about shoulder width apart on the bar.",
    "Lift the bar over your shoulders while keeping your wrists straight.",
    "Lower it toward the lower chest with elbows staying closer to your sides than in a regular bench press.",
    "Press to straight arms without letting your shoulders roll forward."
  ], "Do not place your hands extremely close together. Use a spotter or safety arms for heavy attempts.");

  add("tricep-extension", "A lying elbow extension with a bar or dumbbells that trains the triceps.", [
    "Lie on a bench and hold the weight above your shoulders with arms straight.",
    "Keep your upper arms mostly still and bend your elbows to lower the weight near your forehead or just behind it.",
    "Stop at a comfortable elbow bend without letting the upper arms flare widely.",
    "Straighten your elbows to return the weight above your shoulders."
  ], "Use controlled weight and a secure grip. Do not let the load fall toward your face.");

  add("tricep-pushdown", "A cable elbow extension that trains the triceps.", [
    "Stand facing the cable with the handle near chest height and elbows beside your ribs.",
    "Keep your torso still and press the handle downward by straightening your elbows.",
    "Pause with straight arms without forcing the elbows past their natural position.",
    "Let the handle rise slowly while your upper arms remain beside your body."
  ], "Lower the weight if your shoulders or whole torso must move to finish each rep.");

  add("parallel-dip", "A bodyweight press on parallel bars that trains the triceps, chest, and shoulders.", [
    "Support yourself on locked arms with shoulders down, bars secure, and legs clear of the floor.",
    "Bend your elbows and lower your body while keeping your forearms controlled.",
    "Stop when your upper arms are around parallel to the floor or sooner if your shoulders feel strained.",
    "Press back to straight arms without bouncing from the bottom."
  ], "Do not force extra depth. Use assistance if you cannot control both directions.");

  add("bench-dip", "A bodyweight triceps press performed with the hands on a sturdy bench.", [
    "Sit at the bench edge, place your hands beside your hips, and move your hips just in front of the bench.",
    "Keep your back close to the bench and bend your elbows to lower a short, comfortable distance.",
    "Stop before your shoulders roll far forward or feel pinched.",
    "Press through your palms until your arms are straight."
  ], "Keep your feet closer to make it easier. Parallel-bar dips or close-grip push-ups may feel better on some shoulders.");

  add("diamond-push-up", "A narrow-hand push-up that emphasizes the triceps.", [
    "Place your hands under your chest with thumbs and index fingers close, but use a comfortable spacing.",
    "Extend your legs and keep your head, hips, and heels in one line.",
    "Lower your chest toward your hands while your elbows travel back beside your ribs.",
    "Press to straight arms without letting your hips sag."
  ], "Move your hands slightly apart if the diamond position bothers your wrists.");

  add("sphinx-push-up", "A bodyweight triceps exercise that presses from the forearms to the hands.", [
    "Start in a forearm plank with elbows under your shoulders and hands pointing forward.",
    "Keep your body straight and press your palms into the floor.",
    "Straighten your elbows to lift both forearms from the floor without raising your hips.",
    "Bend your elbows and lower both forearms under control."
  ], "Widen your feet for balance. Stop if the movement causes sharp elbow or wrist discomfort.");

  add("wrist-curl", "A forearm exercise that curls the palms toward the body while the forearms are supported.", [
    "Sit and support your forearms on your thighs or a bench with palms facing upward and wrists past the edge.",
    "Hold the weight securely and let your wrists extend a comfortable distance.",
    "Curl your palms upward by moving only at the wrists.",
    "Lower slowly to the starting stretch without lifting your forearms."
  ], "Use a light load and smooth range. The saved weight should match the total load being moved.");

  add("reverse-wrist-curl", "A palms-down wrist curl that trains the top side of the forearms.", [
    "Support your forearms on your thighs or a bench with palms facing down and wrists past the edge.",
    "Start with the wrists bent slightly downward while keeping a secure grip.",
    "Raise the backs of your hands by moving only at the wrists.",
    "Lower slowly without lifting your forearms from the support."
  ], "Use very light weight. These muscles are smaller than the muscles used in a palms-up wrist curl.");

  add("reverse-barbell-curl", "A palms-down barbell curl that trains the upper forearms and biceps.", [
    "Stand tall with an overhand grip, arms straight, and hands about shoulder width.",
    "Keep your wrists straight and elbows beside your ribs.",
    "Curl the bar upward without swinging your torso or letting your wrists fold back.",
    "Lower slowly until your arms are straight."
  ], "Use less weight than for a normal barbell curl. An angled curl bar may be more comfortable.");

  add("finger-curl", "A grip and forearm exercise that rolls a bar or dumbbells from the fingers into the palm.", [
    "Hold the weight with palms facing up and forearms supported or arms hanging safely at your sides.",
    "Open your fingers slowly enough for the weight to roll toward the fingertips without losing it.",
    "Close your fingers to roll the weight back into your palms.",
    "Add a small wrist curl only after the weight is secure in the hands."
  ], "Use collars and a clear floor area. Never let the bar roll beyond a grip you can control.");

  add("hand-gripper", "A hand-closing exercise using an adjustable gripper with resistance recorded in your selected weight unit.", [
    "Set both grippers to the same resistance and place one handle deep against your palm.",
    "Wrap all four fingers around the other handle while keeping your wrist straight.",
    "Squeeze until the handles touch or reach your full repeatable closing distance.",
    "Open the gripper slowly, finish the reps, and repeat with the other hand."
  ], "Record the gripper's marked kilogram setting. Count both hands together only if you train both sides equally.");

  add("fingertip-push-up", "An advanced push-up supported on the fingertips to challenge the fingers and forearms.", [
    "Kneel and spread your fingers wide, placing the fingertips under or slightly outside your shoulders.",
    "Begin from your knees or extend your legs only if your fingers can hold the position without collapsing.",
    "Lower your chest a controlled distance while keeping pressure shared across the fingers.",
    "Press back up without letting any finger buckle."
  ], "Start against a wall or from the knees. Stop immediately if you feel sharp finger or joint pain.");

  add("knuckle-push-up", "A push-up performed on closed fists to keep the wrists straight and challenge hand stability.", [
    "Use a padded, non-slip surface and make fists with the thumbs resting outside the fingers.",
    "Place the first two knuckles of each fist under your shoulders and extend your body into a straight plank.",
    "Lower your chest while keeping both wrists straight and elbows controlled.",
    "Press back to straight arms without rolling onto the smaller knuckles."
  ], "Do not perform this on a hard or slippery floor. Use regular push-ups if the knuckles feel painful.");

  add("cable-crunch", "A kneeling cable exercise that trains the abdominal muscles by curling the rib cage toward the pelvis.", [
    "Attach a rope to a high pulley, kneel facing the machine, and hold the rope beside your temples.",
    "Keep your hips nearly still and begin with your torso tall enough to feel tension on the cable.",
    "Tighten your abs and curl your ribs toward your pelvis while your elbows travel toward your thighs.",
    "Return slowly until your torso is upright again without letting the weight stack rest."
  ], "Do not pull the rope with your arms or turn the movement into a deep bow at the hips.");

  add("weighted-situp", "A sit-up performed while holding added weight against the chest.", [
    "Lie on your back with your knees bent, feet secure, and a plate or dumbbell held against your chest.",
    "Brace your stomach and lift your head, shoulders, and torso from the floor.",
    "Sit up until your torso is close to upright without pulling your head forward.",
    "Lower your spine to the floor under control before starting the next rep."
  ], "Start with the weight at your chest. Holding it overhead greatly increases difficulty and should be treated as a different setup.");

  add("crunch", "A short abdominal curl that lifts the shoulder blades while the lower back stays on the floor.", [
    "Lie on your back with knees bent, feet flat, and fingertips resting lightly behind your ears or across your chest.",
    "Tighten your abs and gently tuck your chin without pulling on your neck.",
    "Curl your ribs toward your pelvis until your shoulder blades lift from the floor.",
    "Lower slowly until your shoulder blades touch down, then repeat."
  ], "The range is small. Keep your lower back down and avoid yanking your head forward.");

  add("sit-up", "A full trunk curl that raises the torso from the floor toward the thighs.", [
    "Lie on your back with knees bent, feet flat or lightly anchored, and arms crossed over your chest.",
    "Tighten your stomach and begin rolling your shoulders and upper back from the floor.",
    "Continue upward until your torso is near your thighs without pulling on your neck.",
    "Lower one section of your back at a time until your shoulders return to the floor."
  ], "Use a slower pace or lightly anchor the feet if they lift. Stop if the movement causes lower-back pain.");

  add("reverse-crunch", "A floor exercise that curls the pelvis toward the ribs while the upper body stays supported.", [
    "Lie on your back with hips and knees bent about 90 degrees and arms pressing lightly into the floor.",
    "Tighten your abs and keep your knees together over your hips.",
    "Curl your tailbone from the floor and bring your knees a few inches toward your chest.",
    "Lower your pelvis slowly until it touches down without swinging your legs away."
  ], "Think about lifting the pelvis, not throwing the knees. A small controlled curl is a complete rep.");

  add("lying-leg-raise", "A floor exercise that trains the abs while both legs rise and lower together.", [
    "Lie on your back with legs straight and place your arms at your sides or hands under your hips for support.",
    "Press your lower back gently toward the floor and tighten your abs.",
    "Raise both legs until they point upward or reach your controlled end range.",
    "Lower them slowly and stop before your lower back lifts from the floor."
  ], "Bend your knees or shorten the lowering range if your back begins to arch.");

  add("hanging-knee-raise", "A hanging abdominal exercise that raises bent knees toward the chest.", [
    "Hang from a secure bar with a firm grip, straight arms, and your body still.",
    "Tighten your abs and bend your knees before beginning the lift.",
    "Raise your knees toward your chest by curling your pelvis forward rather than swinging.",
    "Lower your legs slowly until your body is still again."
  ], "Begin each rep from a quiet hang. If your grip fails first, use a captain's chair or supported station.");

  add("hanging-leg-raise", "An advanced hanging abdominal exercise that raises mostly straight legs.", [
    "Hang from a secure bar with straight arms, legs together, and no forward or backward swing.",
    "Tighten your abs and keep a small, comfortable bend in your knees.",
    "Raise your legs toward hip height or higher without kicking or leaning far backward.",
    "Lower your legs slowly and wait for your body to become still before repeating."
  ], "Use hanging knee raises first if you cannot keep the lift and lowering phase controlled.");

  add("v-up", "A floor exercise that lifts the torso and legs together so the hands reach toward the feet.", [
    "Lie flat with legs straight and arms extended overhead.",
    "Tighten your abs and lift both legs while raising your shoulders and torso.",
    "Reach your hands toward your shins or feet at the top without rounding your neck forward.",
    "Lower your torso, arms, and legs together under control."
  ], "Bend your knees and reach toward them for an easier version while keeping both sides synchronized.");

  add("bicycle-crunch", "A rotating floor crunch that brings each shoulder toward the opposite knee.", [
    "Lie on your back, place fingertips lightly behind your ears, and lift your bent knees over your hips.",
    "Extend one leg while curling the opposite shoulder toward the bent knee.",
    "Return through the center and switch sides without pulling on your head.",
    "Continue alternating while keeping your lower back controlled against the floor."
  ], "The saved rep count is total contacts across both sides. Move slowly enough to complete the rotation.");

  add("dead-bug", "A core stability exercise that lowers opposite arms and legs while the torso remains still.", [
    "Lie on your back with arms pointing upward and hips and knees bent to 90 degrees.",
    "Gently press your lower back toward the floor and tighten your stomach.",
    "Lower one arm overhead and extend the opposite leg without letting your back lift.",
    "Return both limbs to the start, switch sides, and repeat."
  ], "The saved rep count is total extensions across both sides. Shorten the reach if your lower back moves.");

  add("hollow-rock", "An abdominal exercise that rocks a rigid, rounded body position along the floor.", [
    "Lie on your back, press your lower back into the floor, and lift your head and shoulder blades.",
    "Raise your straight legs a comfortable distance and reach your arms overhead or beside your body.",
    "Keep the rounded shape fixed as you rock toward your shoulders and then toward your hips.",
    "Complete each forward and backward rock without using your arms or bending at the waist."
  ], "Tuck your knees or keep your arms beside you if you cannot keep the lower back pressed down.");

  add("heel-tap", "A side-to-side abdominal exercise that reaches each hand toward the same-side heel.", [
    "Lie on your back with knees bent, feet flat, and heels close enough to reach.",
    "Lift your head and shoulder blades slightly while keeping your neck relaxed.",
    "Bend sideways to tap or reach toward one heel, then return through the center.",
    "Reach toward the other heel and continue alternating without lifting your lower back."
  ], "The saved rep count is total reaches across both sides. Move the feet closer if needed.");

  add("mountain-climber", "A plank exercise that alternately drives each knee toward the chest.", [
    "Start in a high plank with hands under your shoulders and feet about hip width apart.",
    "Tighten your stomach and keep your shoulders stacked above your hands.",
    "Bring one knee toward your chest without lifting your hips, then place that foot back.",
    "Switch legs and continue at a pace that keeps your trunk steady."
  ], "The saved rep count is total knee drives across both legs. Speed only counts when the plank stays controlled.");

  add("straight-leg-sit-up", "A sit-up performed with both legs straight on the floor.", [
    "Lie on your back with legs together and straight, toes relaxed, and arms across your chest or reaching forward.",
    "Tighten your abs and lift your head, shoulders, and upper back from the floor.",
    "Continue curling up until your torso is upright while keeping your heels on the floor.",
    "Lower your spine under control until your shoulders touch down."
  ], "Reach your arms forward for balance. Stop if the straight-leg position causes lower-back discomfort.");

  add("toe-touch", "An abdominal crunch that reaches the hands toward raised feet.", [
    "Lie on your back and raise both legs toward the ceiling with knees softly bent.",
    "Extend your arms toward your feet and keep your lower back on the floor.",
    "Curl your shoulder blades up and reach your fingers toward your toes or shins.",
    "Lower your shoulders slowly while keeping your legs steady."
  ], "Reach upward rather than pulling your feet toward you. The hands do not need to touch the toes.");

  add("flutter-kick", "A floor exercise that alternates small up-and-down leg movements while the abs brace the pelvis.", [
    "Lie on your back with legs straight and place your hands under your hips or beside you.",
    "Press your lower back toward the floor and lift both heels a few inches.",
    "Raise one leg slightly as the other lowers, keeping both knees nearly straight.",
    "Continue alternating with small controlled kicks without letting either heel rest."
  ], "The saved rep count is total upward kicks across both legs. Raise the legs higher if your back arches.");

  add("scissor-kick", "A floor abdominal exercise that crosses mostly straight legs over and under each other.", [
    "Lie on your back with legs straight, hands under your hips or beside you, and lower back controlled.",
    "Lift both heels from the floor and separate your feet slightly wider than hip width.",
    "Cross one leg over the other, open them again, then cross with the other leg on top.",
    "Continue alternating the top leg while keeping the movement smooth and low."
  ], "The saved rep count is total crosses. Raise your legs or bend your knees if your lower back lifts.");

  add("shoulder-tap", "A high-plank stability exercise that alternates touching each hand to the opposite shoulder.", [
    "Start in a high plank with hands under your shoulders and feet wider than hip width for balance.",
    "Tighten your abs and glutes so your hips face the floor.",
    "Lift one hand and tap the opposite shoulder without shifting your trunk sideways.",
    "Replace the hand, switch sides, and continue with controlled weight transfers."
  ], "The saved rep count is total taps. Widen your feet or use your knees if your hips rotate.");

  add("plank-jack", "A high-plank exercise that jumps both feet apart and together while the upper body stays steady.", [
    "Start in a high plank with hands under your shoulders and feet together or hip width apart.",
    "Brace your stomach and keep your hips level with your shoulders.",
    "Jump both feet outward to a comfortable wide stance without moving your hands.",
    "Jump both feet back to the start and land softly to complete one rep."
  ], "Step one foot at a time instead of jumping if impact makes it hard to keep your torso still.");

  add("ab-wheel-rollout", "A kneeling rollout that trains the abs to prevent the lower back from arching.", [
    "Kneel on padding with the wheel below your shoulders and grip both handles firmly.",
    "Tighten your abs and glutes, then roll the wheel forward as your hips and shoulders move together.",
    "Stop before your lower back sags or you lose enough strength to return.",
    "Pull the wheel back toward your knees by tightening your abs while keeping your arms mostly straight."
  ], "Use a wall to limit the first few rollouts. A short clean range is safer than collapsing at full reach.");

  add("windshield-wiper", "A rotating core exercise that lowers raised legs from side to side.", [
    "Lie on your back with arms spread for support and raise your legs above your hips.",
    "Keep your shoulders on the floor and lower both legs toward one side under control.",
    "Stop before the opposite shoulder lifts or you can no longer slow the legs.",
    "Bring the legs through the center and lower them toward the other side."
  ], "The saved rep count is total side lowers. Bend your knees to reduce the leverage.");

  add("dragon-flag", "An advanced bench exercise that lowers a rigid body while the upper back remains supported.", [
    "Lie on a sturdy bench and grip its sides or a fixed support behind your head.",
    "Curl your pelvis upward and raise your body until your weight rests on your upper back, not your neck.",
    "Keep shoulders, hips, and knees aligned as you lower your body in one piece.",
    "Stop before your hips fold or touch down, then raise your body with the same rigid shape."
  ], "Practice slow negatives with bent knees first. Never support the movement on your neck.");

  add("cross-body-mountain-climber", "A plank exercise that drives each knee toward the opposite elbow.", [
    "Start in a high plank with hands under shoulders and feet placed for balance.",
    "Brace your stomach and bring one knee diagonally toward the opposite elbow.",
    "Return that foot to the floor without lifting or twisting your hips.",
    "Switch legs and continue alternating with the shoulders over the hands."
  ], "The saved rep count is total knee drives. Slow the pace until each diagonal path is clear.");

  add("cable-wood-chop", "A standing cable exercise that rotates the torso and arms across the body.", [
    "Set the pulley above shoulder height, stand sideways to it, and hold the handle with both hands.",
    "Step away for tension, soften your knees, and begin with your hands near the pulley-side shoulder.",
    "Rotate your chest and hips as you pull the handle diagonally across toward the opposite hip.",
    "Return slowly along the same path, finish the reps, then train the other side."
  ], "Keep your arms connected to your torso instead of pulling mainly with them. Use the same load on both sides.");

  add("dumbbell-side-bend", "A standing oblique exercise that bends the torso sideways while holding one dumbbell.", [
    "Stand tall with feet about hip width and hold one dumbbell at your side.",
    "Keep your chest facing forward and slide the dumbbell down the outside of that leg.",
    "Stop before your torso rotates or you lose a comfortable side stretch.",
    "Contract the opposite side of your waist to return upright, then complete the other side."
  ], "Do not hold a dumbbell in both hands because the loads largely cancel each other. Match both sides.");

  add("side-crunch", "A bodyweight abdominal curl that shortens one side of the waist at a time.", [
    "Lie on one side with knees bent, lower arm placed comfortably, and upper hand lightly behind your ear.",
    "Keep your hips stacked and lift your upper shoulder toward the same-side hip.",
    "Pause when the side of your waist is fully shortened without pulling your head.",
    "Lower slowly, finish the reps, then repeat on the other side."
  ], "The saved rep count is total reps across both sides. Use equal reps on each side.");

  add("side-plank-hip-dip", "A side-plank exercise that lowers and lifts the hips to train the obliques.", [
    "Set your forearm below your shoulder, stack or stagger your feet, and lift into a straight side plank.",
    "Keep your chest facing forward and lower your hips a controlled distance toward the floor.",
    "Press through your forearm and feet to raise your hips back into a straight line.",
    "Finish the reps with no forward rotation, then switch sides."
  ], "The saved rep count is total reps across both sides. Use the bottom knee for support if needed.");

  add("russian-twist", "A seated rotation that moves the hands from side to side while the trunk stays leaned back.", [
    "Sit with knees bent and heels on the floor, then lean back until your abs are working.",
    "Clasp your hands at the center of your chest and keep your spine long.",
    "Rotate your rib cage and hands toward one hip without simply swinging the arms.",
    "Rotate through the center toward the other hip and continue alternating."
  ], "The saved rep count is total side reaches. Keep the heels down until you can rotate without rounding or rocking.");

  add("deadlift", "A barbell pull from the floor that trains the hips, back, legs, and grip.", [
    "Stand with midfoot under the bar, bend at the hips and knees, and grip just outside your legs.",
    "Bring your shins near the bar, lift your chest, and brace before the plates leave the floor.",
    "Push the floor away and keep the bar close until you stand with hips and knees straight.",
    "Push your hips back, bend your knees after the bar passes them, and return the plates to the floor."
  ], "Use full-size plates or raise the bar to a safe starting height. Do not jerk the bar from a loose setup.");

  add("reverse-hyper", "A supported hip-extension exercise that raises the legs behind the body.", [
    "Lie face down on a reverse-hyper machine or high sturdy bench with your hips at the edge and torso secured.",
    "Let your legs hang with knees softly bent and hold the frame firmly.",
    "Squeeze your glutes and raise your legs until they are roughly in line with your torso.",
    "Lower the legs slowly without swinging beneath the support."
  ], "Do not kick the legs high enough to arch the lower back. Use a purpose-built machine for added load.");

  add("back-extension", "A bodyweight hip hinge performed on a back-extension bench.", [
    "Set the pad just below your hip crease, secure your feet, and cross your arms over your chest.",
    "Keep your spine steady and lower your torso by bending at the hips.",
    "Stop when your hamstrings limit the hinge or your torso points toward the floor.",
    "Squeeze your glutes and extend your hips until your body forms a straight line."
  ], "Finish in a straight line. Lifting higher by arching the lower back does not improve the rep.");

  add("superman", "A floor exercise that lifts both arms and legs to train the back and glutes.", [
    "Lie face down with arms extended overhead, legs straight, and forehead facing the floor.",
    "Tighten your glutes and gently lift both arms and both legs a few inches.",
    "Pause while keeping your neck in line with your spine and breathing normally.",
    "Lower all four limbs slowly until they touch the floor."
  ], "The lift should be small. Stop if you feel pinching in the lower back.");

  add("bird-dog", "A hands-and-knees stability exercise that reaches opposite arms and legs.", [
    "Start on hands and knees with hands under shoulders, knees under hips, and back level.",
    "Tighten your stomach and extend one arm forward with the opposite leg backward.",
    "Reach until the arm and leg align with your torso without rotating your hips.",
    "Return both to the floor, switch sides, and repeat."
  ], "The saved rep count is total reaches across both sides. Keep the range shorter if your back moves.");

  add("swimmer", "A face-down exercise that alternates lifting opposite arms and legs.", [
    "Lie face down with arms extended overhead, legs straight, and eyes toward the floor.",
    "Lift one arm and the opposite leg a small distance without turning your head.",
    "Lower them as the other arm and leg rise, keeping your hips against the floor.",
    "Continue alternating with smooth, controlled changes rather than fast flapping."
  ], "The saved rep count is total lifts across both sides. Use a small range that does not pinch your lower back.");

  add("back-squat", "A barbell squat with the bar supported across the upper back.", [
    "Set the bar in a rack below shoulder height, place it across your upper back, and grip it firmly.",
    "Stand the bar up, take short steps back, set your feet, and brace your torso.",
    "Bend your hips and knees together while keeping your whole foot planted and knees tracking over your toes.",
    "Descend to your controlled depth, then drive through your feet to stand fully."
  ], "Use rack safeties and a spotter for heavy attempts. Choose a bar position that rests on muscle, not your neck.");

  add("front-squat", "A barbell squat with the bar supported across the front of the shoulders.", [
    "Rest the bar across the fronts of your shoulders with elbows high and use a clean grip or crossed-arm grip.",
    "Stand the bar from the rack, take short steps back, and set your feet about shoulder width.",
    "Keep your elbows lifted as you bend your hips and knees and sit between your feet.",
    "Drive through your whole feet to stand without letting the bar roll forward."
  ], "Use rack safeties. Reduce the load if your elbows drop or your upper back rounds during the ascent.");

  add("leg-press", "A machine squat pattern that presses a weighted platform away with both legs.", [
    "Sit with your back and hips against the pads and place both feet securely on the platform.",
    "Release the safety handles, straighten your legs without locking the knees hard, and keep your hips down.",
    "Bend your knees toward your chest until you reach a depth where your pelvis stays against the pad.",
    "Push through your whole feet until your legs return to the starting position."
  ], "Never place your hands on your knees to help. Reengage the machine safeties before getting out.");

  add("bodyweight-squat", "A squat performed without external weight to train the legs and practice squat mechanics.", [
    "Stand with feet around shoulder width and toes turned slightly outward if comfortable.",
    "Reach your arms forward, brace your stomach, and bend your hips and knees together.",
    "Lower between your feet while keeping your heels down and knees aligned with your toes.",
    "Push through your whole feet and stand tall without letting your knees collapse inward."
  ], "Use a chair as a depth target if needed. Choose the deepest position you can control with heels down.");

  add("walking-lunge", "A forward-stepping lunge that alternates legs while moving across the floor.", [
    "Stand tall with clear space ahead and take a long, controlled step forward.",
    "Lower until both knees bend comfortably and the front foot remains fully planted.",
    "Push through the front foot and bring the rear leg forward into the next step.",
    "Repeat on the other leg while keeping your torso tall and knees aligned with your toes."
  ], "The saved rep count is total steps across both legs. Use shorter steps only if the front heel stays down.");

  add("bulgarian-split-squat", "A rear-foot-elevated split squat that trains one leg at a time.", [
    "Stand a step in front of a sturdy bench and place the top of one foot on it behind you.",
    "Set most of your pressure through the full front foot and keep your hips facing forward.",
    "Bend the front knee and lower the rear knee toward the floor without losing balance.",
    "Push through the front foot to stand, finish the reps, then switch legs."
  ], "The saved rep count is total reps across both legs. Move the front foot until the stance feels stable, not stretched.");

  add("step-up", "A single-leg exercise that steps onto a sturdy raised surface.", [
    "Face a stable box or step and place one whole foot on top.",
    "Lean slightly forward and press through the raised foot without jumping from the floor leg.",
    "Stand fully on the box with hips level, then step down under control.",
    "Complete the chosen pattern and repeat with the other leg."
  ], "The saved rep count is total step-ups across both legs. Lower the box if the heel lifts or the knee falls inward.");

  add("reverse-lunge", "A lunge that steps backward so the front leg controls most of the work.", [
    "Stand tall with feet under your hips and enough clear space behind you.",
    "Step one leg backward and land on the ball of that foot.",
    "Bend both knees and lower until the front foot stays flat and your balance remains controlled.",
    "Push through the front foot to return to standing, then switch legs."
  ], "The saved rep count is total lunges across both legs. Step back far enough that the front heel stays planted.");

  add("squat-pulse", "A bodyweight squat variation that repeats small rises and lowers near the bottom position.", [
    "Stand in your normal squat stance and lower into a controlled squat.",
    "Stay in the lower half of the range with feet flat and knees tracking over your toes.",
    "Rise several inches without standing fully, then lower back to the same depth.",
    "Count each down-and-up pulse while keeping your torso and foot pressure steady."
  ], "Choose a depth you can hold without knee pain or your heels lifting. Stand up safely when the set ends.");

  add("romanian-deadlift", "A barbell hip hinge that loads the hamstrings while the weight starts from standing.", [
    "Stand with the bar at your thighs, feet about hip width, arms straight, and knees softly bent.",
    "Push your hips backward and slide the bar down close to your legs.",
    "Stop when your hamstrings limit the hinge or your back can no longer stay steady.",
    "Drive your hips forward to stand and finish with your body tall, not leaning backward."
  ], "The bar does not need to reach the floor. Keep the same small knee bend throughout the hinge.");

  add("good-morning", "A barbell hip hinge performed with the bar supported across the upper back.", [
    "Place a light bar across your upper back, step from the rack, and set your feet about hip width.",
    "Soften your knees, brace your torso, and push your hips backward.",
    "Lean forward until your hamstrings feel loaded while keeping your back steady and feet flat.",
    "Squeeze your glutes and drive your hips forward to stand."
  ], "Start very light and use rack safeties. This is a hip hinge, not a squat or a rounded-back bow.");

  add("lying-leg-curl", "A machine exercise that bends the knees to train the hamstrings.", [
    "Lie face down with your knees close to the machine's pivot and the roller just above your heels.",
    "Hold the handles, keep your hips against the pad, and begin with legs nearly straight.",
    "Bend your knees and curl the roller toward your glutes without lifting your hips.",
    "Lower the roller slowly until your legs return to the start."
  ], "Adjust the machine before loading it. Use less weight if your hips rise or you must jerk the pad.");

  add("nordic-curl", "An advanced bodyweight hamstring exercise that controls the torso as it falls forward from the knees.", [
    "Kneel on padding and secure both ankles under a strong anchor that cannot move.",
    "Squeeze your glutes so your shoulders, hips, and knees form one straight line.",
    "Lower your whole body forward as slowly as possible without bending at the hips.",
    "Catch yourself with your hands, push lightly from the floor, and use your hamstrings to return."
  ], "Begin with a short lowering range or a resistance band. This movement creates high hamstring force quickly.");

  add("sliding-leg-curl", "A floor hamstring curl that slides the heels while the hips remain lifted.", [
    "Lie on your back with heels on sliders or towels over a smooth floor and knees bent.",
    "Lift your hips into a bridge and keep your shoulders and arms pressed into the floor.",
    "Slide both heels away until your legs are nearly straight without letting your hips drop.",
    "Dig your heels down and pull them back toward your hips to complete the rep."
  ], "Shorten the slide or lower your hips between reps if you cannot keep the return controlled.");

  add("hamstring-walkout", "A bridge variation that walks the heels away from and back toward the hips.", [
    "Lie on your back with knees bent, feet flat, and hips lifted into a glute bridge.",
    "Take several small heel steps away from your hips while keeping your pelvis raised.",
    "Stop before your legs straighten fully or your hips begin to sag.",
    "Walk your heels back under your knees and finish in the original bridge."
  ], "One walk out and back is one rep. Use shorter steps and a smaller distance while learning it.");

  add("single-leg-bodyweight-rdl", "A single-leg hip hinge that trains hamstrings, glutes, and balance without added weight.", [
    "Stand on one leg with that knee softly bent and the other foot just off the floor.",
    "Push your hips backward as your free leg reaches behind you and your torso leans forward.",
    "Keep your hips facing the floor and stop when the standing hamstring is loaded or balance fades.",
    "Drive through the standing foot to return upright, finish the reps, then switch legs."
  ], "The saved rep count is total reps across both legs. Touch a wall lightly if balance limits the hinge.");

  add("sumo-squat", "A loaded wide-stance squat that emphasizes the inner thighs and glutes.", [
    "Stand wider than shoulder width with toes turned out comfortably and hold the weight securely.",
    "Brace your torso and bend your hips and knees while keeping your whole feet planted.",
    "Lower between your legs with knees tracking in the same direction as your toes.",
    "Push the floor apart and stand tall without letting your knees fall inward."
  ], "Choose a stance that lets your knees and toes align. Wider is not automatically better.");

  add("adductor-machine", "A seated machine exercise that pulls the thighs inward against resistance.", [
    "Sit with your back against the pad, place your inner thighs against the leg pads, and select a light load.",
    "Use the adjustment lever to open your legs only to a comfortable starting width.",
    "Press both thighs inward until the pads meet or reach the machine's end position.",
    "Let the pads open slowly while your hips and back stay against the seat."
  ], "Do not force a very wide stretch. Reengage the adjustment lever before leaving the machine.");

  add("side-lunge", "A lateral lunge that bends one leg while the other stays long.", [
    "Stand tall with enough clear space to one side and take a wide step sideways.",
    "Push your hips back over the stepping leg while keeping that whole foot planted.",
    "Bend the stepping knee as the other leg stays straight and both feet remain mostly forward.",
    "Push through the bent leg to return to center, then repeat on the other side."
  ], "The saved rep count is total lunges across both sides. Shorten the step if the foot rolls or knee falls inward.");

  add("copenhagen-hip-lift", "A side-plank variation that uses the top inner thigh on a bench to lift the hips.", [
    "Lie on your side with the top leg supported on a sturdy bench and your forearm below your shoulder.",
    "Keep the lower leg beneath the bench and press the top leg down into the support.",
    "Lift your hips until your trunk and top leg form a straight line.",
    "Lower your hips under control, finish the reps, then switch sides."
  ], "The saved rep count is total reps across both sides. Support the top knee instead of the foot for an easier version.");

  add("cossack-squat", "A deep side-to-side squat that bends one knee while the other leg stays straight.", [
    "Take a very wide stance with toes turned out enough for your knees to track comfortably.",
    "Shift your hips toward one leg and bend that knee while keeping its heel down.",
    "Keep the other leg straight and allow its toes to lift if needed as you reach a controlled depth.",
    "Push through the bent leg to return to center, then squat toward the other side."
  ], "The saved rep count is total squats across both sides. Use a support and a shallow range while developing mobility.");

  add("bodyweight-sumo-squat", "A wide-stance bodyweight squat that trains the inner thighs, glutes, and legs.", [
    "Stand wider than shoulder width with toes turned out comfortably and hands held in front.",
    "Brace your stomach and bend your knees and hips together.",
    "Lower between your legs while your knees follow your toes and heels stay down.",
    "Push through your whole feet to stand tall and squeeze your glutes."
  ], "Adjust the stance width until your feet stay flat and your knees move without discomfort.");

  add("hip-thrust", "A loaded hip extension with the upper back supported on a bench.", [
    "Sit with your upper back against a sturdy bench, place the padded bar across your hip crease, and plant your feet.",
    "Brace your stomach and drive through both heels as your hips rise.",
    "Stop when your torso is roughly level, shins are near vertical, and glutes are fully contracted.",
    "Lower your hips under control while keeping the bar centered."
  ], "Do not finish by arching your lower back. Secure the bench so it cannot slide.");

  add("sumo-deadlift", "A wide-stance barbell pull from the floor that trains the hips, legs, back, and grip.", [
    "Stand with feet wider than shoulder width, toes turned out, and the bar over your midfoot.",
    "Bend your hips and knees, grip the bar inside your legs, and brace with your chest lifted.",
    "Push the floor apart and keep the bar close as your hips and knees straighten together.",
    "Push your hips back, bend your knees, and return the bar to the floor under control."
  ], "Choose a stance that lets your knees follow your toes. Do not jerk the bar from a loose starting position.");

  add("cable-kickback", "A standing cable exercise that extends one hip to train the glute.", [
    "Attach an ankle cuff to a low pulley, face the machine, and hold it for balance.",
    "Stand tall on one leg with the working knee softly bent and cable running clear of your body.",
    "Drive the working leg backward from the hip without turning your pelvis or arching your back.",
    "Return the foot slowly, finish the reps, then attach the cuff to the other ankle."
  ], "Use the same load and range on both sides. A small glute-driven movement is enough.");

  add("glute-bridge", "A floor hip-extension exercise that raises the pelvis using both glutes.", [
    "Lie on your back with knees bent, feet flat about hip width, and arms beside you.",
    "Tighten your stomach and press through both heels.",
    "Lift your hips until your shoulders, hips, and knees form a straight line.",
    "Squeeze your glutes briefly, then lower your pelvis slowly to the floor."
  ], "Move your feet until your shins are near vertical at the top. Do not push the finish through your lower back.");

  add("single-leg-glute-bridge", "A glute bridge performed with one foot on the floor.", [
    "Lie on your back with both knees bent, then lift one foot and hold that knee toward your chest.",
    "Keep your hips level and press through the heel of the planted foot.",
    "Raise your pelvis until the planted-side hip is fully extended without twisting.",
    "Lower slowly, finish the reps, then switch legs."
  ], "The saved rep count is total reps across both legs. Use two legs if you cannot keep the pelvis level.");

  add("donkey-kick", "A hands-and-knees glute exercise that presses one bent leg upward.", [
    "Start on hands and knees with hands under shoulders, knees under hips, and back level.",
    "Keep one knee bent about 90 degrees and tighten your stomach.",
    "Lift that thigh behind you until it is near the height of your torso without rotating your hips.",
    "Lower the knee under control, finish the reps, then switch legs."
  ], "The saved rep count is total reps across both legs. Stop the lift before your lower back arches.");

  add("fire-hydrant", "A hands-and-knees glute exercise that lifts one bent leg out to the side.", [
    "Start on hands and knees with hands under shoulders, knees under hips, and back level.",
    "Keep one knee bent and tighten your stomach so your pelvis stays facing the floor.",
    "Lift that knee out to the side without shifting your weight or turning your torso.",
    "Lower the knee slowly, finish the reps, then switch legs."
  ], "The saved rep count is total reps across both legs. Use a smaller lift if your hips rotate.");

  add("frog-pump", "A glute bridge with the soles of the feet together and knees opened outward.", [
    "Lie on your back, bring the soles of your feet together, and let your knees open comfortably.",
    "Place the joined feet close enough to your hips that you can press through their outer edges.",
    "Tighten your glutes and raise your hips without forcing the knees farther apart.",
    "Lower your pelvis under control until it lightly touches the floor."
  ], "Keep the range comfortable for your hips. The movement should come from the glutes, not a lower-back arch.");

  add("standing-calf-raise", "A loaded calf exercise performed while standing with straight or softly bent knees.", [
    "Stand with the balls of both feet secure on a platform or flat floor and hold the support or load safely.",
    "Keep your ankles aligned and lower your heels to a comfortable stretch if the platform allows it.",
    "Press through the balls of your feet and raise your heels as high as you can without rolling the ankles.",
    "Pause at the top and lower slowly to the starting position."
  ], "Do not bounce. If using a raised platform, keep a hand near a stable support for balance.");

  add("seated-calf-raise", "A seated loaded calf exercise that emphasizes the soleus with the knees bent.", [
    "Sit in the machine with the balls of your feet on the platform and the thigh pad secured above your knees.",
    "Raise your heels slightly, release the machine stop, and lower into a comfortable calf stretch.",
    "Press through the balls of both feet and raise your heels as high as possible.",
    "Pause, lower slowly, and reengage the stop before leaving the machine."
  ], "Keep your feet from sliding and avoid bouncing out of the bottom position.");

  add("calf-press", "A loaded calf raise performed on a leg-press machine with the knees kept almost straight.", [
    "Set the seat so your legs are nearly straight without locking the knees, then place the balls of both feet on the lower edge of the platform.",
    "Keep your hips and back against the pad and hold the machine handles before releasing the safety stops.",
    "Let your heels move toward you into a comfortable calf stretch while the knees keep the same slight bend.",
    "Press the platform away through the balls of your feet, pause at the top, then lower slowly before reengaging the safeties."
  ], "Only your ankles should move. Keep enough of each foot on the platform that it cannot slip, and never unlock the machine with your toes barely supported.");

  add("bodyweight-calf-raise", "A standing calf raise performed with body weight on both feet.", [
    "Stand tall with feet about hip width and keep fingertips on a stable support for balance.",
    "Keep your ankles straight and shift pressure through the balls of both feet.",
    "Raise both heels as high as possible without leaning your body forward.",
    "Pause at the top and lower both heels slowly to the floor."
  ], "Use a stair for more range only if it is secure and you can hold a railing.");

  add("single-leg-calf-raise", "A bodyweight calf raise performed on one foot at a time.", [
    "Stand on one foot beside a stable support and bend the free leg so it stays clear of the floor.",
    "Keep the working ankle aligned and lower its heel to the floor or a comfortable platform stretch.",
    "Press through the ball of that foot and raise the heel as high as possible.",
    "Lower slowly, finish the reps, then switch feet."
  ], "The saved rep count is total reps across both legs. Use only light fingertip support and match the range on each side.");

  add("bent-knee-calf-raise", "A bodyweight calf raise performed with the knees bent to emphasize the soleus.", [
    "Stand near a stable support with feet about hip width and bend both knees into a shallow squat.",
    "Hold the knee bend steady and keep your torso upright.",
    "Raise both heels by pressing through the balls of your feet without straightening your knees.",
    "Pause at the top and lower the heels slowly while keeping the same knee angle."
  ], "Use a small knee bend you can hold for the full set. Do not bounce or let your ankles roll outward.");

  window.FossExerciseGuides = {
    get: function (id) { return guides[id] || null; },
    has: function (id) { return Boolean(guides[id]); },
    ids: function () { return Object.keys(guides); }
  };
})();

import { app } from "nitron";

app.init({
  name: "Foss Gym",
  packageId: "com.foss.workouts",
  version: "1.24.0",
  entry: "index.html",
  orientation: "portrait",
  statusBar: true,
  permissions: ["VIBRATE", "POST_NOTIFICATIONS"],
  icon: {
    src: "icon.svg",
    background: "#0B0E0C"
  }
});

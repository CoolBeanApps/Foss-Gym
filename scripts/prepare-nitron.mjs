import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const cliPath = resolve("node_modules/nitron/dist/cli.js");
let source = await readFile(cliPath, "utf8");

const stockPermissions = 'new Set([...config.permissions.map((p) => p.toUpperCase()), "INTERNET"])';
const localPermissions = "new Set(config.permissions.map((p) => p.toUpperCase()))";

if (source.includes(stockPermissions)) {
  source = source.replace(stockPermissions, localPermissions);
} else if (!source.includes(localPermissions)) {
  throw new Error("Could not locate Nitron permission generation code.");
}

const homeCache = 'join4(homedir(), ".nitron", "android")';
const tempCache = 'join4(tmpdir2(), "nitron", "android")';
if (source.includes(homeCache)) {
  source = source.replaceAll(homeCache, tempCache);
} else if (!source.includes(tempCache)) {
  throw new Error("Could not locate Nitron Android cache directory.");
}

if (!source.includes('  "scripts",\n  "test",\n  "README.md",')) {
  source = source.replace(
    '  "dist",\n',
    '  "dist",\n  "scripts",\n  "test",\n  "README.md",\n'
  );
}

if (!source.includes('  "android",\n')) {
  source = source.replace(
    '  "dist",\n',
    '  "dist",\n  "android",\n'
  );
}

const unpackMarker = "    buildDir = await unpackTemplate(templatePath);";
const nativeDexCopy = '    await copyFile2(join5(options.projectDir, "android", "classes.dex"), join5(buildDir, "classes.dex"));';

if (!source.includes(nativeDexCopy)) {
  if (!source.includes(unpackMarker)) throw new Error("Could not locate Nitron template unpacking code.");
  source = source.replace(unpackMarker, unpackMarker + "\n" + nativeDexCopy);
}

const resourceImport = 'import { mkdir as mkdir4, writeFile as writeFile4, rm, chmod, access as access3 } from "fs/promises";';
const resourceImportWithCopy = 'import { mkdir as mkdir4, writeFile as writeFile4, rm, chmod, access as access3, cp as cp4 } from "fs/promises";';
if (source.includes(resourceImport)) {
  source = source.replace(resourceImport, resourceImportWithCopy);
} else if (!source.includes(resourceImportWithCopy)) {
  throw new Error("Could not locate Nitron resource filesystem imports.");
}

const valuesDirectoryMarker = '    await mkdir4(join4(resDir, "values"), { recursive: true });';
const nativeResourceCopy = '    await cp4(join4(projectDir, "android", "res"), resDir, { recursive: true, force: true });';
if (!source.includes(nativeResourceCopy)) {
  if (!source.includes(valuesDirectoryMarker)) throw new Error("Could not locate Nitron resource directory setup.");
  source = source.replace(valuesDirectoryMarker, valuesDirectoryMarker + "\n" + nativeResourceCopy);
}

const widgetReceiverMarker = "com.nicron.webview.DashboardWidgetProvider";
if (!source.includes(widgetReceiverMarker)) {
  const applicationEnd = "        </activity>\n    </application>";
  const receivers = `        </activity>

        <receiver android:name="com.nicron.webview.DashboardWidgetProvider" android:label="Foss Gym Dashboard" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_dashboard_info" />
        </receiver>
        <receiver android:name="com.nicron.webview.StatsWidgetProvider" android:label="Foss Gym Top Stats" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_stats_info" />
        </receiver>
        <receiver android:name="com.nicron.webview.BodyWidgetProvider" android:label="Foss Gym Body Metrics" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_body_info" />
        </receiver>
        <receiver android:name="com.nicron.webview.WorkoutWidgetProvider" android:label="Foss Gym Workout" android:exported="false">
            <intent-filter><action android:name="android.appwidget.action.APPWIDGET_UPDATE" /></intent-filter>
            <meta-data android:name="android.appwidget.provider" android:resource="@xml/widget_workout_info" />
        </receiver>
    </application>`;
  if (!source.includes(applicationEnd)) throw new Error("Could not locate Nitron application manifest ending.");
  source = source.replace(applicationEnd, receivers);
}

[
  ["com.nicron.webview.DashboardWidgetProvider", "Foss Gym Dashboard"],
  ["com.nicron.webview.StatsWidgetProvider", "Foss Gym Top Stats"],
  ["com.nicron.webview.BodyWidgetProvider", "Foss Gym Body Metrics"],
  ["com.nicron.webview.WorkoutWidgetProvider", "Foss Gym Workout"]
].forEach(([provider, label]) => {
  const withoutLabel = `<receiver android:name="${provider}" android:exported="false">`;
  const withLabel = `<receiver android:name="${provider}" android:label="${label}" android:exported="false">`;
  if (source.includes(withoutLabel)) source = source.replace(withoutLabel, withLabel);
});

await writeFile(cliPath, source, "utf8");
console.log("Prepared private Android packaging with Foss Gym home-screen widgets.");

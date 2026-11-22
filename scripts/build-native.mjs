import { access, copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve, join } from "node:path";
import AdmZip from "adm-zip";

const run = promisify(execFile);
const projectRoot = resolve(".");
const cacheDir = join("/tmp", "nitron", "android");
const androidJar = join(cacheDir, "android.jar");
const r8Jar = join(cacheDir, "r8-9.4.12.jar");
const classDir = resolve("android", "native-classes");
const dexDir = resolve("android", "native-dex");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  await writeFile(path, new Uint8Array(await response.arrayBuffer()));
}

async function ensureAndroidJar() {
  if (await exists(androidJar)) return;
  const platformZip = join(cacheDir, "platform-34.zip");
  console.log("Downloading Android 34 compile framework...");
  await download("https://dl.google.com/android/repository/platform-34-ext7_r01.zip", platformZip);
  const archive = new AdmZip(platformZip);
  const entry = archive.getEntries().find((item) => item.entryName.endsWith("android.jar"));
  if (!entry) throw new Error("Android framework archive did not contain android.jar");
  archive.extractEntryTo(entry, cacheDir, false, true);
  await rm(platformZip, { force: true });
}

async function ensureR8() {
  if (await exists(r8Jar)) return;
  console.log("Downloading the Android D8 compiler...");
  await download("https://dl.google.com/dl/android/maven2/com/android/tools/r8/9.4.12/r8-9.4.12.jar", r8Jar);
}

async function filesUnder(directory, suffix) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await filesUnder(path, suffix));
    else if (entry.isFile() && entry.name.endsWith(suffix)) found.push(path);
  }
  return found;
}

await mkdir(cacheDir, { recursive: true });
await Promise.all([ensureAndroidJar(), ensureR8()]);
await rm(classDir, { recursive: true, force: true });
await rm(dexDir, { recursive: true, force: true });
await mkdir(classDir, { recursive: true });
await mkdir(dexDir, { recursive: true });

const javaSources = [resolve("android", "MainActivity.java"), ...await filesUnder(resolve("android", "native-src"), ".java")];
await run("java", [
  "--module", "jdk.compiler/com.sun.tools.javac.Main",
  "-source", "8",
  "-target", "8",
  "-Xlint:-options",
  "-classpath", androidJar,
  "-d", classDir,
  ...javaSources
], { cwd: projectRoot, maxBuffer: 10 * 1024 * 1024 });

const classFiles = await filesUnder(classDir, ".class");
await run("java", [
  "-cp", r8Jar,
  "com.android.tools.r8.D8",
  "--release",
  "--min-api", "21",
  "--lib", androidJar,
  "--output", dexDir,
  ...classFiles
], { cwd: projectRoot, maxBuffer: 20 * 1024 * 1024 });

await copyFile(join(dexDir, "classes.dex"), resolve("android", "classes.dex"));
console.log(`Compiled ${javaSources.length} native sources for Foss Gym widgets and file access.`);

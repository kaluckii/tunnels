// src/modules/status/index.ts
import { createRequire } from "module";
import { execa } from "execa";
import path from "path";
var require2 = createRequire(import.meta.url);
async function showPM2Status() {
  const pm2Main = require2.resolve("pm2");
  const pm2Bin = path.resolve(pm2Main, "../../.bin", process.platform === "win32" ? "pm2.cmd" : "pm2");
  await execa(pm2Bin, ["status"], { stdio: "inherit" });
}
async function runCommand() {
  await showPM2Status();
}

export {
  showPM2Status,
  runCommand
};

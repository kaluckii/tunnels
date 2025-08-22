// src/modules/logs/index.ts
import { createRequire } from "module";
import { execa } from "execa";
import path from "path";
var require2 = createRequire(import.meta.url);
async function showPM2Logs() {
  const pm2Main = require2.resolve("pm2");
  const pm2Bin = path.resolve(pm2Main, "../../.bin", process.platform === "win32" ? "pm2.cmd" : "pm2");
  await execa(pm2Bin, ["logs"], { stdio: "inherit" });
}
async function runCommand() {
  await showPM2Logs();
}
export {
  runCommand,
  showPM2Logs
};

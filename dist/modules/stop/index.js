// src/modules/stop/index.ts
import { createRequire } from "module";
import { execa } from "execa";
import path from "path";
var require2 = createRequire(import.meta.url);
async function stopPM2Processes() {
  const pm2Main = require2.resolve("pm2");
  const pm2Bin = path.resolve(pm2Main, "../../.bin", process.platform === "win32" ? "pm2.cmd" : "pm2");
  await execa(pm2Bin, ["stop", "all"], { stdio: "inherit" });
  await execa(pm2Bin, ["delete", "all"], { stdio: "inherit" });
  console.log("All PM2 processes stopped and deleted.");
}
async function runCommand() {
  await stopPM2Processes();
}
export {
  runCommand,
  stopPM2Processes
};

import {
  readConfigFile
} from "../../chunk-4CEHP6EX.js";
import {
  showPM2Status
} from "../../chunk-HSM3C5YK.js";

// src/modules/run/index.ts
import { createRequire } from "module";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
var require2 = createRequire(import.meta.url);
var pm2 = require2("pm2");
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var IS_WIN = process.platform === "win32";
async function resolvePackageBin() {
  const staticDir = path.resolve(__dirname, "..", "..", "..", "static");
  const bin = path.join(staticDir, IS_WIN ? "loophole-win.exe" : "loophole-linux");
  if (!await fs.pathExists(bin)) throw new Error(`Loophole binary not found: ${bin}`);
  if (!IS_WIN) await fs.chmod(bin, 493).catch(() => {
  });
  return bin;
}
async function runViaPm2(tunnels) {
  const bin = await resolvePackageBin();
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) return reject(err);
      let started = 0;
      tunnels.forEach((t) => {
        pm2.start(
          {
            name: t.prefix,
            script: bin,
            args: ["http", String(t.port), `--hostname=${t.prefix}`],
            exec_mode: "fork",
            autorestart: true
          },
          (startErr) => {
            if (startErr) {
              console.error(`Failed to start ${t.prefix}:`, startErr.message);
            }
            if (++started === tunnels.length) {
              pm2.disconnect();
              resolve();
            }
          }
        );
      });
    });
  });
}
async function runCommand() {
  const config = await readConfigFile();
  if (!config.tunnels.length) {
    console.warn("No tunnels specified in the configuration file.");
    return;
  }
  try {
    await runViaPm2(config.tunnels);
    console.log("Tunnels launched via PM2 and running in background.");
    await showPM2Status();
  } catch (err) {
    console.error("Failed to start tunnels:", err?.message || err);
  }
}
export {
  runCommand
};

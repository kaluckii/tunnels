import { createRequire } from 'node:module';

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import { readConfigFile } from '../../config/config.controllers.js';
import { Tunnel } from '../../config/config.schemas.js';
import { showPM2Status } from '../status/index.js';

const require = createRequire(import.meta.url);
const pm2 = require('pm2');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IS_WIN = process.platform === 'win32';

async function resolvePackageBin(): Promise<string> {
  // Resolves the path to the Loophole binary based on the platform.

  const staticDir = path.resolve(__dirname, '..', '..', '..', 'static');
  const bin = path.join(staticDir, IS_WIN ? 'loophole-win.exe' : 'loophole-linux');
  if (!(await fs.pathExists(bin))) throw new Error(`Loophole binary not found: ${bin}`);
  if (!IS_WIN) await fs.chmod(bin, 0o755).catch(() => {});
  return bin;
}

async function runViaPm2(tunnels: Tunnel[]): Promise<void> {
  // Starts the Loophole tunnels using PM2 for process management.

  const bin = await resolvePackageBin();

  return new Promise((resolve, reject) => {
    pm2.connect((err: Error) => {
      if (err) return reject(err);

      let started = 0;
      tunnels.forEach((t) => {
        pm2.start(
          {
            name: t.prefix,
            script: bin,
            args: ['http', String(t.port), `--hostname=${t.prefix}`],
            exec_mode: 'fork',
            autorestart: true,
          },
          (startErr: Error) => {
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

export async function runCommand(): Promise<void> {
  const config = await readConfigFile();
  if (!config.tunnels.length) {
    console.warn('No tunnels specified in the configuration file.');
    return;
  }

  try {
    await runViaPm2(config.tunnels);
    console.log('Tunnels launched via PM2 and running in background.');
    await showPM2Status();
  } catch (err: any) {
    console.error('Failed to start tunnels:', err?.message || err);
  }
}

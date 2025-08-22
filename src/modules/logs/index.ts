import { createRequire } from 'node:module';

import { execa } from 'execa';
import path from 'path';

const require = createRequire(import.meta.url);

export async function showPM2Logs(): Promise<void> {
  // Displays the logs of PM2 processes.

  const pm2Main = require.resolve('pm2');
  const pm2Bin = path.resolve(pm2Main, '../../.bin', process.platform === 'win32' ? 'pm2.cmd' : 'pm2');

  await execa(pm2Bin, ['logs'], { stdio: 'inherit' });
}

export async function runCommand(): Promise<void> {
  await showPM2Logs();
}

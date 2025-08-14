import { createRequire } from 'node:module';

import { execa } from 'execa';
import path from 'path';

const require = createRequire(import.meta.url);

export async function stopPM2Processes(): Promise<void> {
  // Stops all PM2 processes and deletes them.

  const pm2Main = require.resolve('pm2');
  const pm2Bin = path.resolve(pm2Main, '../../.bin', process.platform === 'win32' ? 'pm2.cmd' : 'pm2');

  await execa(pm2Bin, ['stop', 'all'], { stdio: 'inherit' });
  await execa(pm2Bin, ['delete', 'all'], { stdio: 'inherit' });

  console.log('All PM2 processes stopped and deleted.');
}

export async function runCommand(): Promise<void> {
  await stopPM2Processes();
}

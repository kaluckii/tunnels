import { readConfigFile } from '../../config/config.controllers.js';

export async function runCommand(): Promise<void> {
  // Entry point for initializing tunnels configation file.

  const config = await readConfigFile();
  console.log('Configuration file ensured.')
}

#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cac } from 'cac';
import fs from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const commandList = ['init', 'run', 'status', 'stop'] as const;

async function runModule(command: string, options: Record<string, any>) {
  // Checks if the command is valid and exists in the command list.
  // Also ensures that corresponding module file exists in (src/modules).

  const modulePath = join(__dirname, 'modules', command, 'index.js');

  if (!(await fs.pathExists(modulePath))) {
    throw new Error(`Module for command "${command}" does not exist at path: ${modulePath}`);
  }

  const mod = await import(`file://${modulePath}`);
  await mod.runCommand(options);
}

// Proceeds CLI initialization.
const cli = cac('tunnels');

// Register commands dynamically.
for (const command of commandList) {
  cli.command(command, `Run ${command} command`).action((...args) => {
    const options = args.pop();
    return runModule(command, options);
  });
}

// Additional help and version information.
cli.help();
cli.parse();

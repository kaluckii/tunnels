#!/usr/bin/env node

// src/main.ts
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { cac } from "cac";
import fs from "fs-extra";
var __dirname = dirname(fileURLToPath(import.meta.url));
var commandList = ["init", "run", "status", "stop", "logs"];
async function runModule(command, options) {
  const modulePath = join(__dirname, "modules", command, "index.js");
  if (!await fs.pathExists(modulePath)) {
    throw new Error(`Module for command "${command}" does not exist at path: ${modulePath}`);
  }
  const mod = await import(`file://${modulePath}`);
  await mod.runCommand(options);
}
var cli = cac("tunnels");
for (const command of commandList) {
  cli.command(command, `Run ${command} command`).action((...args) => {
    const options = args.pop();
    return runModule(command, options);
  });
}
cli.command("*", "Invalid command").action((command) => {
  console.error(`
Unknown command: "${command}"`);
  console.log("Available commands:", commandList.join(", "));
  process.exit(1);
});
cli.help();
cli.parse();
export {
  commandList
};

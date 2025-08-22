// src/config/config.controllers.ts
import fs from "fs-extra";
import prompts from "prompts";

// src/config/config.defaults.ts
var defaultConfig = {
  $schema: "https://raw.githubusercontent.com/kaluckii/tunnels/refs/heads/main/static/tunnels.schema.json",
  tunnels: []
};

// src/config/config.schemas.ts
import z from "zod";
var TunnelSchema = z.object({
  prefix: z.string(),
  port: z.number().positive()
});
var ConfigSchema = z.object({
  $schema: z.url(),
  tunnels: z.array(TunnelSchema)
});

// src/config/config.controllers.ts
var CONFIG_FILE = "tunnels.config.json";
var writeDefaultConfig = async () => fs.writeJson(CONFIG_FILE, defaultConfig, { spaces: 2 });
async function askForConfigRewrite() {
  const response = await prompts({
    type: "confirm",
    name: "rewrite",
    message: "The config file is invalid, do you want to rewrite it with default values?",
    initial: true
  });
  return response.rewrite;
}
async function readConfigFile() {
  if (!await fs.pathExists(CONFIG_FILE)) {
    await writeDefaultConfig();
  }
  const rawContent = await fs.readFile(CONFIG_FILE, "utf8");
  const parsedContent = ConfigSchema.safeParse(JSON.parse(rawContent));
  if (!parsedContent.success) {
    if (await askForConfigRewrite()) {
      await writeDefaultConfig();
      return defaultConfig;
    } else throw new Error(`Invalid config file: ${parsedContent.error.message}`);
  }
  return parsedContent.data;
}

export {
  readConfigFile
};

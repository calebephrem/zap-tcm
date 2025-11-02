import fs from 'fs';
import os from 'os';
import path from 'path';
import { readFile, writeFile } from '../utils/fs.js';

export const configPaths = {
  local: path.join('.', '.zapconfig'),
  global: path.join(os.homedir(), '.zapconfig'),
};

export async function getGlobalConfig() {
  if (!fs.existsSync(configPaths.global)) {
    return {};
  }
  const config = await readFile(configPaths.global);
  const parsed = JSON.parse(config);
  return parsed;
}

export async function getLocalConfig() {
  if (!fs.existsSync(configPaths.local)) {
    return {};
  }
  const config = await readFile(configPaths.local);
  const parsed = JSON.parse(config);
  return parsed;
}

export async function setConfig(scope = 'global', key, value) {
  if (scope === 'global') {
    const currentConfig = await getGlobalConfig();
    currentConfig[key] = value;
    await writeFile(configPaths.global, JSON.stringify(currentConfig, null, 2));
  } else if (scope === 'local') {
    const currentConfig = await getLocalConfig();
    currentConfig[key] = value;
    await writeFile(configPaths.local, JSON.stringify(currentConfig, null, 2));
  }
}

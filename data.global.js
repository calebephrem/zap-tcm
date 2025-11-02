import { getGlobalConfig, getLocalConfig } from './core/config.js';

const globalConfig = await getGlobalConfig();
const localConfig = await getLocalConfig();

export const globalData = {
  version: '4.0.0',
  globalConfig,
  localConfig,
};

export default globalData;

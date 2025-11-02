import path from 'path';
import { getGlobalConfig, getLocalConfig } from '../core/config.js';

const globalConfig = await getGlobalConfig();
const localConfig = await getLocalConfig();

export const data = {
  basedir: path.join('.', '.zap'),
  branch: path.join('.', '.zap', 'branch'),
  version: '3.7.0',
  globalConfig,
  localConfig,
};

export default data;

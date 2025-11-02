import os from 'os';
import path from 'path';
import { globalData } from '../data.global.js';

export const data = {
  ...globalData,
  basedir: path.join(os.homedir(), '.zap'),
  branch: path.join(os.homedir(), '.zap', 'branch'),
};

export default data;

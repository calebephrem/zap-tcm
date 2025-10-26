import path from 'path';
import { readdir, readFile } from '../utils/fs.js';
import { cLog, clr } from '../utils/log.js';
import { getBranchObject } from './branch.js';
import data from './data.js';

export async function stats() {
  const branchObj = await getBranchObject();
  const totalTasks = branchObj.todos.length;
  const completedTasks = branchObj.todos.filter(
    (todo) => todo.completed
  ).length;
  const incompleteTasks = totalTasks - completedTasks;
  const productivityRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(2)
    : 0;
  cLog(`Statistics for branch: ${clr(branchObj.name, 'blueBright')}`);
  cLog(`Total tasks: ${clr(totalTasks, 'greenBright')}`);
  cLog(`Completed tasks: ${clr(completedTasks, 'cyanBright')}`);
  cLog(`Incomplete tasks: ${clr(incompleteTasks, 'redBright')}`);
  cLog(`Productivity rate: ${clr(productivityRate, 'magentaBright')}%`);
}

export async function globalStats() {
  const branchFiles = await readdir(data.basedir);
  let totalTasks = 0;
  let completedTasks = 0;
  for (const file of branchFiles) {
    if (file === 'branch') continue;
    const content = await readFile(path.join(data.basedir, file));
    const branchObj = JSON.parse(content);
    const todos = branchObj.todos || [];
    totalTasks += todos.length;
    completedTasks += todos.filter((todo) => todo.completed).length;
  }
  const incompleteTasks = totalTasks - completedTasks;
  const productivityRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(2)
    : 0;
  cLog(`Global Statistics across all branches:`);
  cLog(`Total tasks: ${clr(totalTasks, 'greenBright')}`);
  cLog(`Completed tasks: ${clr(completedTasks, 'cyanBright')}`);
  cLog(`Incomplete tasks: ${clr(incompleteTasks, 'redBright')}`);
  cLog(`Productivity rate: ${clr(productivityRate, 'magentaBright')}%`);
}

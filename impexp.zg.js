import { cLog } from './utils/log.js';
import {
  branch,
  currentBranch,
  deleteBranch,
  getBranchObject,
  importExportBranch,
  mergeBranches,
  renameBranch,
  switchBranch,
  writeBranchObject,
} from './zapg/branch.js';
import { getGlobalConfig, setConfig } from './zapg/config.js';
import { data } from './zapg/data.js';
import { searchTodos, searchTodosGlobally } from './zapg/search.js';
import { globalStats, stats } from './zapg/stats.js';
import { removeTag, renameTag, tag } from './zapg/tag.js';
import {
  addTask,
  completeTask,
  deleteTask,
  getTodos,
  incompleteTask,
  init,
  listTasks,
  moveTask,
  updateTask,
  updateTodo,
} from './zapg/task.js';

export {
  addTask,
  branch,
  cLog,
  completeTask,
  currentBranch,
  data,
  deleteBranch,
  deleteTask,
  getBranchObject,
  getGlobalConfig,
  getTodos,
  globalStats,
  importExportBranch,
  incompleteTask,
  init,
  listTasks,
  mergeBranches,
  moveTask,
  removeTag,
  renameBranch,
  renameTag,
  searchTodos,
  searchTodosGlobally,
  setConfig,
  stats,
  switchBranch,
  tag,
  updateTask,
  updateTodo,
  writeBranchObject
};


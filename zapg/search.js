import path from 'path';
import { readdir, readFile } from '../utils/fs.js';
import { cLog, zapclr } from '../utils/log.js';
import { getBranchObject } from './branch.js';
import data from './data.js';

export async function searchTodos(keyword) {
  if (!keyword) {
    cLog('Please provide a keyword to search for.', 'redBright');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const results = todos.filter((todo) =>
    todo.task.toLowerCase().includes(keyword.toLowerCase())
  );
  if (results.length === 0) {
    cLog('No matching tasks found.');
    return;
  }
  cLog(
    `Found ${results.length} matching task${results.length > 1 ? 's' : ''}:`
  );
  results.forEach((todo) => {
    cLog(
      `${zapclr(todo.id, 'id')}. [${todo.completed ? zapclr('x', 'x') : ' '}] ${
        todo.task
      }${todo.tag ? ` (${zapclr(todo.tag, 'tag')})` : ``}`
    );
  });
}

export async function searchTodosGlobally(keyword) {
  if (!keyword) {
    cLog('Please provide a keyword to search for.', 'redBright');
    process.exit(1);
  }
  const branchFiles = await readdir(data.basedir);
  let allResults = [];
  for (const file of branchFiles) {
    if (file === 'branch') continue;
    const content = await readFile(path.join(data.basedir, file));
    const branchObj = JSON.parse(content);
    const todos = branchObj.todos || [];
    const results = todos.filter((todo) =>
      todo.task.toLowerCase().includes(keyword.toLowerCase())
    );
    results.forEach((todo) => {
      allResults.push({
        branch: branchObj.name,
        id: todo.id,
        task: todo.task,
        completed: todo.completed,
        tag: todo.tag,
      });
    });
  }
  if (allResults.length === 0) {
    cLog('No matching tasks found across all branches.');
    return;
  }
  cLog(
    `Found ${allResults.length} matching task${
      allResults.length > 1 ? 's' : ''
    } across all branches:`
  );
  allResults.forEach((todo) => {
    cLog(
      `[${zapclr(todo.branch, 'branch')}] ${zapclr(todo.id, 'id')}. [${
        todo.completed ? zapclr('x', 'x') : ' '
      }] ${todo.task}${todo.tag ? ` (${zapclr(todo.tag, 'tag')})` : ``}`
    );
  });
}

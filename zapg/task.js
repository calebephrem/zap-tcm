import fs from 'fs';
import path from 'path';
import ucid from 'unique-custom-id';
import { createFolder, readFile, writeFile } from '../utils/fs.js';
import { cLog, zapclr } from '../utils/log.js';
import {
  branch,
  currentBranch,
  getBranchObject,
  writeBranchObject,
} from './branch.js';
import data from './data.js';

export async function init() {
  if (!fs.existsSync(data.basedir)) {
    await createFolder(data.basedir);
    await branch(data.globalConfig['init.defaultBranch'] || 'main', false);
    await writeFile(
      data.branch,
      data.globalConfig['init.defaultBranch'] || 'main'
    );
  } else {
    cLog('.zap repository already exists.', 'redBright');
    process.exit(1);
  }
  cLog(`Initialized empty zap repository in ${zapclr(data.basedir, 'init')}`);
}

export async function moveTask(id, targetBranch) {
  const sourceBranch = await currentBranch();
  if (sourceBranch === targetBranch) {
    cLog('Source and target branches are the same.', 'redBright');
    process.exit(1);
  }
  const sourceObj = await getBranchObject();
  const todoIndex = sourceObj.todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    cLog(
      `Task with id ${zapclr(id, 'id')} not found in branch ${zapclr(
        sourceBranch,
        'branch'
      )}.`,
      'redBright'
    );
    process.exit(1);
  }
  const [todo] = sourceObj.todos.splice(todoIndex, 1);
  await writeBranchObject(sourceObj);
  const targetFile = path.join(data.basedir, `${targetBranch}.json`);
  let targetObj;
  try {
    const content = await readFile(targetFile);
    targetObj = JSON.parse(content);
  } catch (err) {
    targetObj = {
      id: ucid.format('sha'),
      name: targetBranch,
      todos: [],
    };
  }
  targetObj.todos.push(todo);
  await writeBranchObject(targetObj);
  cLog(
    `Moved task id ${zapclr(id, 'id')} from ${zapclr(
      sourceBranch,
      'branch'
    )} to ${zapclr(targetBranch, 'branch')}.`
  );
}

export async function addTask(task) {
  if (!task) {
    cLog('Please provide a task.', 'redBright');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  const createdAt = new Date().toISOString();
  const createdBy = {
    name: data.globalConfig['user.name'] || undefined,
    email: data.globalConfig['user.email'] || undefined,
  };
  todos.push({
    id,
    task,
    completed: false,
    createdAt,
    createdBy: createdBy.name || createdBy.email ? createdBy : undefined,
  });
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  cLog(`Added todo: ${task}`);
}

export async function getTodos() {
  const branchObj = await getBranchObject();
  return branchObj.todos || [];
}

export async function listTasks() {
  const todos = await getTodos();
  if (todos.length === 0) {
    cLog('No tasks found.');
    return;
  }
  todos.forEach((todo) => {
    cLog(
      `${zapclr(todo.id, 'id')}. [${todo.completed ? zapclr('x', 'x') : ' '}] ${
        todo.task
      }${todo.tag ? ` (${zapclr(todo.tag, 'tag')})` : ``}`
    );
  });
}

export async function completeTask(id) {
  if (!id) {
    cLog('Please provide a task id.', 'redBright');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    cLog(`Task with id ${zapclr(id, 'id')} not found.`, 'redBright');
    process.exit(1);
  }
  todos[index].completed = true;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  cLog(`Completed task: ${todos[index].task}`);
}

export async function incompleteTask(id) {
  if (!id) {
    cLog('Please provide a task id.', 'redBright');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    cLog(`Task with id ${zapclr(id, 'id')} not found.`, 'redBright');
    process.exit(1);
  }
  todos[index].completed = false;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  cLog(`Marked task as incomplete: ${todos[index].task}`);
}

export async function deleteTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    cLog(`Task with id ${zapclr(id, 'id')} not found.`, 'redBright');
    process.exit(1);
  }
  const [deleted] = todos.splice(index, 1);
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  cLog(`Deleted task: ${deleted.task}`);
}

export async function updateTask(id, task) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id == id);

  if (index === -1) {
    cLog(`Task with id ${clrzap(id, 'id')} not found.`, 'redBright');
    process.exit(1);
  }

  if (!task) {
    cLog('Please provide a new task description.', 'redBright');
    process.exit(1);
  }

  const updated = { ...todos[index], task };
  todos[index] = updated;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  cLog(`Updated task: ${updated.task}`);
}

export async function updateTodo(id, todo, log = true) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id == id);

  if (index === -1) {
    cLog(`Todo with id ${zapclr(id, 'id')} not found.`, 'redBright');
    process.exit(1);
  }

  if (!todo) {
    cLog('Please provide a new todo.', 'redBright');
    process.exit(1);
  }

  todos[index] = todo;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  log ? cLog(`Updated todo: ${zapclr(id, 'id')}`) : null;
}

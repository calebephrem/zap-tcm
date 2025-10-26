import fs from 'fs';
import path from 'path';
import ucid from 'unique-custom-id';
import { createFolder, readFile, writeFile } from '../utils/fs.js';
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
    await writeFile(data.branch, data.globalConfig['init.defaultBranch'] || 'main');
  } else {
    console.error('.zap repository already exists.');
    process.exit(1);
  }
  console.log('Initialized empty zap repository in', data.basedir);
}

export async function moveTask(id, targetBranch) {
  const sourceBranch = await currentBranch();
  if (sourceBranch === targetBranch) {
    console.error('Source and target branches are the same.');
    process.exit(1);
  }
  const sourceObj = await getBranchObject();
  const todoIndex = sourceObj.todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    console.error(`Task with id ${id} not found in branch ${sourceBranch}.`);
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
  console.log(`Moved task id ${id} from ${sourceBranch} to ${targetBranch}.`);
}

export async function addTask(task) {
  if (!task) {
    console.error('Please provide a task.');
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
  console.log(`Added todo: ${task}`);
}

export async function getTodos() {
  const branchObj = await getBranchObject();
  return branchObj.todos || [];
}

export async function listTasks() {
  const todos = await getTodos();
  if (todos.length === 0) {
    console.log('No tasks found.');
    return;
  }
  todos.forEach((todo) => {
    console.log(
      `${todo.id}. [${todo.completed ? 'x' : ' '}] ${todo.task}${
        todo.tag ? ` (${todo.tag})` : ``
      }`
    );
  });
}

export async function completeTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].completed = true;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Completed task: ${todos[index].task}`);
}

export async function incompleteTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].completed = false;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Marked task as incomplete: ${todos[index].task}`);
}

export async function deleteTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  const [deleted] = todos.splice(index, 1);
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Deleted task: ${deleted.task}`);
}

export async function updateTask(id, task) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id == id);

  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }

  if (!task) {
    console.error('Please provide a new task description.');
    process.exit(1);
  }

  const updated = { ...todos[index], task };
  todos[index] = updated;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Updated task: ${updated.task}`);
}

export async function updateTodo(id, todo, log = true) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id == id);

  if (index === -1) {
    console.error(`Todo with id ${id} not found.`);
    process.exit(1);
  }

  if (!todo) {
    console.error('Please provide a new todo.');
    process.exit(1);
  }

  todos[index] = todo;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  log ? console.log(`Updated todo: ${id}`) : null;
}

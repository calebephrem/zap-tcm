import { cLog, zapclr } from '../utils/log.js';
import { getTodos, updateTodo } from './task.js';

export async function tag(id, tag) {
  if (!id || !tag) {
    cLog('Please provide both id and tag', 'redBright');
    process.exit(1);
  }
  if (tag.length > 20) {
    cLog('Tag length should not exceed 20 characters', 'redBright');
    process.exit(1);
  }
  const todos = await getTodos();
  const todo = todos.filter((t) => t.id == id)[0];
  todo.tag = tag;
  await updateTodo(id, todo, false);
  cLog(`Added tag "${zapclr(tag, 'tag')}" to todo: ${zapclr(id, 'id')}`);
}

export async function removeTag(tag) {
  if (!tag) {
    cLog('Please provide a tag', 'redBright');
    process.exit(1);
  }
  const todos = await getTodos();
  const todo = todos.filter((t) => t.tag == tag)[0];
  const index = todos.indexOf(todo);
  const id = todos[index].id;
  todo.tag = undefined;
  await updateTodo(id, todo, false);
  cLog(`Removed tag "${zapclr(tag, 'tag')}" from todo: ${zapclr(id, 'id')}`);
}

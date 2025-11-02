import path from 'path';
import ucid from 'unique-custom-id';
import { readdir, readFile, rmfile, writeFile } from '../utils/fs.js';
import { cLog, padLog, zapclr } from '../utils/log.js';
import { sliceSHA } from '../utils/zap.js';
import data from './data.js';

export async function branch(name, log = true) {
  if (!name) {
    const branches = await readdir(data.basedir);
    const currentbr = await currentBranch();
    branches.forEach((b, i) => {
      branches[i] = b.replace('.json', b === `${currentbr}.json` ? ' *' : '');
    });
    branches.splice(branches.indexOf('branch'), 1);
    padLog(branches.join('\n'));
    return;
  }

  const id = ucid.format('sha');

  const obj = { id: id, name, todos: [] };
  await writeFile(
    path.join(data.basedir, `${name}.json`),
    JSON.stringify(obj, null, 2)
  );
  log
    ? cLog(
        `Created branch: ${zapclr(name, 'branch')} [${zapclr(
          sliceSHA(id),
          'id'
        )}]`
      )
    : null;
}

export async function getBranchObject() {
  const br = await currentBranch();
  const file = path.join(data.basedir, `${br}.json`);
  try {
    const content = await readFile(file);
    const parsed = JSON.parse(content || '[]');

    if (Array.isArray(parsed)) {
      const obj = { id: ucid.format('sha'), name: br, todos: parsed };
      await writeFile(file, JSON.stringify(obj, null, 2));
      return obj;
    }
    if (parsed && typeof parsed === 'object') {
      parsed.todos = parsed.todos || [];
      parsed.name = parsed.name || br;
      parsed.id = parsed.id || ucid.format('sha');
      return parsed;
    }
    const obj = { id: ucid.format('sha'), name: br, todos: [] };
    await writeFile(file, JSON.stringify(obj, null, 2));
    return obj;
  } catch (err) {
    const obj = { id: ucid.format('sha'), name: br, todos: [] };
    await writeFile(file, JSON.stringify(obj, null, 2));
    return obj;
  }
}

export async function writeBranchObject(branchObj) {
  const file = path.join(data.basedir, `${branchObj.name}.json`);
  await writeFile(file, JSON.stringify(branchObj, null, 2));
}

export async function deleteBranch(name) {
  if (!name) {
    cLog('Please provide a branch name to delete.', 'redBright');
    process.exit(1);
  }
  const branches = await readdir(data.basedir);
  const exists = branches.includes(`${name}.json`);
  if (!exists) {
    cLog(`Branch ${zapclr(name, 'branch')} does not exist.`, 'redBright');
    process.exit(1);
  }
  const raw = await readFile(path.join(data.basedir, `${name}.json`));
  const id = JSON.parse(raw).id;
  await rmfile(path.join(data.basedir, `${name}.json`));
  cLog(
    `Deleted branch ${zapclr(name, 'branch')} [${zapclr(sliceSHA(id), 'id')}]`
  );
}

export async function mergeBranches(sourceBranch, targetBranch, sort = true) {
  if (!targetBranch) {
    targetBranch = await currentBranch();
  }
  if (!sourceBranch) {
    cLog('Please provide a source branch to merge from.', 'redBright');
  }
  if (sourceBranch === targetBranch) {
    cLog("Source and target branches can't be the same.", 'redBright');
    process.exit(1);
  }
  const sourceFile = path.join(data.basedir, `${sourceBranch}.json`);
  const targetFile = path.join(data.basedir, `${targetBranch}.json`);
  let sourceObj, targetObj;
  try {
    const sourceContent = await readFile(sourceFile);
    sourceObj = JSON.parse(sourceContent);
  } catch (err) {
    cLog(`Source branch ${sourceBranch} does not exist.`, 'redBright');
    process.exit(1);
  }
  try {
    const targetContent = await readFile(targetFile);
    targetObj = JSON.parse(targetContent);
  } catch (err) {
    targetObj = {
      id: ucid.format('sha'),
      name: targetBranch,
      todos: [],
    };
  }
  targetObj.todos = targetObj.todos.concat(sourceObj.todos);
  targetObj.todos.forEach((todo, i) => {
    todo.id = i + 1;
  });
  if (sort) {
    targetObj.todos.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }
  await writeBranchObject(targetObj);
  cLog(
    `Merged branch ${zapclr(sourceBranch, 'branch')} into ${zapclr(
      targetBranch,
      'branch'
    )}.`
  );
}

export async function renameBranch(branchName, newBranchName) {
  if (!branchName || !newBranchName) {
    cLog('Please provide both the current and new branch names.', 'redBright');
    process.exit(1);
  }
  const branches = await readdir(data.basedir);
  const exists = branches.includes(`${branchName}.json`);
  if (!exists) {
    cLog(`Branch ${zapclr(branchName, 'branch')} does not exist.`, 'redBright');
    process.exit(1);
  }
  const newExists = branches.includes(`${newBranchName}.json`);
  if (newExists) {
    cLog(
      `Branch ${zapclr(newBranchName, 'branch')} already exists.`,
      'redBright'
    );
    process.exit(1);
  }
  const oldPath = path.join(data.basedir, `${branchName}.json`);
  const newPath = path.join(data.basedir, `${newBranchName}.json`);
  const content = await readFile(oldPath);
  const branchObj = JSON.parse(content);
  branchObj.name = newBranchName;
  await writeFile(newPath, JSON.stringify(branchObj, null, 2));
  await rmfile(oldPath);
  const currentbr = await currentBranch();
  if (currentbr === branchName) {
    await writeFile(data.branch, newBranchName);
  }
}

export async function importExportBranch(name, direction, filepath) {
  if (!name || !direction || !filepath) {
    cLog(
      'Please provide branch name, direction (import/export), and file path.',
      'redBright'
    );
    process.exit(1);
  }
  const file = path.join(data.basedir, `${name}.json`);
  if (direction === 'export') {
    const branchObj = await getBranchObject();
    await writeFile(filepath, JSON.stringify(branchObj, null, 2));
    cLog(
      `Exported branch ${zapclr(name, 'branch')} to ${zapclr(
        filepath,
        'branch'
      )}`
    );
  } else if (direction === 'import') {
    const content = await readFile(filepath);
    await writeFile(file, content);
    cLog(
      `Imported branch ${zapclr(name, 'branch')} from ${zapclr(
        filepath,
        'branch'
      )}`
    );
  } else {
    cLog('Direction must be either "import" or "export".', 'redBright');
    process.exit(1);
  }
}

export async function switchBranch(br) {
  const branches = await readdir(data.basedir);
  const exists = branches.includes(`${br}.json`);
  if (!exists) {
    await branch(br);
    await writeFile(data.branch, br);
  } else {
    await writeFile(data.branch, br);
  }
  cLog(`Switched to branch: ${zapclr(br, 'branch')}`);
}

export async function currentBranch() {
  const br = await readFile(data.branch);
  return br.trim();
}

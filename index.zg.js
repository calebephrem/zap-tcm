#!/usr/bin/env node

import {
  addTask,
  branch,
  cLog,
  completeTask,
  data,
  deleteBranch,
  deleteTask,
  getGlobalConfig,
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
} from './impexp.zg.js';

const args = process.argv.slice(2);

const cmd = process.argv.slice(2)[0].startsWith('--')
  ? undefined
  : process.argv.slice(2)[0];

const helpText = `
                                  ███████╗ █████╗ ██████╗
                                  ╚══███╔╝██╔══██╗██╔══██╗
                                    ███╔╝ ███████║██████╔╝
                                   ███╔╝  ██╔══██║██╔═══╝ 
                                  ███████╗██║  ██║██║     
                                  ╚══════╝╚═╝  ╚═╝╚═╝   
                                      Task Manager

Usage:
  zapg <command> [options]

Core Commands:
  init                                  Initialize a zap repository
  branch [name]                         Create a branch (or list branches if name is not provided)
  branch [-d | --delete] <name>         Delete a branch
  switch <name>                         Switch to a branch

Task Management:
  add <task>                            Add a new task to the current branch
  list                                  List tasks in current branch
  update <id> <task>                    Update a task by ID
  remove <id>                           Remove a task
  complete <id>                         Mark as complete
  incomplete <id>                       Mark as incomplete
  stats [-g | --global]                 Show statistics (global if flag provided)

Search & Organization:
  search <keyword>                      Search in current branch
  search [-g | --global] <keyword>      Search globally
  tag <id> <tag>                        Add a tag
  tag [-d | --delete] <id> <tag>        Remove a tag
  move <id> <branch>                    Move task to another branch

Import / Export:
  import <branch> <file>                Import tasks into branch
  export <branch> <file>                Export tasks to file

Branch Intelligence:
  merge <source> <target> [--unsort]    Merge branches (unsort based on createdAt if flag provided)
  stats                                 Show branch stats
  stats [-g | --global]                 Global statistics

Configuration:
  config [-g | --global] <key> <value>  Set global configuration
  config [-l | --local] <key> <value>   Set local configuration
  config <key>                          Get configuration value

General:
  [-v | --version]                      Show current version of zapg
  [-h | --help]                         Show this help message
`;

switch (cmd) {
  case 'init':
    await init();
    break;

  case 'branch':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));
      const positional = params
        .filter((p) => (!p || !p.startsWith('-') ? p : false))
        .filter(Boolean);

      if (flags.includes('-d') || flags.includes('--delete')) {
        await deleteBranch(positional[0]);
      } else if (flags.includes('-r') || flags.includes('--rename')) {
        await renameBranch(positional[0], positional[1]);
      } else {
        await branch(positional[0]);
      }
    }
    break;

  case 'switch':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await switchBranch(positional[0]);
    }
    break;

  case 'add':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await addTask(positional.join(' '));
    }
    break;

  case 'list':
    await listTasks();
    break;

  case 'update':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await updateTask(
        parseInt(positional[0], 10),
        positional.slice(1).join(' ')
      );
    }
    break;

  case 'remove':
  case 'rm':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await deleteTask(parseInt(positional[0], 10));
    }
    break;

  case 'complete':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await completeTask(parseInt(positional[0], 10));
    }
    break;

  case 'move':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await moveTask(parseInt(positional[0], 10), positional[1]);
    }
    break;

  case 'incomplete':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await incompleteTask(parseInt(positional[0], 10));
    }
    break;

  case 'search':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));
      const positional = params.filter((p) => !(p && p.startsWith('-')));

      if (flags.includes('--global') || flags.includes('-g')) {
        await searchTodosGlobally(positional.join(' '));
      } else {
        await searchTodos(positional.join(' '));
      }
    }
    break;

  case 'merge':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));
      const positional = params.filter((p) => !(p && p.startsWith('-')));

      if (flags.includes('--unsort')) {
        await mergeBranches(positional[0], positional[1], false);
      } else {
        await mergeBranches(positional[0], positional[1]);
      }
    }
    break;

  case 'tag':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));
      const positional = params.filter((p) => !(p && p.startsWith('-')));

      if (flags.includes('-d') || flags.includes('--delete')) {
        await removeTag(positional[0]);
      } else if (flags.includes('-r') || flags.includes('--rename')) {
        await renameTag(positional[0], positional[1]);
      } else {
        await tag(positional[0], positional[1]);
      }
    }
    break;

  case 'import':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await importExportBranch(positional[0], 'import', positional[1]);
    }
    break;

  case 'export':
    {
      const params = args.slice(1);
      const positional = params.filter((p) => !(p && p.startsWith('-')));
      await importExportBranch(positional[0], 'export', positional[1]);
    }
    break;

  case 'stats':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));

      if (flags.includes('--global') || flags.includes('-g')) {
        await globalStats();
      } else {
        await stats();
      }
    }
    break;

  case 'config':
    {
      const params = args.slice(1);
      const flags = params.filter((p) => p && p.startsWith('-'));
      const positional = params.filter((p) => !(p && p.startsWith('-')));

      if (flags.includes('--global') || flags.includes('-g')) {
        await setConfig('global', positional[0], positional[1]);
      } else if (flags.includes('--local') || flags.includes('-l')) {
        await setConfig('local', positional[0], positional[1]);
      } else {
        const globalConfig = await getGlobalConfig();
        cLog(globalConfig[positional[0]] || '', 'blue');
      }
    }
    break;

  case '--help':
  case '-h':
    cLog(helpText);
    break;

  case '--version':
  case '-v':
    cLog(`v${data.version}`, 'greenBright');
    break;

  default:
    cLog(helpText);
}

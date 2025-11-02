# Change Log

## `v4.0.0`

### ✨ Introduce

- Introduce zapg for global todo tracking

## `v3.7.0`

### 🛠️ Fixes

- Flag position no longer affects execution

### ❤️ Contributors

- [@calebephrem](https://github.com/calebephrem)
- [@mesygir](https://github.com/mesygir)

## `v3.6.0`

### 🚀 Enhancements

- Add quantum colors to outputs
- Add `--unsort` flag to disable `createdAt` sorting (sorts by id if flag provided)
- Add tag renaming via `-r`/`--rename` flags

## `v3.5.0`

### 🚀 Enhancements

- Add colored log output using chalk
- Add `rm` alias to `remove`

## `v3.4.0`

### 🚀 Enhancements

- Show config settings from `args[1]` if no scope flag is provided on `zap config`

### 🛠️ Fixes

- Default to fallback branch when global config is not found

## `v3.3.1`

### 🛠️ Fixes

- Fix error on command enter, forgot to export `renameBranch` from `impexp.js`

## `v3.3.0`

### 🚀 Enhancements

- Sort todos by `createdAt` on branch merge
- Support branch renaming

## `v3.2.0`

### 🚀 Enhancements

- Add `createdBy` object to todos with `name` and/or `email`

### ❤️ Contributors

- [@goldstac](https://github.com/goldstac)
- [@calebephrem](https://github.com/calebephrem)

### 🛠️ Fixes

- Make zap version output use static variable

## `v3.1.0`

### 🚀 Enhancements

- Add zap config support for `--global` and `--local` settings

### 🛠️ Fixes

- Truncate SHA log to 7 characters

## `v3.0.4`

### 🛠️ Fixes

- Resolve version mismatch in `zap -v` output

## `v3.0.3`

### 🛠️ Fixes

- Ensure `zap -v` shows accurate info

### ❤️ Contributors

- [@goldstac](https://github.com/goldstac)
- [@calebephrem](https://github.com/calebephrem)

## `v3.0.2`

### 🛠️ Fixes

- Prevent duplicate ids when merging branches

### ❤️ Contributors

- [@calebephrem](https://github.com/calebephrem)
- [@goldstac](https://github.com/goldstac)
- [@mesygir](https://github.com/mesygir)

## `v3.0.1`

### 🛠️ Fixes

- Log partial sha (first 7 chars) instead of full

## `v3.0.0`

### 🚀 Enhancements

- Add `tag` functionality to tag todo milestones
- Add `search` functionality to quickly find todos across branches
- Add `stats` functionality to show productivity rate & completed tasks count

### 🛠️ Fixes

- Change id format to `sha`

## `v2.0.0`

### 🚀 Enhancements

- Add branch info to `[branch].json`
  - branch name
  - branch id
  - todos
- Add `import`/`export` functionality to import or export branches as `.json`
- Add `move` functionality to move todos between branches
- Add `merge` functionality to merge two branches
- Add `version` option to show the current version of zap

### 🛠️ Fixes

- Rename `[todo].done` to `[todo].completed`

## `v1.0.0`

- Initial release

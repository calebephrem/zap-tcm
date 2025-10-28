import chalk from 'chalk';

export function cLog(text, color = 'white') {
  console.log(chalk[color](text));
}

export function clr(text, color = 'white') {
  return chalk[color](text);
}

export function zapclr(text, scope) {
  switch (scope) {
    case 'init':
      return clr(text, 'blue');
    case 'version':
      return clr(text, 'greenBright');
    case 'branch':
      return clr(text, 'blueBright');
    case 'tag':
      return clr(text, 'yellowBright');
    case 'id':
      return clr(text, 'cyanBright');
    case 'bracket':
      return clr(text, 'cyan');
    case 'x':
      return clr(text, 'redBright');
    default:
      return clr(text, 'white');
  }
}

export function padLog(msg) {
  cLog('\n' + msg + '\n');
}

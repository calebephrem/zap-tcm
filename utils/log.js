import chalk from 'chalk';

export function cLog(message, color = 'white') {
  console.log(chalk[color](message));
}

export function clr(message, color = 'white') {
  return chalk[color](message);
}

export function padLog(msg) {
  cLog('\n' + msg + '\n');
}

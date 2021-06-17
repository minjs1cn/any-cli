import chalk from 'chalk'

function info (msg: string) {
  process.stdout.write('\n' + chalk.cyan('[INFO]') + ' ' + msg + '\n')
}

function warn (msg: string) {
  process.stdout.write('\n' + chalk.yellow('[WARN]') + ' ' + msg + '\n')
}

function error (msg: string) {
  process.stdout.write('\n' + chalk.red('[ERROR]') + ' ' + msg + '\n')
}

function title (title: string) {
  process.stdout.write(chalk.bold.green.inverse(title) + '\n')
}

export default {
  title,
  info,
  warn,
  error
}
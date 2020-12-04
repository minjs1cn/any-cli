import { createCommand } from 'commander'
import { creator } from './creator'

const program = createCommand()

// 设置版本号
program.usage('<command> [options]')
  .version(require('../package.json').version)

// 创建项目
program.command('create <app-name>')
  .description('create project by vue')
  .action(appName => {
    creator(appName)
  })

program.parse(process.argv)
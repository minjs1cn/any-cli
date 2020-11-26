import { createCommand } from 'commander'
import { build } from './build'
import { creator } from './creator'
import { clone } from './git'
import { resolve, clean } from './utils'

const program = createCommand()

// 设置版本号
program.usage('<command> [options]')
  .version(require('../package.json').version)

// 创建项目
program.command('create <app-name>')
  .description('create my project by vue')
  .action(appName => {
    creator(appName)
  })

// 打包项目
program.command('build')
  .option('-m, --model <value>', 'set build model', 'production')
  .description('build my project')
  .action(({ model }) => {
    build({
      model
    })
  })

// 克隆项目
program.command('clone <git-name>')
  .option('-o, --output <value>', 'set output dir', '.')
  .description('clone my project from git')
  .action((gitName, { output }) => {
    clone(gitName, resolve(output))
  })

// 清理屏幕
program.command('clean')
  .description('clean my screen')
  .action(() => {
    clean()
  })

program.parse(process.argv)
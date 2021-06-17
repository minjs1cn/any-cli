import { createCommand } from 'commander'
import minimist from 'minimist'

const program = createCommand()

// 设置版本号
program
  .usage('<command> [options]')
  .version(require('../package.json').version)

// 注册命令
program
  .command('clone [app-name]')
  .description('克隆组织下的仓库')
  .usage('[app-name] [options]')
  .option('--api <string>', '仓库API')
  .option('--org <string>', '组织名称')
  .action(async (appName) => {
    const options = minimist(process.argv.slice(3))
    await require('./clone')(appName, options)
  })

// 开始解析
program.parse(process.argv)
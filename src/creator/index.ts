import { getConfig } from '../config'
import { clone } from '../utils'
import getTemplates from './getTemplates'
const inquirer = require('inquirer')

export async function creator (appName: string) {
  // 配置项
  const config = getConfig()
  // 根据不同的环境做适配
  const templates = await getTemplates(config)
  // 用户选择模版
  inquirer.prompt([
    {
      name: 'name',
      type: 'list',
      message: 'Pick Project Template',
      choices: templates
    }
  ]).then(({ name }: { name: string }) => {
    inquirer.prompt([
      {
        name: 'branch',
        type: 'list',
        message: 'Pick Template Branch',
        choices: [
          {
            name: 'master'
          },
          {
            name: 'main'
          }
        ]
      }
    ]).then(async ({ branch }: { branch: string }) => {
      // 根据模版名称和分支，获取下载地址
      const url = config.getDownloadUrl(name, branch)
      // 开始下载
      await clone(url, appName)
    })
  })
}
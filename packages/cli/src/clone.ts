import { getConfig } from './config'
import githubPlugin from './plugins/github'
import gitlabPlugin from './plugins/gitlab'
import { AnyConfig, AnyPlugin } from './types'
import path from 'path'
import inquirer from 'inquirer'
import download from './utils/download'
import logger from './utils/logger'

/**
 * 克隆组织下的仓库
 * @param {*} projectName - 项目名称
 * @param {*} options - 命令行配置
 */
async function clone(projectName: string, options: Record<string, string>) {
  // 合并配置
  const config: AnyConfig = Object.assign({}, getConfig(), options)
  // 目标位置
  let targetDir = path.join(config.cwd, projectName || '.')
  
  // 插件
  let plugin: undefined | AnyPlugin
  if (config.api) {
    plugin = gitlabPlugin()
  } else {
    plugin = githubPlugin()
  }

  try {
    const names = await plugin.loadRepos(config)
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        choices: names
      }
    ])
    if (projectName === undefined) {
      targetDir = path.join(config.cwd, answers.name)
    }
  
    const url = plugin.resolveDownloadUrl(answers.name)
    await download(url, targetDir)
  } catch (error) {
    logger.error(error)
  }
}

module.exports = clone

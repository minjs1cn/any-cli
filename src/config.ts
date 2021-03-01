import path from 'path'
import fs from 'fs-extra'
import { AnyUserConfig, AnyConfig } from './types'
// 运行根目录
const ROOT = process.cwd()
// 配置文件名称
const CONFIG_FILE_NAME = 'any.config.js'
// 配置文件路径
const CONFIG_FILE_PATH = path.join(ROOT, CONFIG_FILE_NAME)
// 默认配置
const anyConfig = {
  cwd: ROOT,
  api: '',
  org: 'any-templates'
}

/**
 * 读取配置
 */
export function getConfig(): AnyConfig {
  return Object.assign({}, anyConfig, getUserConfig())
}
/**
 * 读取用户配置
 */
function getUserConfig(): AnyUserConfig {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      return require(CONFIG_FILE_PATH)
    } catch (error) {
      return {}
    }
  }
  return {}
}
import path from 'path'
import fs from 'fs'
// 运行根目录
export const ROOT = process.cwd()
// 查找文件
export const resolve = (p: string) => path.resolve(ROOT, p)
// 配置文件
export const CONFIG_FILE_NAME = 'any.config.js'
export const CONFIG_FILE_PATH = resolve(CONFIG_FILE_NAME)
const IS_CONFIG_FILE_EXIST = fs.existsSync(CONFIG_FILE_PATH)

// 读取用户配置
export const getUserConfig = () => {
  if (IS_CONFIG_FILE_EXIST) {
    return require(CONFIG_FILE_PATH)
  }
  return {}
}

// 配置文件类型
export type AnyUserConfig = {
  name?: string
  host?: string
  org?: string
  getDownloadUrl?: (name: string, branch?: string) => string
}

// 配置文件类型
export type AnyDefaultConfig = typeof DEFAULT_CONFIG
// 默认配置
export const DEFAULT_CONFIG = {
  name: 'any',
  host: '',
  org: 'any-templates',
  getDownloadUrl (name: string, branch = 'main') {
    return 'github:any-templates/' + name + '#' + branch
  }
}

// 获取配置
export type AnyConfig = AnyUserConfig & AnyDefaultConfig
export const getConfig = () => Object.assign({}, DEFAULT_CONFIG, getUserConfig())

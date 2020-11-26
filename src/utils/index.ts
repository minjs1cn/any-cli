import path from 'path'
import { promisify } from 'util'
import downloadGitRepo, { DownloadConfig } from 'download-git-repo'
import readline from 'readline'
import { logger } from './logger'

export const pkg = require('../../package.json')

export * from './logger'

export const ROOT = process.cwd()

export const CONFIG_PATH = resolve('any.config.js')

export function resolve(dest: string) {
  return path.resolve(ROOT, dest)
}

export function getConfig() {
  return require(CONFIG_PATH)
}

export function download(target: string, dest: string, config: DownloadConfig = {}) {
  return promisify(downloadGitRepo)(target, dest, config)
}

export function clean(title?: string) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      logger.title(title)
    } else {
      logger.title(`${pkg.name} ${pkg.version}`)
    }
  }
}

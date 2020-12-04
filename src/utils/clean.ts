import readline from 'readline'
import { logger } from './logger'
import { pkg } from './constant'

/**
 * 清空控制台
 * @param title - 显示标题
 */
export function clean(title?: string) {
  if (process.stdout.isTTY) {
    // const blank = '\n'.repeat(process.stdout.rows)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      logger.title(title)
    } else {
      logger.title(`${pkg.name} ${pkg.version}`)
    }
  }
}
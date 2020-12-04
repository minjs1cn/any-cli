import { promisify } from 'util'
import downloadGitRepo, { DownloadConfig } from 'download-git-repo'
import ora from 'ora'

/**
 * 下载远程仓库
 * @param target - 目标
 * @param dest - 本地文件夹
 * @param config - 其他下载参数
 */
function download(target: string, dest: string, config: DownloadConfig = {}) {
  return promisify(downloadGitRepo)(target, dest, config)
}

/**
 * 下载仓库，显示进度
 * @param target - 目标
 * @param dest - 本地文件夹
 */
export async function clone(target: string, dest: string) {
  const spinner = ora(`start clone ${target.split(':').pop()}`)
  spinner.start()

  try {
    await download(target, dest)
    spinner.succeed()
  } catch (error) {
    spinner.fail(error.statusMessage)
  }
}
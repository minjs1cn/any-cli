import glob from 'glob'
import fs from 'fs'
import path from 'path'
import { MyInquirer } from './inquirer'

export { MyInquirer } from './inquirer'

/**
 * 获取所有单页面文件
 * @param root - 文件夹
 * @param entry - 入口文件名
 */
export function getPages(root: string, entry: string) {
  let dirs: string[] = []
  try {
    dirs = glob.sync(`${root}/*/${entry}`).filter(item => fs.statSync(item).isFile())
  } catch (error) {}
  let name
  const files = dirs.map(item => {
    name = path.relative(root, item).replace(`/${entry}`, '')
    return {
      dir: path.join(root, name),
      name,
      fullname: item
    }
  })
  return files
}

export function createInquirer(root: string, entry: string) {
  const pages = getPages(root, entry)
  return function (message?: string, key?: string) {
    return MyInquirer(pages.map(item => item.name), message, key)
  }
}
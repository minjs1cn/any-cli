import { getHash, getFileName, getName } from './utils'
import glob from 'glob'
import fs from 'fs'

/**
 * 读取文件hash
 * @param localfile 
 */
export function getFileHash(localfile: string) {
  const content = fs.readFileSync(localfile)
  return getHash(content)
}

/**
 * 重命名本地文件，加上hash
 * @param localfile - 本地文件
 * @param hashLen - hash长度
 */
export function reFile(localfile: string, hashLen: number = 8) {
  // 获取文件hash
  const hash = getFileHash(localfile).slice(0, hashLen)
  // 如果已经被hash了 则直接返回
  if (localfile.indexOf(hash) !== -1) return localfile
  // 文件全名
  const fullname = getFileName(localfile)
  // 文件名
  const name = getName(fullname)
  // 文件后缀
  const ext = fullname.replace(name, '')
  // 新的文件名
  const newName = name + '.' + hash + ext
  // 文件夹路径
  const dir = localfile.replace(fullname, '')
  // 重命名
  fs.renameSync(localfile, dir + newName)
  // 返回新的路径
  return dir + newName
}

/**
 * 重命名文件夹内所有本地文件，加上hash
 * @param input - 本地文件夹
 * @param hashLen - hash长度
 */
export function reDir(input: string, hashLen: number = 8) {
  let files: string[] = []
  try {
    files = glob.sync(`${input}/**/*`).filter(item => fs.statSync(item).isFile())
  } catch (error) {}
  return files.map(localfile => reFile(localfile, hashLen))
}

/**
 * 撤销本地文件hash命名
 * @param localfile - 本地文件
 * @param hashLen - hash长度
 */
export function revokeFile(localfile: string, hashLen: number = 8) {
  // 获取文件hash
  const hash = getFileHash(localfile).slice(0, hashLen)
  // 如果已经被hash了 则直接返回
  if (localfile.indexOf(hash) === -1) return localfile
  const newName = localfile.replace(hash + '.', '')
  // 重命名
  fs.renameSync(localfile, newName)
  // 返回新的路径
  return newName
}

/**
 * 恢复件夹内所有本地文件
 * @param input - 本地文件夹
 * @param hashLen - hash长度
 */
export function revokeDir(input: string, hashLen: number = 8) {
  let files: string[] = []
  try {
    files = glob.sync(`${input}/**/*`).filter(item => fs.statSync(item).isFile())
  } catch (error) {}
  return files.map(localfile => revokeFile(localfile, hashLen))
}
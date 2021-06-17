import crypto from 'crypto'

type Algorithm = 'md5' | 'sha1' | 'sha256' | 'sha512'

/**
 * 文件hash
 * @param content 
 * @param algorithm 
 */
export function getHash (content: Buffer | string, algorithm: Algorithm = 'md5') {
  const fsHash = crypto.createHash(algorithm)
  fsHash.update(content)
  return fsHash.digest('hex')
}

/**
 * 文件hmac
 * @param content 
 * @param key 
 * @param algorithm 
 */
export function getHmac(content: string, key: string = '', algorithm: Algorithm = 'md5') {
  const fsHash = crypto.createHmac(algorithm, key)
  fsHash.update(content)
  return fsHash.digest('hex')
}

const fileNameReg = /([^\/]+\.[^\/]+)/

/**
 * 获取文件名，带后缀
 * @param localfile 
 */
export function getFileName(localfile: string) {
  const match = fileNameReg.exec(localfile)
  if (match) return match[1]
  return ''
}

const nameReg = /([^\/]+)\.[^\/]+/

/**
 * 获取文件名，不带后缀
 * @param filename 
 */
export function getName(filename: string) {
  const match = nameReg.exec(filename)
  if (match) return match[1]
  return ''
}
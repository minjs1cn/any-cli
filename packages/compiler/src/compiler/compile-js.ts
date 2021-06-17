import fs from 'fs-extra'
import { replaceExt } from '../utils'
import { transformAsync } from '@babel/core'

/**
 * 编译js/ts/tsx文件
 * @param filePath - 文件路径
 * @returns 
 */
export function compileJs(filePath: string): Promise<string | null | undefined> {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    let code = fs.readFileSync(filePath, 'utf-8')
    // 用babel编译
    transformAsync(code, {
      filename: filePath
    }).then(result => {
      if (result) {
        // 修改文件为js
        const jsFilePath = replaceExt(filePath, '.js');
        // 移除原文件
        fs.removeSync(filePath);
        // 代码写入新的文件
        fs.outputFileSync(jsFilePath, result.code);
        resolve(result.code);
      } else {
        reject('result is null')
      }
    }).catch(reject)
  })
}
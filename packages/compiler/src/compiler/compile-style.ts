import { isLess, replaceExt } from "../utils"
import { compileCss } from "./compile-css"
import { compileLess } from "./compile-less"
import fs from 'fs-extra'

async function compileFile(filePath: string) {
  try {
    if (isLess(filePath)) {
      const source = await compileLess(filePath)
      return await compileCss(source)
    }

    const source = fs.readFileSync(filePath, 'utf-8')
    return await compileCss(source)
  } catch (err) {
    console.error('Compile style failed: ' + filePath)
    throw err
  }
}

/**
 * 编译样式文件
 * @param filePath 
 * @returns 
 */

export async function compileStyle(filePath: string) {
  const css = await compileFile(filePath)

  fs.writeFileSync(replaceExt(filePath, '.css'), css)
}

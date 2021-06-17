import { render } from 'less'
import fs from 'fs-extra'

/**
 * 编译less
 * @param filePath - 文件地址
 * @returns 
 */
export async function compileLess(filePath: string) {
  // 读取源码
  const source = fs.readFileSync(filePath, 'utf-8')
  // 编译为css
  const { css } = await render(source, {
    filename: filePath,
    plugins: []
  })

  return css
}

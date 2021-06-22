import postcss from 'postcss'
import postcssrc from 'postcss-load-config'
import CleanCss from 'clean-css'

const cleanCss = new CleanCss()

/**
 * 编译css
 * @param source - 源码
 * @returns 
 */
export async function compileCss(source: string | Buffer) {
  // 获取postcss的配置
  const config = await postcssrc()
  // 经过postcss的处理
  const { css } = await postcss(config.plugins as any).process(source, {
    from: undefined,
  })
  // 返回压缩的代码
  return cleanCss.minify(css).styles
}

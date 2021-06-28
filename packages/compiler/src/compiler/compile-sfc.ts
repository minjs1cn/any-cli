import * as compilerSfc from '@vue/compiler-sfc'
import hash from 'hash-sum'
import fs from 'fs-extra'
import path from 'path'
import { replaceExt } from '../utils'
import { compileJs } from './compile-js'

const RENDER_FN = '__vue_render__'
const EXPORT = 'export default {'

function parseSfc(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf-8')
  return compilerSfc.parse(source, {
    filename: filePath
  })
}

function injectRender(script: string, render: string) {
  render = render
    .replace('export function render', `function ${RENDER_FN}`)

  return script
    .replace(EXPORT, `${render}\n${EXPORT}\n  render: ${RENDER_FN},\n`)
}

function injectScopedId(script: string, scopedId: string) {
  return script.replace(EXPORT, `${EXPORT}\n  __scopeId: "${scopedId}",\n\n`)
}


function getSfcStylePath(filePath: string, ext: string, index: number) {
  const number = index !== 0 ? `-${index + 1}` : '';
  return replaceExt(filePath, `-sfc${number}.${ext}`);
}

function injectStyle(script: string, styles: compilerSfc.SFCStyleBlock[], filePath: string) {
  const imports = styles.map((style, index) => {
    const { base } = path.parse(getSfcStylePath(filePath, 'css', index))
    return `import "./${base}";`
  }).join('\n')
  
  return script.replace(EXPORT, `${imports}\n\n${EXPORT}`)
}

/**
 * 编译vue单文件组件
 * @param filePath - 文件地址
 * @returns 
 */
export function compileSfc(filename: string) {
  // 读取源码
  const source = fs.readFileSync(filename, 'utf-8');
  // 分析区块
  const { descriptor, errors } = parseSfc(filename)

  if (errors.length) {
    errors.forEach((error) =>
      console.error(filename, error)
    )
    return null
  }
  // 样式区块中是否有scope
  const hasScoped = descriptor.styles.some((s) => s.scoped)
  // 生成scopeId
  const scopedId = hasScoped ? `data-v-${hash(source)}` : ''
  // 任务队列
  const tasks = []

  // compile js block
  tasks.push(
    new Promise(resolve => {
      
      const lang = descriptor.script?.lang || descriptor.scriptSetup?.lang || 'js'
      const scriptFilePath = replaceExt(filename, `.${lang}`)
      let scriptContent = compilerSfc.compileScript(descriptor, {
        id: scopedId,
        isProd: true
      }).content
      // 脚本内容
      scriptContent = injectStyle(scriptContent, descriptor.styles, descriptor.filename)

      // 创建render函数
      if (descriptor.template) {
        const { code } = compilerSfc.compileTemplate({
          source: descriptor.template.content,
          id: scopedId,
          filename: descriptor.filename
        })
        scriptContent = injectRender(scriptContent, code)
      }

      // 设置scopeId
      if (hasScoped) {
        scriptContent = injectScopedId(scriptContent, scopedId)
      }
      
      // 输出文件内容
      fs.writeFileSync(scriptFilePath, scriptContent)
      
      compileJs(scriptFilePath).then(resolve)
    })
  )

  // compile style block
  tasks.push(
    ...descriptor.styles.map((style, index) => {
      const cssFilePath = getSfcStylePath(filename, 'css', index)

      const styleSource = compilerSfc.compileStyle({
        source: style.content,
        scoped: style.scoped ? true : false,
        id: scopedId,
        filename: descriptor.filename
      })

      fs.writeFileSync(cssFilePath, styleSource.code)
      return styleSource
    })
  )

  
  return Promise.all(tasks)
}
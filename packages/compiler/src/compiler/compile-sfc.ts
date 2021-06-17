import * as compileUtils from '@vue/component-compiler-utils'
import * as vueTemplateCompiler from 'vue-template-compiler'
import { VueTemplateCompiler } from '@vue/component-compiler-utils/lib/types'
import hash from 'hash-sum'
import fs from 'fs-extra'
import path from 'path'
import { replaceExt } from '../utils'
import { compileJs } from './compile-js'

const compiler = vueTemplateCompiler as VueTemplateCompiler
const RENDER_FN = '__vue_render__'
const STATIC_RENDER_FN = '__vue_staticRenderFns__'
const EXPORT = 'export default {'

function parseSfc(filePath: string) {
  const source = fs.readFileSync(filePath, 'utf-8')
  return compileUtils.parse({
    source,
    compiler,
    filename: filePath
  })
}

function compileTemplate(source: string) {
  const result =  compileUtils.compileTemplate({
    source,
    compiler,
    filename: '',
    isProduction: true
  })
  return result.code
}

function injectRender(script: string, render: string) {
  render = render
    .replace('var render', `var ${RENDER_FN}`)
    .replace('var staticRenderFns', `var ${STATIC_RENDER_FN}`)

  return script
    .replace(EXPORT, `${render}\n${EXPORT}\n  render: ${RENDER_FN},\n\n  staticRenderFns: ${STATIC_RENDER_FN},\n`)
}

function injectScopedId(script: string, scopedId: string) {
  return script.replace(EXPORT, `${EXPORT}\n  _scopedId: "${scopedId}",\n\n`)
}


function getSfcStylePath(filePath: string, ext: string, index: number) {
  const number = index !== 0 ? `-${index + 1}` : '';
  return replaceExt(filePath, `-sfc${number}.${ext}`);
}

function injectStyle(script: string, styles: compileUtils.SFCBlock[], filePath: string) {
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
export function compileSfc(filePath: string) {
  // 读取源码
  const source = fs.readFileSync(filePath, 'utf-8');
  // 分析区块
  const { template, script, styles } = parseSfc(filePath)
  // 样式区块中是否有scope
  const hasScoped = styles.some(s => s.scoped)
  // 生成scopeId
  const scopedId = hasScoped ? `data-v-${hash(source)}` : ''
  // 任务队列
  const tasks = []

  // compile js block
  tasks.push(
    new Promise(resolve => {
      const lang = script?.lang || 'js'
      const scriptFilePath = replaceExt(filePath, `.${lang}`)
      let scriptContent = script?.content || 'export default {}'
      // 脚本内容
      scriptContent = injectStyle(scriptContent, styles, filePath)

      // 创建render函数
      if (template) {
        scriptContent = injectRender(scriptContent, compileTemplate(template.content))
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
    ...styles.map((style, index) => {
      const cssFilePath = getSfcStylePath(filePath, 'css', index)

      const styleSource  = compileUtils.compileStyle({
        source: style.content,
        scoped: style.scoped ? true : false,
        id: scopedId,
        filename: cssFilePath,
        preprocessLang: style.lang
      }).code

      fs.writeFileSync(cssFilePath, styleSource)
      return styleSource
    })
  )

  
  return Promise.all(tasks)
}
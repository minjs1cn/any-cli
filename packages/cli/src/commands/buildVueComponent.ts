import { compileJs, compileSfc, compileStyle, isScript, isStyle, isVueSFC, replaceExt, setModuleEnv, setNodeEnv } from '@minjs1cn/compiler'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chokidar from 'chokidar'
import { clean } from './clean'
import { getConfig } from '../config'

const CONFIG = getConfig()
// 要忽略的文件夹
const ignoreDirs = CONFIG.ignore

// 所有构建任务
const tasks = [
  {
    title: 'create package entry',
    task: createSrcPackageEntry
  },
  {
    title: 'create package style',
    task: createSrcPackageStyle
  },
  {
    title: 'build es module',
    task: buildEs
  },
  {
    title: 'build commonjs module',
    task: buildLib
  },
  {
    title: 'build style entry',
    task: buildStyleEntry
  }
]

function filters(filename: string) {
  return !ignoreDirs.includes(filename) && filename !== 'index.ts' && filename !== 'index.less'
}

async function createSrcPackageEntry() {
  fs.outputFileSync(path.join(CONFIG.src, 'index.ts'), createPackageEntry(CONFIG.src, true))
}

async function createSrcPackageStyle() {
  const files = fs.readdirSync(CONFIG.src).filter(filters)
  const styleContent = files.map(filename => '@import ' + '"./' + filename + '/index.less";').join('\n')
  fs.outputFileSync(path.join(CONFIG.src, 'index.less'), styleContent)
}

// 生成包入口
function createPackageEntry(dest: string, ts: boolean = false) {
  const files = fs.readdirSync(dest).filter(filters)
  const hooksDir = path.join(dest, 'hooks')
  let hooks: string[] = []
  if (fs.existsSync(hooksDir)) {
    hooks = fs.readdirSync(hooksDir).map(filename => replaceExt(filename, ''))
  }
  const components = "\n\nconst components = [\n" + files.map(filename => `  ${filename}`).join(',\n') + '\n]\n'

  const install = `
function install(Vue${ts ? ': App' : ''}){
  components.forEach(component => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
}
`
  let exports = `
export {
  install,\n${files.map(filename => '  ' + filename).join(',\n')}`

  if (hooks.length) {
    exports += `,\n${hooks.map(hookname => '  ' + hookname).join(',\n')}\n`
  }

  exports += `}`
  const detaultExports = `
export default {
  install
}   
`
  let imports = files.map(filename => `import ${filename} from "./${filename}";`).join('\n')
  if (hooks.length) {
    imports += '\n' + hooks.map(hookname => `import ${hookname} from "./hooks/${hookname}";`).join('\n')
  }
  if (ts) {
    imports += '\nimport { App } from "vue";'
  }
  return imports + components + install + exports + detaultExports
}

/**
 * 构建每个包的入口
 * @returns 
 */
async function buildPackageEntry() {
  const esEntryFile = path.join(CONFIG.es, 'index.js');
  const libEntryFile = path.join(CONFIG.lib, 'index.js');
  const esStyleEntryFile = path.join(CONFIG.es, `index.less`);
  const libStyleEntryFile = path.join(CONFIG.lib, `index.less`);
  const files = fs.readdirSync(CONFIG.es).filter(filters)

  const content = createPackageEntry(CONFIG.es)
  fs.outputFileSync(esEntryFile, content)

  setModuleEnv('esmodule')
  await compileJs(esEntryFile)

  fs.outputFileSync(libEntryFile, content)

  setModuleEnv('commonjs')
  await compileJs(libEntryFile)

  const styleContent = files.map(filename => '@import ' + '"./' + filename + '/index.less";').join('\n')
  fs.outputFileSync(esStyleEntryFile, styleContent)
  await compileStyle(esStyleEntryFile)

  fs.outputFileSync(libStyleEntryFile, styleContent)
  await compileStyle(libStyleEntryFile)
  
  return true
}

/**
 * 构建样式文件入口，满足babel-plugin-import规范
 */
async function buildStyleEntry() {
  const files = fs.readdirSync(CONFIG.src).filter(filters)
  
  await Promise.all(
    files.map(filename => {
      const filePath = path.join(CONFIG.es, filename)
      return new Promise(resolve => {
        fs.outputFileSync(path.join(filePath, 'style/index.js'), `import "../index.less";\n`)
        fs.outputFileSync(path.join(filePath, 'style/css.js'), `import "../index.css";\n`)
        resolve('ok')
      })
    })
  )

  await Promise.all(
    files.map(filename => {
      const filePath = path.join(CONFIG.lib, filename)
      return new Promise(resolve => {
        fs.outputFileSync(path.join(filePath, 'style/index.js'), `require("../index.less");\n`)
        fs.outputFileSync(path.join(filePath, 'style/css.js'), `require("../index.css");\n`)
        resolve('ok')
      })
    })
  )
}

/**
 * 编译文件夹内所有文件
 * @param dir 
 */
async function compileDir(dir: string) {
  const files = fs.readdirSync(dir)
  await Promise.all(
    files.map(filename => {
      const filePath = path.join(dir, filename)
      // 如果是文件夹，则继续递归
      if (fs.lstatSync(filePath).isDirectory()) {
        return compileDir(filePath)
      }
      return compileFile(filePath)
    })
  )
}

/**
 * 编译文件
 * @param filename 
 * @returns 
 */
async function compileFile(filename: string) {
  if (isVueSFC(filename)) {
    return compileSfc(filename)
  }
  // 如果是脚本文件
  if (isScript(filename)) {
    removeVue(filename)
    return compileJs(filename)
  }
  // 如果是样式文件
  if (isStyle(filename)) {
    return compileStyle(filename)
  }
  // 移除无效文件
  return fs.remove(filename)
}

/**
 * 移除vue.extend，直接导出对象
 * @param filePath 
 */
 function removeVue(filePath: string) {
  if (filePath.indexOf('.tsx') === -1) return
  
  let code = fs.readFileSync(filePath, 'utf-8')
  code = code.replace(`import Vue from "vue";`, '')
  code = code.replace(`import Vue from "vue"`, '')
  code = code.replace(`import Vue from 'vue';`, '')
  code = code.replace(`import Vue from 'vue'`, '')
  code = code.replace(/Vue\.extend\((\{[\s\S\n\r\t]+\})\)/g, (a, b) => {
    return b
  })
  fs.writeFileSync(filePath, code)
}

/**
 * 编译esmodule
 */
async function buildEs() {
  // 设置环境变量
  setModuleEnv('esmodule')
  // 拷贝源码
  await fs.copy(CONFIG.src, CONFIG.es)
  // 开始编译
  await compileDir(CONFIG.es)
}

/**
 * 编译commonjsModule
 */
async function buildLib() {
   // 设置环境变量
   setModuleEnv('commonjs')
   // 拷贝源码
   await fs.copy(CONFIG.src, CONFIG.lib)
   // 开始编译
   await compileDir(CONFIG.lib)
}

/**
 * 运行所有任务
 */
async function runBuildTasks() {
  for (let i = 0; i < tasks.length; i++) {
    const { task, title } = tasks[i]
    const spinner = ora(title).start()

    try {
      await task()
      spinner.succeed(title)
    } catch (error) {
      spinner.fail(title)
      throw error
    }
  }
}

/**
 * 监听文件变换启动编译
 */
function watchFileChange(callback: (path: string) => void) {
  console.info('\nWatching file changes...');

  chokidar.watch(CONFIG.src).on('change', callback)
}

async function compileChangeFile(filepath: string) {
  console.log(filepath)
  const entryJs = path.join(CONFIG.src, 'index.ts')
  const entryStyle = path.join(CONFIG.src, 'index.less')
  if (filepath === entryJs || filepath === entryStyle) return
  
  const spinner = ora('File changed, start compilation...').start()
  const esPath = filepath.replace(CONFIG.src, CONFIG.es)
  const libPath = filepath.replace(CONFIG.src, CONFIG.lib)

  try {
    await fs.copy(filepath, esPath)
    await fs.copy(filepath, libPath)
    // 设置环境变量
    setModuleEnv('esmodule')
    await compileFile(esPath)
    // 设置环境变量
    setModuleEnv('commonjs')
    await compileFile(libPath)
    spinner.succeed('Compiled: ' + filepath)
  } catch (err) {
    spinner.fail('Compile failed: ' + filepath)
    console.log(err)
  }

  if (isStyle(filepath)) {
    try {
      createSrcPackageStyle()
      const esEntry = path.join(CONFIG.es, 'index.less')
      const libEntry = path.join(CONFIG.lib, 'index.less')
      await fs.copy(entryStyle, esEntry)
      await fs.copy(entryStyle, libEntry)
      // 设置环境变量
      setModuleEnv('esmodule')
      await compileFile(esEntry)
      // 设置环境变量
      setModuleEnv('commonjs')
      await compileFile(libEntry)
      spinner.succeed('Compiled: ' + entryStyle)
    } catch (err) {
      spinner.fail('Compile failed: ' + entryStyle)
      console.log(err)
    }
  } else if(isScript(filepath)) {
    try {
      createSrcPackageEntry()
      const esEntry = path.join(CONFIG.es, 'index.ts')
      const libEntry = path.join(CONFIG.lib, 'index.ts')
      await fs.copy(entryJs, esEntry)
      await fs.copy(entryJs, libEntry)
      // 设置环境变量
      setModuleEnv('esmodule')
      await compileFile(esEntry)
      // 设置环境变量
      setModuleEnv('commonjs')
      await compileFile(libEntry)
      spinner.succeed('Compiled: ' + entryJs)
    } catch (err) {
      spinner.fail('Compile failed: ' + entryJs)
      console.log(err)
    }
  }
}

export async function buildVueComponent(cmd: { watch?: boolean, dev?: boolean } = {}) {
  setNodeEnv('production')

  try {
    await clean()
    await runBuildTasks()
    if (cmd.watch) {
      watchFileChange(compileChangeFile)
    }
  } catch (error) {
    console.error('build faild', error)
    process.exit(1)
  }
}
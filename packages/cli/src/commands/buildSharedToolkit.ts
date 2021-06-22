import { compileJs, compileStyle, isDeclaration, isScript, isStyle, replaceExt, setModuleEnv, setNodeEnv } from '@any/compiler'
import fs from 'fs-extra'
import path from 'path'
import ora from 'ora'
import chokidar from 'chokidar'
import { clean } from './clean'
import { getConfig } from '../config'

const CONFIG = getConfig()

// 所有构建任务
const tasks = [
  {
    title: 'build es module',
    task: buildEs
  },
  {
    title: 'build commonjs module',
    task: buildLib
  },
]

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
  // 如果是脚本文件
  if (isScript(filename)) {
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
function watchFileChange() {
  console.info('\nWatching file changes...');

  chokidar.watch(CONFIG.src).on('change', async path => {
    const spinner = ora('File changed, start compilation...').start()
    const esPath = path.replace(CONFIG.src, CONFIG.es)
    const libPath = path.replace(CONFIG.src, CONFIG.lib)

    try {
      await fs.copy(path, esPath)
      await fs.copy(path, libPath)
      // 设置环境变量
      setModuleEnv('esmodule')
      await compileFile(esPath)
      // 设置环境变量
      setModuleEnv('commonjs')
      await compileFile(libPath)
      spinner.succeed('Compiled: ' + path)
    } catch (err) {
      spinner.fail('Compile failed: ' + path)
      console.log(err)
    }
  })
}

export async function buildSharedToolkit(cmd: { watch?: boolean } = {}) {
  console.log(cmd)
  setNodeEnv('production')

  try {
    await clean()
    await runBuildTasks()

    if (cmd.watch) {
      watchFileChange()
    }
    
  } catch (error) {
    console.error('build faild', error)
    process.exit(1)
  }
}
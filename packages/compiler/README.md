# `@any/compiler`

> 单文件编译，支持less、ts、js，单独支持vue的sfc。如果需要支持jsx，请安装对应的babel预设，例如支持vue，安装：@vue/preset-jsx

## Usage

```js
const {
  compileJs,
  compileStyle,
  setModuleEnv,
  setNodeEnv,
  isScript,
  isStyle
} = require('@any/compiler');

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
function compileFile(filename: string) {
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

// 设置环境变量
setNodeEnv('production')
// 设置模块类型 esmodule | commonjs
setModuleEnv('esmodule')
// 拷贝源码
await fs.copy('src', 'lib')
// 开始编译
await compileDir('lib')
```

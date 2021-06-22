# `@minjs1cn/inquirer`

> 多组件/页面询问式交互，带有缓存机制

## Usage

直接使用内部简单封装好的方法

```js
const { createInquirer } = require('@minjs1cn/inquirer');

// 匹配src/*/index.js目录
const inquire = createInquirer('src', 'index.js')
// 第一个参数 提示信息；第二个参数 缓存标识
const name = await inquire('请输入您的选择', 'lastchoice')
// name = *
console.log(name)
```

或者字节自定义也可以

```js
const { getPages, myInquirer } = require('@minjs1cn/inquirer');

// 匹配src/*/index.js目录
const pages = getPages('src', 'index.js')
const { dir, name, fullname } = pages
// 例如 src/a，a，src/a/index.js
console.log(dir, name, fullname)
// 第一个参数 提示信息；第二个参数 缓存标识
const name = await myInquirer(pages.map(item => item.name), '请输入您的选择', 'lastchoice')
// name = *
console.log(name)
```

# `@minjs1cn/file-hash`

> 文件hash工具

## Usage

> 获取文件hash

```ts
const { getHash } = require('@minjs1cn/file-hash')

const hash = getHash('123')
```

> 重命名文件夹所有文件

```ts
const { reDir } = require('@minjs1cn/file-hash')

reDir('dist')
```

>恢复文件夹所有文件

```ts
const { revokeDir } = require('@minjs1cn/file-hash')

revokeDir('dist')
```

> 重命名文件

```ts
const { reFile } = require('@minjs1cn/file-hash')

reFile('dist/a.png')
```

> 恢复文件

```ts
const { revokeFile } = require('@minjs1cn/file-hash')

revokeFile('dist/a.hdwdkwfw.png')
```

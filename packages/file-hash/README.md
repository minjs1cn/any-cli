# `@any/file-hash`

> 文件hash工具

## Usage

> 获取文件hash

```ts
const { getHash } = require('@any/file-hash')

const hash = getHash('123')
```

> 重命名文件夹所有文件

```ts
const { reDir } = require('@any/file-hash')

reDir('dist')
```

>恢复文件夹所有文件

```ts
const { revokeDir } = require('@any/file-hash')

revokeDir('dist')
```

> 重命名文件

```ts
const { reFile } = require('@any/file-hash')

reFile('dist/a.png')
```

> 恢复文件

```ts
const { revokeFile } = require('@any/file-hash')

revokeFile('dist/a.hdwdkwfw.png')
```

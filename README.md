# any-cli

定制私有任务的cli工具

## Usage

```
yarn add @minjs1cn/any-cli
any -h
```

### Commands

any clone [app-name] [config]

```
any clone myApp --org vitejs
```

### Config

**any.config.js**

```
/**
 * @type import('./lib/types').AnyUserConfig
 */
module.exports = {
  api: 'http://gitlab2.dui88.com/api/v4',
  org: 'tuia-tempalte-peojects'
}
```

```
/**
 * @type import('./lib/types').AnyUserConfig
 */
module.exports = {
  org: 'vitejs'
}
```

**config.d.ts**

```ts
export type AnyUserConfig = {
  api?: string
  org?: string
}
```


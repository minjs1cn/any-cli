export const FILE_EXT_RE = /\.\w+$/
export const IMPORT_RE = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g
export type ModuleEnv = 'esmodule' | 'commonjs'
export type NodeEnv = 'production' | 'development'
export const SCRIPT_RE = /\.(js|ts|jsx|tsx)$/
export const VUE_SFC_RE = /\.(vue)$/
export const STYLE_RE = /\.(less|css)$/
export const CSS_RE = /\.(css)$/
export const LESS_RE = /\.(less)$/
export const Declaration_RE = /\.(d.ts)$/

/**
 * 替换文件后缀
 * @param filePath 
 * @param ext 
 * @returns 
 */
export function replaceExt(filePath: string, ext: string) {
  return filePath.replace(FILE_EXT_RE, ext)
}

/**
 * 匹配导入的内容
 * @param code 
 * @returns 
 */
function matchImports(code: string): string[] {
  return code.match(IMPORT_RE) || [];
}

/**
 * 替换导入的文件后缀
 * @param code 
 * @param from 
 * @param to 
 * @returns 
 */
export function replaceScriptImportExt(code: string, from: string, to: string) {
  const importLines = matchImports(code);

  importLines.forEach((importLine) => {
    const result = importLine.replace(from, to);
    code = code.replace(importLine, result);
  });

  return code;
}

/**
 * 设置环境变量 MODULE_ENV
 * @param env 
 */
export function setModuleEnv(env: ModuleEnv) {
  process.env.MODULE_ENV = env
}

/**
 * 设置环境变量 NODE_ENV
 * @param env 
 */
 export function setNodeEnv(env: NodeEnv) {
  process.env.NODE_ENV = env
}

/**
 * 是否是脚本文件
 * @param filename 
 * @returns 
 */
export function isScript(filename: string) {
  return SCRIPT_RE.test(filename)
}

/**
 * 是否是样式文件
 * @param path 
 * @returns 
 */
export function isStyle(path: string) {
  return STYLE_RE.test(path);
}

export function isLess(path: string) {
  return LESS_RE.test(path);
}

export function isCSS(path: string) {
  return CSS_RE.test(path);
}

export function isDeclaration(path: string) {
  return Declaration_RE.test(path)
}

export function isVueSFC(path: string) {
  return VUE_SFC_RE.test(path)
}
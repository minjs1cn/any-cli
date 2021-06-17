import inquirer from 'inquirer'
import fuzzy from 'fuzzy'
import cache from './cache'

/* register autocomplete type prompt */
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
)

/**
 * 创建数据源过滤器
 * @param {*} names 
 */
function createSourceFilter(names: string[]) {
  return (_: any, input: string = '') => fuzzy.filter(input, names).map(el => el.original)
}

/**
 * 根据用户输入，返回真实的页面名称
 * @param pages - 页面名称数组
 * @param message - 提示信息
 * @param key - 缓存key
 */
export async function MyInquirer(pages: string[], message: string = '请输入您的选择', key: string = 'lastchoice') {
  const lastName = cache.get<string>(key)

  if (lastName) {
    pages = pages.filter(name => name !== lastName)
    pages.unshift(lastName)
  }

  const source = createSourceFilter(pages)

  const answers = await inquirer.prompt([
    {
      name: 'name',
      type: "autocomplete",
      message,
      source
    }
  ])

  cache.set(key, answers.name)
  return answers.name as string
}
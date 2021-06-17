import * as http from '../utils/http'
import { AnyPlugin } from '../types'

type Repos = Array<{
  id: number
  name: string
  web_url: string
  default_branch: string
}>

export default function(): AnyPlugin {
  let repos: Repos = []

  return {
    name: 'any:gitlab',

    loadRepos(config) {
      const { org } = config
      
      return new Promise((resolve, reject) => {
        const url = 'http://gitlab2.dui88.com/api/v4/groups?search='+encodeURIComponent(org)
        http.get<[{ id: number, name: string }]>(url).then(res => {
          if (res.length) {
            const { id, name } = res[0]
            const reposUrl = `http://gitlab2.dui88.com/api/v4/groups/${id}/projects`
            http.get<Repos>(reposUrl).then(data => {
              repos = data
              const names = data.map(item => item.name)
              if (names.length) {
                resolve(names)
              } else {
                reject('组织 ' + name + ' 下不存在仓库，点击查看 ' + reposUrl)
              }
            })
          } else {
            reject('无法获取组织信息，点击查看 ' + url)
          }
        })
      })
    },

    resolveDownloadUrl(repoName: string) {
      const repo = repos.filter(item => item.name === repoName)[0]
      const { web_url, default_branch, name } = repo
      return `direct:${web_url}/-/archive/${default_branch}/${name}-${default_branch}.zip`
    }
  }
}
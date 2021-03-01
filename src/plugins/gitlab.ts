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
      
      return new Promise(resolve => {
        http.get<[{ id: number }]>('http://gitlab2.dui88.com/api/v4/groups?search='+encodeURIComponent(org)).then(res => {
          const { id } = res[0]  
          http.get<Repos>(`http://gitlab2.dui88.com/api/v4/groups/${id}/projects`).then(data => {
            repos = data
            resolve(data.map(item => item.name))
          })
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
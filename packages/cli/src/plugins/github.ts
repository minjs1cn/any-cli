import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { AnyPlugin } from '../types'

type Repos = RestEndpointMethodTypes['repos']['listForOrg']['response']['data']

export default function(): AnyPlugin {
  const octokit = new Octokit()
  let repos: Repos = []

  return {
    name: 'any:github',
    loadRepos(config) {
      const { org } = config
      return new Promise((resolve, reject) => {
        octokit
          .repos
          .listForOrg({
            org,
            type: "public",
          })
          .then(({ data }) => {
            repos = data
            const names = data.map(item => item.name)
            if (names.length) {
              resolve(names)
            } else {
              reject('组织 ' + org + ' 下不存在仓库')
            }
          }).catch(() => {
            reject('查询组织 ' + org + ' 信息失败')
          })
      })
    },
    resolveDownloadUrl(repoName: string) {
      const repo = repos.filter(item => item.name === repoName)[0]
      const { full_name, default_branch }  = repo
      return `github:${full_name}#${default_branch}`
    }
  }
}
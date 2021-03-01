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
      return new Promise(resolve => {
        octokit
          .repos
          .listForOrg({
            org,
            type: "public",
          })
          .then(({ data }) => {
            repos = data
            resolve(data.map(item => item.name))
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
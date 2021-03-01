export type AnyPlugin = {
  name: string
  loadRepos(config: AnyConfig): Promise<string[]>
  resolveDownloadUrl(repoName: string): string
}

export type AnyUserConfig = {
  api?: string
  org?: string
}

export type AnyConfig = AnyUserConfig & {
  cwd: string
  api: string
  org: string
}
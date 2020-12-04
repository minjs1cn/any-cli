import * as http from './http'

export type project = {
  id: number
  default_branch: string
  name: string
}

/**
 * 获取分组下的所有仓库
 * @param url - 工程地址
 */
export const getRepsAll = async (url: string) => {
  const projects: Array<project> = []

  try {
    const res = await http.get<{
      projects: Array<project>
    }>(url)
    if (res && res.projects) {
      res.projects.forEach(project => {
        projects.push(project)
      })
    }
  } catch (error) {
    console.log(error)
    return projects
  }

  return projects
}

export type RepsBranch = {
  name: string
}

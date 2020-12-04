import { request } from '@octokit/request'
import { OctokitResponse } from '@octokit/request/node_modules/@octokit/types/dist-types'
import { pagination } from './utils'

export type Apis = {
  user_url: string
  user_repositories_url: string
  user_organizations_url: string
  organization_url: string
  organization_repositories_url: string
}

export type Reps = {
  [index: string]: any
  id: number
  name: string
  full_name: string
  owner: {
    logim: string
    id: number
    avatar_url: string
    html_url: string
  },
  html_url: string
  description: string
  ssh_url: string
  clone_url: string
  url: string
  homepage: string
}

let apis: Apis
/**
 * 获取并缓存api列表
 */
export async function getApis() {
  if (apis) return apis
  const { status, data } = await request({
    method: 'GET',
    url: '',
  })
  if (status === 200) {
    apis = data
  }

  return apis
}

/**
 * 获取用户信息
 * @param userName {string} - 用户名
 */
export async function getUser(userName: string) {
  const apis = await getApis()
  let url = apis['user_url'].replace('{user}', userName)

  return await request<{
    [index: string]: any
    login: string
    id: number
    avatar_url: string
    html_url: string
    name: string
    company: string
    blog: string
    location: string
    email: string
  }>({
    method: 'GET',
    url,
  })
}

/**
 * 分页获取用户仓库
 * @param userName {string} - 用户名
 * @param page {number} - 页码
 * @param per_page {number} - 页数
 */
export async function getUserRepos(userName: string, page: number = 1, per_page: number = 10) {
  const apis = await getApis()
  let url = apis['user_repositories_url'].replace('{user}', userName).replace('{?type,page,per_page,sort}', '?' + pagination(page, per_page))

  return await request<Array<Reps>>({
    method: 'GET',
    url,
  })
}

/**
 * 获取组织详情
 * @param org {string} - 组织名
 */
export async function getOrg(org: string) {
  const apis = await getApis()
  let url = apis['organization_url'].replace('{org}', org)

  return await request<{
    [index: string]: any
    login: string
    id: number
    repos_url: string
    public_members_url: string
    members_url: string
    avatar_url: string
    description: string
    html_url: string
  }>({
    method: 'GET',
    url,
  })
}

/**
 * 分页获取组织下的仓库
 * @param org {string} - 组织名
 * @param page {number} - 页码
 * @param per_page {number} - 页数
 */
export async function getOrgReps(org: string, page: number = 1, per_page: number = 10) {
  const apis = await getApis()
  let url = apis['organization_repositories_url'].replace('{org}', org).replace('{?type,page,per_page,sort}', '?' + pagination(page, per_page))

  return await request<Array<Reps>>({
    method: 'GET',
    url,
  })
}

/**
 * 获取组织下全部仓库
 * @param org {string} - 组织名
 */
export async function getOrgRepsAll(org: string) {
  const { status, data } = await getOrg(org)
  if (status === 200) {
    const { repos_url } = data

    const result = await request<Array<Reps>>({
      method: 'GET',
      url: repos_url
    })

    if (result.status === 200) {
      return result.data
    }

    return []
  
  }
  return []
}

export async function getOrgMembers(org: string, member: string = '') {
  const { status, data } = await getOrg(org)

  if (status === 200) {
    let url = data['public_members_url'].replace('{/member}', member)

    return await request({
      method: 'GET',
      url,
    })
  }
  
  return { status: 404 }
}

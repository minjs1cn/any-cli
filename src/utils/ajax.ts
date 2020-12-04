import axios from 'axios'

const githubAjaxInstance = axios.create({
  baseURL: 'https://api.github.com'
})

githubAjaxInstance.interceptors.response.use(response => {
  return response.data
})


export async function gAjax() {}

gAjax.get = async function(url: string) {
  return await githubAjaxInstance.get(url)
}

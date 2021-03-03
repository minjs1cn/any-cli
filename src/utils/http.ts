import http from 'http'

export async function get<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = ''
    http.get(url, res => {
      res.on('data', chunk => {
        console.log(data)
        data += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    }).on('error', e => {
      reject(e)
    })
  })
}
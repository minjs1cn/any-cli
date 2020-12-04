import qs from 'qs'

export function pagination(page: number = 1, per_page: number = 10) {
  return qs.stringify({
    page,
    per_page
  })
}
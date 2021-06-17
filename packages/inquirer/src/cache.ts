import { CACHE_FILE, resetCacheFile } from './constant'
import fs from 'fs'

/**
 * 本地缓存
 */
export default {
  get<T>(key: string): T | null {
    try {
      const data = require(CACHE_FILE)
      return data[key]
    } catch (error) {
      resetCacheFile()
      return null
    }
  },
  
  set(key: string, name: string) {
    try {
      const data = require(CACHE_FILE)
      data[key] = name
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data))
    } catch (error) {}
  },

  remove(key?: string) {
    if (!key) {
      resetCacheFile()
      return
    }

    try {
      const data = require(CACHE_FILE)
      delete data[key]
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data))
    } catch (error) {}
  }
}
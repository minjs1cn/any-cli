import fs from 'fs'
import path from 'path'

export const ROOT = process.cwd()

export const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache')

export const CACHE_FILE = path.join(CACHE_DIR, 'any.inquirer.json')

export function mkidrCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR)
  }
}

mkidrCacheDir()

export function mkdirCacheFile() {
  if (!fs.existsSync(CACHE_FILE)) {
    fs.writeFileSync(CACHE_FILE, '{}')
  }
}

export function resetCacheFile() {
  mkdirCacheFile()
  fs.writeFileSync(CACHE_FILE, '{}')
}

mkdirCacheFile()

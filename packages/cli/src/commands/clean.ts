import fs from 'fs-extra'
import { getConfig } from '../config'
import path from 'path'

const CONFIG = getConfig()

export async function clean() {
  await Promise.all([
    fs.remove(CONFIG.es),
    fs.remove(CONFIG.lib),
    fs.remove(path.join(CONFIG.src, 'index.ts')),
    fs.remove(path.join(CONFIG.src, 'index.less'))
  ])
}
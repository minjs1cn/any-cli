import fs from 'fs-extra'
import { getConfig } from '../config'

const CONFIG = getConfig()

export async function clean() {
  await Promise.all([
    fs.remove(CONFIG.es),
    fs.remove(CONFIG.lib)
  ])
}
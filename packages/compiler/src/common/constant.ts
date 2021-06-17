import path from 'path'

export const SRC_DIR = 'src'
export const ES_DIR = 'es'
export const LIB_DIR = 'lib'

export const ROOT_POSTCSS_CONFIG_FILE = path.join(process.cwd(), 'postcss.config.js')

export const POSTCSS_CONFIG_FILE = path.join(__dirname, '../config/postcss.config.js')
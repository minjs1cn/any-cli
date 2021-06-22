import fs from "fs-extra"
import { CONST } from "../common"

type TConfig = {
  src: string
  es: string
  lib: string,
  ignore: string[]
}

const defaultConfig = {
  src: CONST.SRC_DIR,
  es: CONST.ES_DIR,
  lib: CONST.LIB_DIR,
  ignore: []
}

export function getConfig(): TConfig {
  let userConfig = {}

  if (fs.existsSync(CONST.ROOT_ANY_CONFIG_FILE)) {
    userConfig = require(CONST.ROOT_ANY_CONFIG_FILE)()
  }

  return Object.assign({}, defaultConfig, userConfig)
}
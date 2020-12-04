import { services } from '../libs/github'
import { services as services2 } from '../libs/gitlab'
import { AnyConfig } from '../config'

export type Template = {
  name: string
}

export default async function getTemplates (config: AnyConfig) {
  let list: Array<Template> = []
  
  if (config.host) {
    const data =await services2.getRepsAll(config.host + config.org)
    list = list.concat(data)
  } else {
    const data = await services.getOrgRepsAll(config.host + config.org)
    list = list.concat(data)
  }

  return list
}
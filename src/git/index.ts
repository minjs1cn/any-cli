import { download } from '../utils'
import ora from 'ora'

export async function clone(target: string, dest: string) {
  const spinner = ora(`start clone ${target.split(':').pop()}`)
  spinner.start()

  try {
    await download(target, dest)
    spinner.succeed()
  } catch (error) {
    spinner.fail()
  }
}
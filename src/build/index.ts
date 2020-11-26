export type BuildOption = {
  model: string
}

export function build(options: BuildOption) {
  console.log(options)
}
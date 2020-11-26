declare module 'download-git-repo' {
  function Callback(err: Error): void

  export type DownloadConfig = { [index: string]: any }

  export default function download(target: string, dest: string, config: DownloadConfig, cb: Callback) {}
}
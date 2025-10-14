import { createAppletConfig } from '../../@config/vite.config.applet.mts'
import { name } from './package.json'

export default ({ mode }: any) =>
  createAppletConfig({
    mode,
    packageName: name,
    aliasName: 'homepage',
    rootDir: import.meta.url,
  })

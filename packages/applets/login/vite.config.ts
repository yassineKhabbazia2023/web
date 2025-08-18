import { createAppletConfig } from '../../@config/vite.config.applet'
import { name } from './package.json'

export default ({ mode }: any) =>
  createAppletConfig({
    mode,
    packageName: name,
    aliasName: 'login',
    rootDir: import.meta.url,
  })

import { createAppletConfig } from '../../@config/vite.config.applet.ts'
import { name } from './package.json'

export default ({ mode }: any) =>
  createAppletConfig({
    mode,
    packageName: name,
    aliasName: 'ged',
    rootDir: import.meta.url,
  })

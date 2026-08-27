import type { ConfigEnv } from 'vite'
import { createAppletConfig } from '../../@config/vite.config.applet.ts'
import { name } from './package.json'

export default ({ mode }: ConfigEnv) =>
  createAppletConfig({
    mode,
    packageName: name,
    pages: ['entity-pages.index.ts', 'wallet-pages.index.ts', 'demat-mail.index.ts'],
  })

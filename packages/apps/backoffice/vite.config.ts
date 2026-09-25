import type { ConfigEnv } from 'vite'
import { createAppConfig } from '../../@config/vite.config.app.ts'
import { appVersionPlugin } from '../../@config/vite.plugin.app-version.ts'
import { e2ePlugin } from '@pulse/e2e-mocks/vite-plugin'

const PORT = 9001

export default ({ mode }: ConfigEnv) =>
  createAppConfig({
    mode,
    outDir: '../../../dist-backoffice',
    port: PORT,
    plugins: [
      e2ePlugin({ app: 'backoffice' }),
      appVersionPlugin(),
    ],
  })

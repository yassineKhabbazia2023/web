import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ConfigEnv, PreviewServer } from 'vite'
import { createAppConfig } from '../../@config/vite.config.app.ts'
import { e2ePlugin } from '@pulse/e2e-mocks/vite-plugin'

const baseUrl = process.env.VITE_BASE_PATH || '/'

export default ({ mode }: ConfigEnv) =>
  createAppConfig({
    mode,
    outDir: '../../../dist',
    base: baseUrl,
    plugins: [
      e2ePlugin(),
      {
        name: 'collaborator-spa-fallback',
        configurePreviewServer(server: PreviewServer) {
          server.middlewares.use((req: IncomingMessage, _res: ServerResponse, next: () => void) => {
            if (req.url?.startsWith('/collaborateur') && req.url.includes('.') === false) {
              req.url = '/collaborateur/index.html'
            }
            next()
          })
        },
      },
    ],
  })

import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ConfigEnv, PreviewServer } from 'vite'
import { createAppConfig } from '../../@config/vite.config.app.ts'
import { appVersionPlugin } from '../../@config/vite.plugin.app-version.ts'
import { canarytokenPlugin } from '../../@config/vite.plugin.canarytoken.ts'
import { e2ePlugin } from '@pulse/e2e-mocks/vite-plugin'

const baseUrl = process.env.VITE_BASE_PATH || '/'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default ({ mode }: ConfigEnv) =>
  createAppConfig({
    mode,
    port: 9001,
    outDir: '../../../dist',
    base: baseUrl,
    plugins: [
      e2ePlugin({
        app: 'customer',
        // Recording/replay proxy — only mounts when run via `npm run dev:proxy` (VITE_PROXY_ENABLED=true).
        // Requests starting with `/gtw` are dispatched according to the current mode
        // (passthrough/mock/hybrid). Switch the mode live at http://localhost:9001/__proxy__
        // To use it, point VITE_API_GATEWAY in public/env-vars.js to http://localhost:9001/gtw/
        // Override the target with e.g. `VITE_PROXY_TARGET=https://rec-rec01.itg.pulse.rydge.fr/desktop/gtw npm run dev:proxy`.
        proxy: {
          target: 'https://api-itg01.itg.pulse.rydge.fr/desktop/gtw',
          pathPrefix: '/gtw',
          defaultMode: 'hybrid',
          recordedDir: path.resolve(__dirname, '../e2e-mocks/recorded/customer'),
        },
      }),
      appVersionPlugin(),
      canarytokenPlugin(),
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

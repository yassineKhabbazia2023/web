import type { ConfigEnv, PreviewServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAppConfig } from '../../@config/vite.config.app.ts'
import { appVersionPlugin } from '../../@config/vite.plugin.app-version.ts'
import { canarytokenPlugin } from '../../@config/vite.plugin.canarytoken.ts'
import { e2ePlugin } from '@pulse/e2e-mocks/vite-plugin'

const baseUrl = `${process.env.VITE_BASE_PATH || '/'}collaborateur/`

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default ({ mode }: ConfigEnv) =>
  createAppConfig({
    mode,
    port: 9000,
    outDir: '../../../dist/collaborateur',
    base: baseUrl,
    plugins: [
      e2ePlugin({
        app: 'collaborator',
        // Recording/replay proxy — only mounts when run via `npm run dev:proxy` (VITE_PROXY_ENABLED=true).
        // Requests starting with `/gtw` are dispatched according to the current mode
        // (passthrough/mock/hybrid). Switch the mode live at http://localhost:9000/__proxy__
        // To use it, point VITE_API_GATEWAY in public/env-vars.js to http://localhost:9000/gtw/
        // Override the target with e.g. `VITE_PROXY_TARGET=https://api-rec01.itg.pulse.rydge.fr/desktop/gtw npm run dev:proxy`.
        proxy: {
          target: 'https://api-itg01.itg.pulse.rydge.fr/desktop/gtw',
          pathPrefix: '/gtw',
          defaultMode: 'hybrid',
          recordedDir: path.resolve(__dirname, '../e2e-mocks/recorded/collaborator'),
        },
      }),
      appVersionPlugin(),
      canarytokenPlugin(),
      {
        name: 'collaborator-html-transform',
        transformIndexHtml: {
          order: 'pre',
          handler(html: any) {
            if (mode === 'development') {
              return html
            }
            return html
              .replace('href="styles.css"', 'href="../styles.css"')
              .replace('src="env-vars.js"', 'src="../env-vars.js"')
          },
        },
        // In standalone preview, shared assets (styles.css, env-vars.js) are referenced
        // as ../styles.css in the built HTML, resolving to /styles.css.
        // Rewrite to /collaborateur/ to serve them from the build output (copied from public/).
        configurePreviewServer(server: PreviewServer) {
          server.middlewares.use((req: IncomingMessage, _res: ServerResponse, next: () => void) => {
            if (req.url === '/styles.css' || req.url === '/env-vars.js') {
              req.url = `/collaborateur${req.url}`
            }
            next()
          })
        },
      },
    ],
  })

import type { ConfigEnv, PreviewServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createAppConfig } from '../../@config/vite.config.app.ts'

const baseUrl = `${process.env.VITE_BASE_PATH || '/'}collaborateur/`

export default ({ mode }: ConfigEnv) =>
  createAppConfig({
    mode,
    outDir: '../../../dist/collaborateur',
    base: baseUrl,
    plugins: [
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

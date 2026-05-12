import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const tokenFilePath = path.resolve(__dirname, 'canarytoken.html')

/**
 * Injects the canarytoken script into index.html at production build time.
 *
 * The canarytoken is a security tripwire: it beacons out when the built page
 * is served from a domain that does not end with rydge.fr, letting the security
 * team detect unauthorized clones of the source.
 * The script is only embedded during `vite build`
 * dev, dev:e2e, and dev:mocks all run `vite` and skip it.
 */
export function canarytokenPlugin(): Plugin {
  return {
    name: 'pulse:canarytoken',
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const token = readFileSync(tokenFilePath, 'utf-8')
        return html.replaceAll('</head>', () => `${token}  </head>`)
      },
    },
  }
}

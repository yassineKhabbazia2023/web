import type { Plugin } from 'vite'
import { APP_VERSION_FILE_NAME, APP_VERSION_RELOAD_STORAGE_KEY } from '../libraries/toolbox/src/constants/new-version.consts'

function getVersionCheckScript(buildId: string, appVersionUrl: string) {
  return `
(function () {
  var currentBuildId = ${JSON.stringify(buildId)}
  var reloadStorageKey = ${JSON.stringify(APP_VERSION_RELOAD_STORAGE_KEY)}

  function reloadOnce(reloadReason) {
    try {
      if (sessionStorage.getItem(reloadStorageKey) === reloadReason) {
        return
      }
      sessionStorage.setItem(reloadStorageKey, reloadReason)
    } catch (error) {
      return
    }
    window.location.reload()
  }

  fetch(${JSON.stringify(appVersionUrl)}, { cache: 'no-store' })
    .then(function (response) {
      return response.ok === true ? response.json() : null
    })
    .then(function (appVersion) {
      if (appVersion !== null && typeof appVersion.buildId === 'string' && appVersion.buildId !== currentBuildId) {
        reloadOnce(appVersion.buildId)
      }
    })
    .catch(function () {})

  window.addEventListener('vite:preloadError', function () {
    reloadOnce('preload-error-' + currentBuildId)
  })
})()
`
}

/**
 * Forces browsers to pick up a new release without clearing their cache manually.
 *
 * JS/CSS chunks are content-hashed, but index.html keeps a stable name, so a browser
 * may serve a stale copy that points to the previous release's chunks.
 * Each build gets a unique build id, published in `app-version.json` and embedded in index.html.
 * On page load, the inline script fetches `app-version.json` bypassing the cache and reloads
 * the page only when the published build id differs from its own (i.e. a new version is available).
 * It also reloads when a lazy chunk fails to load (`vite:preloadError`), which happens in tabs
 * left open across a release. Both reloads happen at most once per target, to avoid reload loops.
 * Only applied during `vite build`.
 */
export function appVersionPlugin(): Plugin {
  const buildId = new Date().toISOString()
  let appVersionUrl = APP_VERSION_FILE_NAME

  return {
    name: 'pulse:app-version',
    apply: 'build',
    config() {
      return {
        define: {
          'import.meta.env.VITE_APP_BUILD_ID': JSON.stringify(buildId),
        },
      }
    },
    configResolved(config) {
      appVersionUrl = `${config.base}${APP_VERSION_FILE_NAME}`
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: APP_VERSION_FILE_NAME,
        source: `${JSON.stringify({ buildId })}\n`,
      })
    },
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          children: getVersionCheckScript(buildId, appVersionUrl),
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

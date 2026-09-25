import { NewVersionManager } from '../managers/new-version.manager'

/**
 * Router guard: performs a full page load on the next page-to-page navigation once a new version is detected.
 * Query/hash-only navigations (sorting, filters, drawers, links from emails…) are ignored,
 * so that a reload never interrupts an in-page interaction.
 * Must be registered first, so that no other guard runs before the reload.
 */
export const newVersionReloadGuard = (
  to: { path: string, fullPath: string },
  from: { path: string },
): boolean | undefined => {
  if (to.path === from.path) {
    return undefined
  }
  NewVersionManager.checkForNewVersion()
  if (NewVersionManager.consumeReload() === false) {
    return undefined
  }
  window.location.assign(`${import.meta.env.BASE_URL}${to.fullPath.slice(1)}`)
  return false
}

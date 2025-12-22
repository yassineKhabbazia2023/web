import type { NavigationGuard } from 'vue-router'
import { SessionStorageService } from '@pulse/common/services/storage'

export const deepLinkGuard: NavigationGuard = (to, _from, next) => {
  // Check for deep link redirect context first (consumed on read)
  const savedFullPath = SessionStorageService.consumeRedirectContext()
  // Only redirect if saved path exists and differs from current path to avoid unnecessary navigation
  if (savedFullPath !== undefined && savedFullPath !== to.fullPath) {
    return next(savedFullPath)
  }

  return next()
}

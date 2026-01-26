import type { NavigationHookAfter } from 'vue-router'

const SCROLL_CONTAINER_SELECTORS = ['.main-container', '.mobile-home-layout__main']

export function resetScrollPosition(container: HTMLElement): void {
  // Use setTimeout to ensure DOM has been updated after navigation
  setTimeout(() => {
    container.scrollTop = 0
  }, 0)
}

export const scrollResetGuard: NavigationHookAfter = () => {
  const container = SCROLL_CONTAINER_SELECTORS
    .map(selector => document.querySelector<HTMLElement>(selector))
    .find(Boolean)

  if (container) {
    resetScrollPosition(container)
  }
}

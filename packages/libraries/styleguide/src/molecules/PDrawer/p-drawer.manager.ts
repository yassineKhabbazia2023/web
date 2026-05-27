import type { Ref } from 'vue'
import { ElDrawerInstanceType } from './PDrawerTypes'

type ClickHandler = (event: Event) => void

// Map to store multiple click handlers for different drawers
const outsideClickHandlers = new Map<string, ClickHandler>()

export function trackOutsideClickMiniDrawer(
  drawerUniqueId: string,
  drawerTemplateRef: Ref<ElDrawerInstanceType | null>,
) {
  // Remove existing handler for this drawer if it exists
  killTrackOutsideClick(drawerUniqueId)

  const handler = (event: Event) => {
    handleOutsideClickMiniDrawer(
      event,
      drawerUniqueId,
      drawerTemplateRef,
    )
  }

  outsideClickHandlers.set(drawerUniqueId, handler)
  globalThis.addEventListener('click', handler)
}

export function killTrackOutsideClick(drawerUniqueId: string) {
  const handler = outsideClickHandlers.get(drawerUniqueId)
  if (handler) {
    globalThis.removeEventListener('click', handler)
    outsideClickHandlers.delete(drawerUniqueId)
  }
}

function handleOutsideClickMiniDrawer(
  event: Event,
  drawerUniqueId: string,
  drawerTemplateRef: Ref<ElDrawerInstanceType | null>,
) {
  const isDrawerInPath = getIsDrawerInPath(event.composedPath() as HTMLElement[], drawerUniqueId)

  if (isDrawerInPath || !drawerTemplateRef.value) {
    return
  }

  drawerTemplateRef.value.handleClose()
}

function getIsDrawerInPath(composedPath: HTMLElement[], drawerUniqueId: string) {
  return composedPath.some((element) =>
    element instanceof HTMLElement &&
    element.classList.contains(drawerUniqueId),
  )
}

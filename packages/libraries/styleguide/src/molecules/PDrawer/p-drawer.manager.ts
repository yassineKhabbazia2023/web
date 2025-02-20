import type { Ref } from 'vue'
import { ElDrawerInstanceType } from './PDrawerTypes'


let outsideClickHandler: ((event: Event) => void) | null = null

export function trackOutsideClickMiniDrawer(
  drawerUniqueId: string,
  drawerTemplateRef: Ref<ElDrawerInstanceType | null>,
) {
  outsideClickHandler = (event: Event) => handleOutsideClickMiniDrawer(
    event,
    drawerUniqueId,
    drawerTemplateRef,
  )
  window.addEventListener('click', outsideClickHandler)
}

export function killTrackOutsideClick() {
  if (outsideClickHandler) {
    window.removeEventListener('click', outsideClickHandler)
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
import type { Ref, WritableComputedRef } from 'vue'
import { watch, onBeforeUnmount } from 'vue'
import { generateUniqueId } from '../../utils/uniqueId/unique-id.helper'
import { trackOutsideClickMiniDrawer, killTrackOutsideClick } from './p-drawer.manager'
import type { ElDrawerInstanceType, PDrawerProps } from './PDrawerTypes'


export function usePDrawer(
  drawerTemplateRef: Ref<ElDrawerInstanceType | null>,
  isDrawerOpened: WritableComputedRef<boolean>,
  drawerType: PDrawerProps['pType'],
) {
  const componentUniqueId = generateUniqueId()

  watch(isDrawerOpened, (value) => {
    if (drawerType === 'mini') {
      if (value) {
        setTimeout(() => {
          trackOutsideClickMiniDrawer(componentUniqueId, drawerTemplateRef)
        }, 50)
      } else {
        killTrackOutsideClick(componentUniqueId)
      }
    }
  }, { immediate: true })

  // Cleanup when component is unmounted
  onBeforeUnmount(() => {
    killTrackOutsideClick(componentUniqueId)
  })

  return {
    componentUniqueId,
  }
}

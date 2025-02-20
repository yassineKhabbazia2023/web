import type { Ref, WritableComputedRef } from 'vue'
import { watch } from 'vue'
import { genereateUniqueId } from '../../utils/uniqueId/unique-id.helper'
import { trackOutsideClickMiniDrawer, killTrackOutsideClick } from './p-drawer.manager'
import type { ElDrawerInstanceType } from './PDrawerTypes'


export function usePDrawer(
  drawerTemplateRef: Ref<ElDrawerInstanceType | null>,
  isDrawerOpened: WritableComputedRef<boolean>,
) {
  const componentUniqueId = genereateUniqueId()
  watch(isDrawerOpened, (value) => {
    if (value) {
      setTimeout(() => {
        trackOutsideClickMiniDrawer(componentUniqueId, drawerTemplateRef)
      }, 50)
    } else {
      killTrackOutsideClick()
    }
  })

  return {
    componentUniqueId,
  }
}
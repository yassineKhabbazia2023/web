import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import { vi } from 'vitest'
import { usePDrawer } from './p-drawer.composable'
import type { ElDrawerInstanceType } from './PDrawerTypes'
import * as drawerManager from './p-drawer.manager'

const drawerTemplateRef = ref({}) as Ref<ElDrawerInstanceType>
const isDrawerOpened = ref(false)
const drawerModel = computed({
  get() {
    return isDrawerOpened.value
  },
  set(value) {
    isDrawerOpened.value = value
  },
})


describe('p drawer composable', () => {
  it('should call trackOutsideClickMiniDrawer 50ms after opening the drawer', async () => {
    vi.useFakeTimers()
    const trackOutsideClickSpy = vi.spyOn(drawerManager, 'trackOutsideClickMiniDrawer')
    usePDrawer(drawerTemplateRef, drawerModel)

    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
    drawerModel.value = true
    await nextTick()

    vi.advanceTimersByTime(50)
    expect(trackOutsideClickSpy).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('should call killTrackOutsideClick after closing the drawer', async () => {
    const killTrackOutsideSpy = vi.spyOn(drawerManager, 'killTrackOutsideClick')
    drawerModel.value = true
    usePDrawer(drawerTemplateRef, drawerModel)

    expect(killTrackOutsideSpy).not.toHaveBeenCalled()
    drawerModel.value = false
    await nextTick()

    expect(killTrackOutsideSpy).toHaveBeenCalled()
  })
})

import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { Ref, WritableComputedRef } from 'vue'

import { usePDrawer } from './p-drawer.composable'
import type { ElDrawerInstanceType } from './PDrawerTypes'
import * as drawerManager from './p-drawer.manager'

const drawerTypeMini = 'mini'
const drawerTypeFullscreen = 'fullscreen'

// usePDrawer is called outside a component here, so its onBeforeUnmount
// cleanup never runs: every registered outside-click handler must be killed
// after each test or it would keep firing for the rest of the worker.
const activeDrawerIds: string[] = []
const usePDrawerTracked: typeof usePDrawer = (...args) => {
  const result = usePDrawer(...args)
  activeDrawerIds.push(result.componentUniqueId)
  return result
}


describe('p drawer composable', () => {
  let drawerTemplateRef: Ref<ElDrawerInstanceType>
  let isDrawerOpened: Ref<boolean>
  let drawerModel: WritableComputedRef<boolean>

  beforeEach(() => {
    // usePDrawer runs outside a component here: neutralize the spy-wrapped
    // onBeforeUnmount so Vue does not warn about the missing instance (its
    // cleanup is replaced by the manual kill in afterEach anyway).
    vi.mocked(onBeforeUnmount).mockImplementation(() => undefined)
    drawerTemplateRef = ref({}) as Ref<ElDrawerInstanceType>
    isDrawerOpened = ref(false)
    drawerModel = computed({
      get() {
        return isDrawerOpened.value
      },
      set(value: boolean) {
        isDrawerOpened.value = value
      },
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    for (const drawerId of activeDrawerIds) {
      drawerManager.killTrackOutsideClick(drawerId)
    }
    activeDrawerIds.length = 0
  })

  it('should call trackOutsideClickMiniDrawer 50ms after opening the drawer', async () => {
    vi.useFakeTimers()
    const trackOutsideClickSpy = vi.spyOn(drawerManager, 'trackOutsideClickMiniDrawer')
    usePDrawerTracked(drawerTemplateRef, drawerModel, drawerTypeMini)

    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
    drawerModel.value = true
    await nextTick()

    vi.advanceTimersByTime(50)
    expect(trackOutsideClickSpy).toHaveBeenCalled()
  })

  it('should not trackOutsideClickMiniDrawer if drawer type is NOT mini', async () => {
    vi.useFakeTimers()
    const trackOutsideClickSpy = vi.spyOn(drawerManager, 'trackOutsideClickMiniDrawer')
    usePDrawerTracked(drawerTemplateRef, drawerModel, drawerTypeFullscreen)

    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
    drawerModel.value = true
    await nextTick()

    vi.advanceTimersByTime(50)
    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
  })

  it('should call killTrackOutsideClick after closing the drawer', async () => {
    vi.useFakeTimers()
    const killTrackOutsideSpy = vi.spyOn(drawerManager, 'killTrackOutsideClick')
    drawerModel.value = true
    usePDrawerTracked(drawerTemplateRef, drawerModel, drawerTypeMini)

    expect(killTrackOutsideSpy).not.toHaveBeenCalled()
    drawerModel.value = false
    await nextTick()

    expect(killTrackOutsideSpy).toHaveBeenCalled()
  })
})

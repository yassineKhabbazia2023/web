import { computed, nextTick, ref } from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import { vi } from 'vitest'
import { usePDrawer } from './p-drawer.composable'
import type { ElDrawerInstanceType } from './PDrawerTypes'
import * as drawerManager from './p-drawer.manager'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onBeforeUnmount: vi.fn(),
  }
})

const drawerTypeMini = 'mini'
const drawerTypeFullscreen = 'fullscreen'


describe('p drawer composable', () => {
  let drawerTemplateRef: Ref<ElDrawerInstanceType>
  let isDrawerOpened: Ref<boolean>
  let drawerModel: WritableComputedRef<boolean>

  beforeEach(() => {
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
  })

  it('should call trackOutsideClickMiniDrawer 50ms after opening the drawer', async () => {
    vi.useFakeTimers()
    const trackOutsideClickSpy = vi.spyOn(drawerManager, 'trackOutsideClickMiniDrawer')
    usePDrawer(drawerTemplateRef, drawerModel, drawerTypeMini)

    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
    drawerModel.value = true
    await nextTick()

    vi.advanceTimersByTime(50)
    expect(trackOutsideClickSpy).toHaveBeenCalled()
  })

  it('should not trackOutsideClickMiniDrawer if drawer type is NOT mini', async () => {
    vi.useFakeTimers()
    const trackOutsideClickSpy = vi.spyOn(drawerManager, 'trackOutsideClickMiniDrawer')
    usePDrawer(drawerTemplateRef, drawerModel, drawerTypeFullscreen)

    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
    drawerModel.value = true
    await nextTick()

    vi.advanceTimersByTime(50)
    expect(trackOutsideClickSpy).not.toHaveBeenCalled()
  })

  it('should call killTrackOutsideClick after closing the drawer', async () => {
    const killTrackOutsideSpy = vi.spyOn(drawerManager, 'killTrackOutsideClick')
    drawerModel.value = true
    usePDrawer(drawerTemplateRef, drawerModel, drawerTypeMini)

    expect(killTrackOutsideSpy).not.toHaveBeenCalled()
    drawerModel.value = false
    await nextTick()

    expect(killTrackOutsideSpy).toHaveBeenCalled()
  })
})

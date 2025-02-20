import { ref, type Ref } from 'vue'
import { vi } from 'vitest'
import {
  trackOutsideClickMiniDrawer,
  killTrackOutsideClick,
} from './p-drawer.manager'
import type { ElDrawerInstanceType } from './PDrawerTypes'

describe('p-drawer.manager', () => {
  let drawerTemplateRef: Ref<ElDrawerInstanceType | null>

  beforeEach(() => {
    drawerTemplateRef = ref({
      handleClose: vi.fn(),
    } as unknown as ElDrawerInstanceType)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add a click event listener when trackOutsideClickMiniDrawer is called', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    trackOutsideClickMiniDrawer('unique-drawer-id', drawerTemplateRef)

    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('should remove the click event listener when killTrackOutsideClick is called', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    trackOutsideClickMiniDrawer('unique-drawer-id', drawerTemplateRef)
    killTrackOutsideClick()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('should not close the drawer if the click is inside', () => {
    const event = new MouseEvent('click')

    const drawerElement = document.createElement('div')
    drawerElement.classList.add('unique-drawer-id')

    vi.spyOn(event, 'composedPath').mockReturnValue([drawerElement])

    trackOutsideClickMiniDrawer('unique-drawer-id', drawerTemplateRef)
    window.dispatchEvent(event)

    expect(drawerTemplateRef.value?.handleClose).not.toHaveBeenCalled()
  })


  it('should close the drawer if the click is outside', () => {
    const event = new MouseEvent('click')
    vi.spyOn(event, 'composedPath').mockReturnValue([] as unknown as HTMLElement[])

    trackOutsideClickMiniDrawer('unique-drawer-id', drawerTemplateRef)
    window.dispatchEvent(event)

    expect(drawerTemplateRef.value?.handleClose).toHaveBeenCalled()
  })
})

import { shallowMount } from '@vue/test-utils'
import { HTMLService } from '@pulse/common/services/html'
import { initProductFruitsAnonymousCustomer, stopProductFruits } from '@shared/plugins/product-fruits/product-fruits.plugin'

import Maintenance from './maintenance.page.vue'

const setIntervalMock = vi.hoisted(() => vi.fn())
const clearIntervalMock = vi.hoisted(() => vi.fn())
const reloadMock = vi.hoisted(() => vi.fn())

declare let window: {
  setInterval: (_: () => void, _delay: number) => void,
  clearInterval: (_: () => void) => void,
  location: Location
} & Window

window.setInterval = setIntervalMock
window.clearInterval = clearIntervalMock
;(window.location as any) = {
  reload: reloadMock,
}

vi.mock('@pulse/common/services/html', () => ({
  HTMLService: {
    setDocumentTitle: vi.fn(),
    resetDocumentTitle: vi.fn(),
  },
}))
const HTMLServiceSetDocumentTitleMock = vi.mocked(HTMLService.setDocumentTitle)

vi.mock('@shared/plugins/product-fruits/product-fruits.plugin')
const initProductFruitsAnonymousCustomerMock = vi.mocked(initProductFruitsAnonymousCustomer)
const stopProductFruitsMock = vi.mocked(stopProductFruits)

function createWrapper() {
  return shallowMount(Maintenance, {
    global: {
      stubs: {
        PMaintenance: {
          name: 'PMaintenance',
          template: '<div><slot name="title" /><slot name="subtitle" /><slot name="footer" /></div>',
        },
      },
    },
  })
}

const DURATION = 900000

describe('Maintenance', () => {
  it('should initialize properly', async () => {
    const intervalMock = vi.fn()
    setIntervalMock.mockReturnValue(intervalMock)

    const expectedSetTitleParameters = ['Maintenance - RYDGE Conseil']
    const expectedSetIntervalParameters = [
      expect.any(Function),
      DURATION,
    ]
    const expectedClearIntervalParameters = [intervalMock]
    const wrapper = createWrapper()

    const snapFilepath = '__snap__/maintenance.page.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)

    expect(HTMLServiceSetDocumentTitleMock).toHaveBeenCalledExactlyOnceWith(...expectedSetTitleParameters)

    expect(setIntervalMock).toHaveBeenCalledExactlyOnceWith(...expectedSetIntervalParameters)

    expect(initProductFruitsAnonymousCustomerMock).toHaveBeenCalledExactlyOnceWith()

    expect(stopProductFruitsMock).not.toHaveBeenCalled()

    wrapper.unmount()
    expect(stopProductFruitsMock).toHaveBeenCalledExactlyOnceWith()

    expect(clearIntervalMock).toHaveBeenCalledExactlyOnceWith(...expectedClearIntervalParameters)
  })

  it('should call window.location.reload after a while', () => {
    vi.useFakeTimers()

    createWrapper()

    vi.advanceTimersByTime(DURATION + 1)
    vi.useRealTimers()

    expect(reloadMock).toHaveBeenCalledExactlyOnceWith()
  })
})

import { shallowMount } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { HTMLService } from '@pulse/common/services/html'
import { initProductFruitsAnonymousCustomer, stopProductFruits } from '@shared/plugins/product-fruits/product-fruits.plugin'

import Maintenance from './maintenance.page.vue'

const setIntervalMock = vi.hoisted(() => vi.fn())
const clearIntervalMock = vi.hoisted(() => vi.fn())
const reloadMock = vi.hoisted(() => vi.fn())

// Never assign these worker-shared globals directly (doctrine: shared-dom): a raw
// assignment survives the file — and vi.useFakeTimers() would stash the mocked
// setInterval as the "real" one, so every later useRealTimers() restores the mock.
// vi.stubGlobal is undone by unstubGlobals after each test.
// The product-fruits plugin is spy-wrapped project-wide, real by default
// (doctrine: shared-hubs): automock-like no-ops are re-armed before each test.
const initProductFruitsAnonymousCustomerMock = vi.mocked(initProductFruitsAnonymousCustomer)
const stopProductFruitsMock = vi.mocked(stopProductFruits)

beforeEach(() => {
  vi.stubGlobal('setInterval', setIntervalMock)
  vi.stubGlobal('clearInterval', clearIntervalMock)
  vi.stubGlobal('location', { ...window.location, reload: reloadMock })
  initProductFruitsAnonymousCustomerMock.mockReturnValue(undefined)
  stopProductFruitsMock.mockReturnValue(undefined)
})

let HTMLServiceSetDocumentTitleMock: MockInstance

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
  beforeEach(() => {
    // doctrine: static-classes — HTMLService is a static class, stubbed per test
    HTMLServiceSetDocumentTitleMock = vi.spyOn(HTMLService, 'setDocumentTitle').mockReturnValue()
  })

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

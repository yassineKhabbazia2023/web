import { shallowMount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { initProductFruitsAnonymousCustomer, stopProductFruits } from '@app/plugins/ProductFruits/productFruits.plugin'
import { HTMLService } from '@pulse/core'

import Maintenance from './Maintenance.page.vue'

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
window.location = {
  reload: reloadMock,
} as unknown as Location

vi.mock('@pulse/core')
const HTMLServiceSetDocumentTitleMock = vi.mocked(HTMLService.setDocumentTitle)

vi.mock('@app/plugins/ProductFruits/productFruits.plugin')
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

    const snapFilepath = '__snap__/Maintenance.page.html'
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)

    expect(HTMLServiceSetDocumentTitleMock).toHaveBeenCalledOnce()
    expect(HTMLServiceSetDocumentTitleMock).toHaveBeenCalledWith(...expectedSetTitleParameters)

    expect(setIntervalMock).toHaveBeenCalledOnce()
    expect(setIntervalMock).toHaveBeenCalledWith(...expectedSetIntervalParameters)

    expect(initProductFruitsAnonymousCustomerMock).toHaveBeenCalledOnce()
    expect(initProductFruitsAnonymousCustomerMock).toHaveBeenCalledWith(/* no paramter */)

    expect(stopProductFruitsMock).not.toHaveBeenCalled()

    wrapper.unmount()
    expect(stopProductFruitsMock).toHaveBeenCalledOnce()
    expect(stopProductFruitsMock).toHaveBeenCalledWith(/* no paramter */)

    expect(clearIntervalMock).toHaveBeenCalledOnce()
    expect(clearIntervalMock).toHaveBeenCalledWith(...expectedClearIntervalParameters)
  })

  it('should call window.location.reload after a while', () => {
    vi.useFakeTimers()

    createWrapper()

    vi.advanceTimersByTime(DURATION + 1)
    vi.useRealTimers()

    expect(reloadMock).toHaveBeenCalledOnce()
    expect(reloadMock).toHaveBeenCalledWith(/* no paramter */)
  })
})

import { flushPromises, shallowMount } from '@vue/test-utils'
import { getOffersCatalogResponseMock } from '../../mocks/offers-catalog.service.mock'
import { loggerMock } from '@pulse/core/mocks'

import OffersCatalog from './offers-catalog.vue'

const offersCatalogResponseMock = getOffersCatalogResponseMock()
const getOffersCatalogMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
}))

vi.mock('../../services/offers-catalog.service', () => ({
  getOffersCatalog: getOffersCatalogMock,
}))

async function createWrapper() {
  const wrapper = shallowMount(OffersCatalog)
  await flushPromises()

  return wrapper
}

describe('offers-catalog', () => {
  it('should display properly', async () => {
    getOffersCatalogMock.mockResolvedValue(offersCatalogResponseMock)
    const wrapper = await createWrapper()

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/offers-catalog.html')
    expect(loggerMock.error).not.toHaveBeenCalled()
  })

  it('should call logger.error when api failes', async () => {
    const errorMock = 'error mock'
    getOffersCatalogMock.mockRejectedValue(errorMock)
    const expectedParameters = [
      'Error while loading offersCatalog',
      errorMock,
    ]

    await createWrapper()

    expect(loggerMock.error).toHaveBeenCalledOnce()
    expect(loggerMock.error).toHaveBeenCalledWith(...expectedParameters)
  })
})

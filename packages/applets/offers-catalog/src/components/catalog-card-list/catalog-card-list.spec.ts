import { shallowMount } from '@vue/test-utils'
import type { CatalogCardListProps } from './catalog-card-list.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mocks'
import { APICallStatus } from '@pulse/common/enums'

import CatalogCardList from './catalog-card-list.vue'

const offersMock = getOffersMock()

const defaultProps: CatalogCardListProps = {
  offers: offersMock,
  loadingStatus: APICallStatus.IDLE,
}

function createWrapper(override: Partial<CatalogCardListProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogCardList, {
    props,
  })
}

describe('catalog-card-list', () => {
  const tests = [{
    loadingStatus: APICallStatus.SUCCESS,
  }, {
    loadingStatus: APICallStatus.LOADING,
  }]
  it.each(tests)('should display properly when loadingStatus equals $loadingStatus', async ({
    loadingStatus,
  }) => {
    const wrapper = createWrapper({
      loadingStatus,
    })

    const snapFilePath = `__snap__/catalog-card-list.${loadingStatus}.html`
    await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
  })

  it('should emit select-offer on click', () => {
    const expectedEmitted = [offersMock[1].id]
    const wrapper = createWrapper()

    const catalogCards = wrapper.findAllComponents({ name: 'CatalogCard' })
    const catalogCard = catalogCards[1]
    catalogCard.trigger('click')

    expect(wrapper.emitted('select-offer')).toStrictEqual([expectedEmitted])
  })
})

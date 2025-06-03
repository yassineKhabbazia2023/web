import { shallowMount } from '@vue/test-utils'
import type { CatalogCardListProps } from './catalog-card-list.types'
import { getOffersMock } from '../../mocks/offers-catalog.service.mock'

import CatalogCardList from './catalog-card-list.vue'

const offersMock = getOffersMock()

const defaultProps: CatalogCardListProps = {
  offers: offersMock,
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
  it('should display properly', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-card-list.html')
  })
})

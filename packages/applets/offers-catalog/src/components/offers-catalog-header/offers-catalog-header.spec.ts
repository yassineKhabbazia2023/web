import { shallowMount } from '@vue/test-utils'
import type { OffersCatalogHeaderProps } from './offers-catalog-header.types'

import CatalogTag from './offers-catalog-header.vue'

const defaultProps: OffersCatalogHeaderProps = {
  searchTerm: '',
}

function createWrapper(override: Partial<OffersCatalogHeaderProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }
  return shallowMount(CatalogTag, {
    props,
    global: {
      stubs: {
        PIcon: true,
        'i18n-t': {
          template: '<div>Got a customer <slot name="need" /> Find <slot name="theOffer" />!</div>',
        },
      },
    },
  })
}

describe('offers-catalog-header', () => {
  it('should display properly', async () => {
    const wrapper = createWrapper({
      searchTerm: 'search term mock',
    })

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/offers-catalog-header.html')
  })

  it('should emit update:search-term when PFormSearch emits update:p-search', () => {
    const searchTermMock = 'search term mock'
    const expectedEmittedSearchTerm = searchTermMock
    const wrapper = createWrapper()

    const pFormSearch = wrapper.findComponent({ name: 'PFormSearch' })
    pFormSearch.vm.$emit('update:p-search', searchTermMock)
    expect(wrapper.emitted('update:search-term')).toStrictEqual([[expectedEmittedSearchTerm]])
  })
})

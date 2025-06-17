import { shallowMount } from '@vue/test-utils'
import type { OffersCatalogHeaderProps } from './offers-catalog-header.types'

import CatalogTag from './offers-catalog-header.vue'

const defaultProps: OffersCatalogHeaderProps = {
  searchTerm: '',
}

const clearSearchMock = vi.fn()

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
        PFormSearch: {
          name: 'PFormSearch',
          template: '<div />',
          methods: {
            clearSearch: clearSearchMock,
          },
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

  it('should call PFormSearch clearSearch when receives clearSearch() is called', () => {
    const wrapper = createWrapper()

    wrapper.vm.clearSearch()

    expect(clearSearchMock).toHaveBeenCalledOnce()
    expect(clearSearchMock).toHaveBeenCalledWith(/* no parameters */)
  })
})

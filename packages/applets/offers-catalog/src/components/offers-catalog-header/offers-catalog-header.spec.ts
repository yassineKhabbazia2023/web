import { shallowMount } from '@vue/test-utils'

import CatalogTag from './offers-catalog-header.vue'

function createWrapper() {
  return shallowMount(CatalogTag, {
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
  it('should display properly', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/offers-catalog-header.html')
  })
})

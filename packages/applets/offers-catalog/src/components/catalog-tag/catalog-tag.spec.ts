import { shallowMount } from '@vue/test-utils'
import type { CatalogTagProps } from './catalog-tag.types'

import CatalogTag from './catalog-tag.vue'

const defaultProps: CatalogTagProps = {
  tagLabel: 'Tag label',
  tagStyle: 'style1',
}
function createWrapper(overrideProps: Partial<CatalogTagProps> = {}) {
  const props = {
    ...defaultProps,
    ...overrideProps,
  }
  return shallowMount(CatalogTag, { props })
}

describe('offers-catalog', () => {
  it('should display properly', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-tag.html')
  })
})

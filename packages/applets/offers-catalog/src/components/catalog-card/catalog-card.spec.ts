import { shallowMount } from '@vue/test-utils'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogCardMock } from '../../mocks/catalog-card.mock'

import CatalogCardList from './catalog-card.vue'

const cardMock = getCatalogCardMock()

const defaultProps: CatalogCardProps = {
  ...cardMock,
}

function createWrapper(override: Partial<CatalogCardProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(CatalogCardList, {
    props,
  })
}

describe('catalog-card', () => {
  it('should display properly', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-card.html')
  })
})

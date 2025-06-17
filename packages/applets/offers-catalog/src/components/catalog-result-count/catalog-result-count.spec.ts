import { shallowMount } from '@vue/test-utils'
import type { CatalogResultCountProps } from './catalog-result-count.types'

import CatalogResultCount from './catalog-result-count.vue'

const searchTermMock = 'search term mock'
const resultCountMock = 5

const defaultProps: CatalogResultCountProps = {
  searchTerm: searchTermMock,
  resultCount: resultCountMock,
}

function createWrapper(override: Partial<CatalogResultCountProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }
  return shallowMount(CatalogResultCount, {
    props,
  })
}

describe('catalog-result-count', () => {
  describe('display', () => {
    const tests = [{
      searchTerm: '',
      resultCount: 0,
      description: 'no-seachTerm.no-ResultCount',
    }, {
      searchTerm: 'Fourniture',
      resultCount: 0,
      description: 'seachTerm.no-ResultCount',
    }, {
      searchTerm: 'Fourniture',
      resultCount: 1,
      description: 'seachTerm.1-resultCount',
    }, {
      searchTerm: 'Fourniture',
      resultCount: 3,
      description: 'seachTerm.3-resultCount',
    }, {
      searchTerm: '',
      resultCount: 3,
      description: 'no-SeachTerm.3-resultCount',
    }]
    it.each(tests)('should display properly when $description', async ({
      searchTerm,
      resultCount,
      description,
    }) => {
      const wrapper = createWrapper({
        searchTerm,
        resultCount,
      })

      const snapFilePath = `__snap__/catalog-result-count.${description}.html`
      await expect(wrapper.html()).toMatchFileSnapshot(snapFilePath)
    })
  })

  describe('event', () => {
    it('should emit when', () => {
      const expectedEmitted = [[]]
      const wrapper = createWrapper()

      const pButton = wrapper.findComponent({ name: 'PButton' })
      pButton.vm.$emit('click')

      expect(wrapper.emitted('clear-search')).toStrictEqual(expectedEmitted)
    })
  })
})

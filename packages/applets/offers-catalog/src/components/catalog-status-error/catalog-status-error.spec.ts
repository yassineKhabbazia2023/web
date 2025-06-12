import { shallowMount } from '@vue/test-utils'
import CatalogStatusError from './catalog-status-error.vue'

function createWrapper() {
  return shallowMount(CatalogStatusError)
}

describe('catalog-status-error', () => {
  it('should render properly', async () => {
    const wrapper = createWrapper()

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/catalog-status-error.html')
  })
})

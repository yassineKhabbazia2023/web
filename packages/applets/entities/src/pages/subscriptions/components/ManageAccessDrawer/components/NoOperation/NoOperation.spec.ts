import { shallowMount } from '@vue/test-utils'

import NoOperation from './NoOperation.vue'

function createWrapper() {
  return shallowMount(NoOperation)
}

describe('test NoOperation', () => {
  it('should render NoOperation', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toMatchFileSnapshot('__snap__/NoOperation.html')
  })
})

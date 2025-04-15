import { expect, it, describe } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import TokenValidationLoader from '.'

const mountComponent = () =>
  shallowMount(TokenValidationLoader, {
    global: {
      stubs: {
        Ploader: true,
      },
    },
  })

describe('TokenValidationLoader', () => {
  it('renders the loader correctly', async () => {
    const wrapper = mountComponent()

    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/TokenValidationLoader.snap')
  })
})

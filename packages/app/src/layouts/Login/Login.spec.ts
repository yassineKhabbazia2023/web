import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import Login from './'

const mockRoute = vi.fn(() => ({
  name: 'mocked route name',
}))
vi.mock('vue-router', () => ({
  useRoute: () => ({
    route: mockRoute,
  }),
}))
const createWrapper = () => shallowMount(Login, {
  global: {
    stubs: {
      'router-view': {
        name: 'router-view',
        template: '<div><slot /></div>',
      },
    },
  },
})

describe('login', () => {
  const wrapper = createWrapper()

  it('has links in the footer', () => {
    expect(wrapper.find('.footer').exists()).toBeTruthy()
  })
})

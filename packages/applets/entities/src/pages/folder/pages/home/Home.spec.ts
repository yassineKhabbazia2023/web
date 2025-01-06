import { defineStore } from 'pinia'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { mockedEntity } from '../../../wallet/components/TableData/mockData'
import Home from '.'

const pinia = createTestingPinia()
vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true,
      defaultEntity: () => mockedEntity,
    },
  }),
  sanitizeUrl: vi.fn(),
}))

const createWrapper = (): VueWrapper<any> => mount(Home, {
  global: {
    plugins: [pinia],
  },
})

describe('clientHome', () => {
  const wrapper = createWrapper()
  it('should render the the component', () => {
    expect(wrapper.find('.home-folder').exists()).toBeTruthy()
  })

  it('renders the entity header', () => {
    const wrapper = createWrapper()
    const entityHeaderWrapper = wrapper.findComponent({ name: 'EntityHeader' })
    expect(entityHeaderWrapper.exists()).toBeTruthy()
  })
})

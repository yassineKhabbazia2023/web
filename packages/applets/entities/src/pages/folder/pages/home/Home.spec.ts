import { defineStore } from 'pinia'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import Home from '.'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'

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
    stubs: {
      EntityHeader: true,
      PRow: true,
      PCol: true,
      PImage: true,
    },
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

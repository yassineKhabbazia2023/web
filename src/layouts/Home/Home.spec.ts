import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import router from '@/plugins/router'
import Home from './'

const pinia = createTestingPinia()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
    },
  }),
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  routes: {
    value: [],
  },
  dataProvider: () => ({
    fetchUserData: vi.fn(),
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Home, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
    },
  })

describe('home', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('can display the user profile drawer', async () => {
    const getUserProfileDrawer = () => document.querySelector('.user-profile-drawer') as HTMLElement
    expect(getUserProfileDrawer()).toBeFalsy()

    const userAvatar = wrapper.find('.header-section__user-avatar')
    await userAvatar.trigger('click')

    expect(getUserProfileDrawer()).toBeTruthy()
  })
})

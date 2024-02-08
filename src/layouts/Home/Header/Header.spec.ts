import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { commonStore as store } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import helpers from '@/tests/utils/helpers'
import { PToolbox } from '@kpmg/styleguide'
import Header from './'

const { router, pinia, fetchUserData, fakeUser } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: null
    }),
    getters: {
      isAuthenticated: () => true
    },
    actions: {
      logout: () => vi.fn()
    }
  }),
  commonPinia: () => pinia,
  dataProvider: () => {
    return { fetchUserData }
  }
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Header, {
    attachTo: document.body,
    global: {
      plugins: [router, createTestingPinia()]
    }
  })

describe('header', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = createWrapper()
  })
  it('should display the header section correctly', () => {
    router.push({ name: 'wallet' })
    const header = wrapper.find('.header-section')
    const logo = wrapper.find('.header-section__logo')

    expect(header.exists()).toBeTruthy()
    expect(logo.exists()).toBeTruthy()
  })

  it('should disconnect user when clicking on the logout button', async () => {
    const spyRouterPush = vi.spyOn(router, 'push')
    await wrapper.find('.el-avatar').trigger('click')
    await nextTick()
    expect(document.body.innerHTML).contains('p-toolbox-item')

    const PToolboxWrapper = wrapper.findComponent(PToolbox)
    PToolboxWrapper.vm.$emit('p-toolbox-item-clicked', 'logout')
    await nextTick()
    expect(sessionStorage.getItem('token')).toBeNull()
    expect(spyRouterPush).toHaveBeenCalledWith({ name: 'login' })
  })

  it('should display initial user even the data in store is empty and token on sessionStorage is valid', () => {
    const myStore = store()

    expect(myStore.$patch).toHaveBeenCalledWith({
      user: {
        email: fakeUser?.email,
        firstName: fakeUser?.firstName,
        lastName: fakeUser?.lastName,
        isCollab: fakeUser?.isCollab,
        id: fakeUser?.id
      }
    })

    const initialContainer = wrapper.findComponent('[data-ut="user-initials"]')
    expect(initialContainer.text()).toBe('JD')
  })
})

import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { commonStore as store } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import helpers from '@/tests/utils/helpers'
import Header from './'

const { router, pinia, fetchUserData, fakeUser } = helpers()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
    },
    actions: {
      logout: () => vi.fn(),
    },
  }),
  commonPinia: () => pinia,
  dataProvider: () => {
    return { fetchUserData }
  },
}))

const createWrapper = (showCalendar: boolean): VueWrapper<any> =>
  mount(Header, {
    props: {
      showCalendar,
    },
    global: {
      plugins: [router, createTestingPinia()],
    },
  })

describe('header', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = createWrapper(false)
  })

  it('should display the header section correctly', () => {
    router.push({ name: 'wallet' })
    const header = wrapper.find('.header-section')
    const logo = wrapper.find('.header-section__logo')

    expect(header.exists()).toBeTruthy()
    expect(logo.exists()).toBeTruthy()
  })

  it('should display initial user even the data in store is empty and token on localStorage is valid', () => {
    const myStore = store()

    expect(myStore.$patch).toHaveBeenCalledWith({
      user: {
        email: fakeUser?.email,
        firstName: fakeUser?.firstName,
        lastName: fakeUser?.lastName,
        isCollab: fakeUser?.isCollab,
        id: fakeUser?.id,
      },
    })

    const initialContainer = wrapper.findComponent('[data-ut="user-initials"]')
    expect(initialContainer.text()).toBe('JD')
  })
})

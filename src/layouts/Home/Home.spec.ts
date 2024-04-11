import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import router from '@/plugins/router'
import Home from './'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'

const pinia = createTestingPinia()

const TEST_DATE = '2024-08-14'

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
  getSchedulesCollection: () => Promise.resolve([{
    date: TEST_DATE,
    deadlines: getMockedDeadlines(),
  }]),

  getAccountsCollection: () => Promise.resolve({
    status: 'fulfilled',
    value: accountsCollection,
  }),
}),
)

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
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub">' },
      },
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

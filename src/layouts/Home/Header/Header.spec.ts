import { debounceMock } from '@/schedule/tests/mocks/commonViMock'
import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { commonStore as store } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import helpers from '@/tests/utils/helpers'
import Header from './'
import { PICalendarEvent, PIArrowBarUp } from '@kpmg/styleguide'

const { router, pinia, fetchUserData, fakeUser } = helpers()

vi.mock('@kpmg/common', () => ({
  debounce: (callback: Function) => debounceMock(callback),
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

  it('should display the calendar and the action buttons correctly', async () => {
    const calendarBtn = wrapper.find('[data-testid="header-section-calendar-btn"]')

    expect(calendarBtn.classes()).toContain('p-button--generic')
    expect(calendarBtn.findComponent(PICalendarEvent).exists()).toBeTruthy()

    await calendarBtn.trigger('click')

    expect(wrapper.emitted('update:showCalendar')).toBeTruthy()
  })

  it('should display buttons when calendar is open correctly', () => {
    wrapper = createWrapper(true)

    const calendarBtn = wrapper.find('[data-testid="header-section-calendar-btn"]')

    expect(calendarBtn.classes()).toContain('p-button--white')
    expect(calendarBtn.classes()).toContain('p-button--is-active')
    expect(calendarBtn.findComponent(PIArrowBarUp)).toBeTruthy()
  })
})

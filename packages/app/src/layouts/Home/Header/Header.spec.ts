import { debounceMock } from '@app/schedule/tests/mocks/commonViMock'
import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import helpers from '@app/tests/utils/helpers'
import Header from './'
import type { HeaderProps } from './HeaderTypes'
const { router, pinia, fetchUserData } = helpers()

vi.mock('@pulse/common', () => ({
  debounce: (callback: Function) => debounceMock(callback),
  getInitials: vi.fn(() => 'JD'),
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

const createWrapper = (
  showCalendar: HeaderProps['showCalendar'],
  showFeedCenter: HeaderProps['showFeedCenter'] = false,
  unreadNotificationsCount: HeaderProps['unreadNotificationsCount'] = 0,
): VueWrapper<any> =>
  mount(Header, {
    props: {
      showCalendar,
      showFeedCenter,
      unreadNotificationsCount,
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
    const initialContainer = wrapper.findComponent('[data-ut="user-initials"]')

    expect(initialContainer.text()).toBe('JD')
  })

  it('should display the calendar and the action buttons correctly', async () => {
    const calendarBtn = wrapper.find('[data-testid="header-section-calendar-btn"]')

    expect(calendarBtn.classes()).toContain('p-button--generic')
    const icon = wrapper.findComponent({ name: 'PIcon' })
    expect(icon.props('pName')).toBe('calendarEvent')

    await calendarBtn.trigger('click')

    expect(wrapper.emitted('update:showCalendar')).toBeTruthy()
  })

  it('should display buttons when calendar is open correctly', () => {
    wrapper = createWrapper(true)

    const calendarBtn = wrapper.find('[data-testid="header-section-calendar-btn"]')

    expect(calendarBtn.classes()).toContain('p-button--white')
    expect(calendarBtn.classes()).toContain('p-button--is-active')
    expect(calendarBtn.findComponent({ name: 'PIArrowBarUp' })).toBeTruthy()
  })

  it('should display accordingly to opened state', async () => {
    const feedCenterButton = wrapper.find('[data-testid="feed-center-button"]')

    expect(feedCenterButton.classes()).toContain('p-button--generic')
    const icon = feedCenterButton.findComponent({ name: 'PIcon' })
    expect(icon.props('pName')).toBe('bell')

    await feedCenterButton.trigger('click')

    expect(wrapper.emitted('update:showFeedCenter')).toBeTruthy()
  })

  it('should display the appropriate button when feed center is opened', () => {
    wrapper = createWrapper(false, true)

    const feedCenterButton = wrapper.find('[data-testid="feed-center-button"]')

    expect(feedCenterButton.classes()).toContain('p-button--white')
    expect(feedCenterButton.classes()).toContain('p-button--is-active')
    const icon = feedCenterButton.findComponent({ name: 'PIcon' })
    expect(icon.props('pName')).toBe('x')
  })

  it.each([
    {
      notificationsCount: 0,
      shouldShowNotificationsCount: false,
    },
    {
      notificationsCount: 1,
      shouldShowNotificationsCount: true,
    },
    {
      notificationsCount: 100,
      shouldShowNotificationsCount: true,
    },
  ])('should show notification count when there are notifications', (
    {
      notificationsCount,
      shouldShowNotificationsCount,
    },
  ) => {
    const wrapper = createWrapper(false, false, notificationsCount)
    const notificationWrapper = wrapper.findComponent({ name: 'PPastille' })
    expect(notificationWrapper.exists()).toBe(shouldShowNotificationsCount)
  })
})

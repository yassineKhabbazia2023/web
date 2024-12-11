import { envVarsValues } from '@app/../vitest.setup'
import {
  ScheduleServicesMock,
  KpmgCommontMock,
} from '@app/schedule/tests/mocks/commonViMock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { commonStore as store } from '@pulse/common'
import { createTestingPinia } from '@pinia/testing'
import router from '@app/plugins/router'
import helpers from '@app/tests/utils/helpers'
import { nextTick } from 'vue'
import * as entitiesServices from '@app/services/entities'
import mockedEntities from '@app/mocks/entities.mock.json'
import { getMockedFavoriteEntities } from './Sidebar/components/SidebarEntity/MockedFavoriteEntities'
import Home from '.'

const pinia = createTestingPinia()
const { fakeUser } = helpers()
const mockedEntity = getMockedFavoriteEntities()[0]

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@app/schedule/services', () => ScheduleServicesMock)
vi.mock('@pulse/common', () => KpmgCommontMock)
vi.mock('@app/services/entities', async () => {
  const actual = await vi.importActual('@app/services/entities') as Record<string, any>
  return {
    ...actual,
    fetchEntities: vi.fn(() => Promise.resolve({
      items: mockedEntities,
    })),
  }
})

const mock = vi.hoisted(() => {
  return {
    salesforceChat: vi.fn(),
    isChatDisplayed: {
      value: false,
    },
  }
})

vi.mock('@app/plugins/SalesForce/useSalesforceService', () => ({
  useSalesforceService: () => {
    return {
      salesforceChat: mock.salesforceChat,
      isChatDisplayed: mock.isChatDisplayed,
    }
  },
}))

const feedCenterActivatedFlag = vi.hoisted(() => ({
  value: 'true',
}))

vi.mock('env-vars', () => ({
  ...envVarsValues,
  VITE_FEED_CENTER_ACTIVATED: feedCenterActivatedFlag.value,
  VITE_SALESFORCE_ACTIVATED: 'true',
  VITE_HUBSPOT_ACTIVATED: 'false',
}))

import.meta.env.PROD = true

window.embedded_svc = {
  addEventHandler: vi.fn(),
  settings: vi.fn(),
  init: vi.fn(),
} as any

const createWrapper = (): VueWrapper<any> =>
  mount(Home, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub" />' },
        MyInformation: { template: '<div />' },
        PAside: true,
        PDrawer: true,
      },
    },
  })

function getHomeScheduleDrawer(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'HomeScheduleDrawer' })
}

function getHomeFeedCenterDrawer(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'FeedCenterDrawer' })
}

describe('home', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('should return salesforce init with values', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = {
      accountId: 2,
      accountNumber: '3669209950',
      legalName: 'Restaurant Le Grand Bleu',
      color: 'persian',
    }
    await nextTick()
    const chatDiv = wrapper.find('[data-testid=salesforce-chat-div]')

    await nextTick()
    expect(mock.salesforceChat).toHaveBeenCalledOnce()
    expect(mock.salesforceChat).toHaveBeenCalledWith(
      fakeUser.firstName,
      fakeUser.lastName,
      fakeUser.email,
      mockedEntity.legalName,
      mockedEntity.accountNumber,
      chatDiv.element,
    )
  })
  it('when productfruits_button_ext_widget_init event is triggered', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = {
      accountId: 2,
      accountNumber: '3669209950',
      legalName: 'Restaurant Le Grand Bleu',
      color: 'persian',
    }
    await nextTick()

    expect(wrapper.vm.isChatDisplayed.value).toBeFalsy()

    window.dispatchEvent(new Event('productfruits_button_ext_widget_init'))

    await flushPromises()
    await nextTick()

    expect(wrapper.vm.isChatDisplayed.value).toBeTruthy()
  })
  it('should call retrieve entites when created', async () => {
    await flushPromises()

    expect(entitiesServices.fetchEntities).toHaveBeenCalledOnce()
  })

  it('should log a logger.error message when the request fails', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'
    
    vi.spyOn(entitiesServices, 'fetchEntities').mockRejectedValue(
      expectedErrorMessage,
    )
    wrapper = createWrapper()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Unable to fetch current user information: ',
      expectedErrorMessage,
    )
  })

  it('can display the user profile drawer', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    const getUserProfileDrawer = () =>
      document.querySelector('.user-profile-drawer') as HTMLElement
    expect(getUserProfileDrawer()).toBeFalsy()

    const userAvatar = wrapper.find('.header-section__user-avatar')
    await userAvatar.trigger('click')
    expect(getUserProfileDrawer()).toBeTruthy()
  })

  it('should display the app after retrieving all current user data', async () => {
    wrapper.vm.isLoading = true
    await nextTick()
    let commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeFalsy()

    const myStore = store()

    expect(myStore.$patch).toHaveBeenCalledOnce()
    expect(myStore.$patch).toHaveBeenCalledWith({
      user: {
        id: fakeUser?.id,
        firstName: fakeUser?.firstName,
        lastName: fakeUser?.lastName,
        email: fakeUser?.email,
        isCollab: fakeUser?.isCollab,
        entities: {
          default: mockedEntities[0],
          favorites: [],
        },
      },
    })

    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true

    await nextTick()
    commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeTruthy()
  })

  it('should show calendar drawer when header emits show-user-profile-drawer', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true

    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: true,
    })
  })

  it('should still show calendar drawer when header emits show-user-profile-drawer and close it after', async () => {
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)
    await header.vm.$emit('update:show-calendar', false)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: false,
    })
  })

  it('should still show feed center drawer when header emits show-user-profile-drawer and close it after', async () => {
    feedCenterActivatedFlag.value = 'true'
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = true
    await nextTick()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-feed-center', true)
    await header.vm.$emit('update:show-feed-center', false)

    const feedCenterDrawer = getHomeFeedCenterDrawer(wrapper)

    expect(feedCenterDrawer.exists()).toBeTruthy()
    expect(feedCenterDrawer.props()).toMatchObject({
      modelValue: false,
    })
  })

  it.each([
    {
      flagValue: 'true',
      shouldExist: true,
    },
  ])('should show feedcenter depending of feature flag', async ({ flagValue, shouldExist }) => {
    feedCenterActivatedFlag.value = flagValue
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    const feedCenterWrapper = wrapper.findComponent({ name: 'FeedCenterDrawer' })

    expect(feedCenterWrapper.exists()).toBe(shouldExist)
  })
})

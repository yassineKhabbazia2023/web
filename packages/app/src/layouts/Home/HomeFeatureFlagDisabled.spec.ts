import { envVarsValues, fetchUnreadNotificationsCountMock } from '@app/../vitest.setup'
import {
  ScheduleServicesMock,
  commonMock,
} from '@app/schedule/tests/mocks/commonViMock'
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import mockedEntities from '@app/mocks/entities.mock.json'
import Home from '.'
import helpers from '@app/tests/utils/helpers'

const pinia = createTestingPinia()

const { router } = helpers()

vi.mock('@pulse/core')
vi.mock('@app/schedule/services', () => ScheduleServicesMock)
vi.mock('@app/services/entities', async () => {
  const actual = await vi.importActual('@app/services/entities') as Record<string, any>
  return {
    ...actual,
    fetchEntities: vi.fn(() => Promise.resolve({
      items: mockedEntities,
    })),
  }
})
vi.mock('@pulse/common', () => commonMock)


vi.mock('@pulse/core', async () => {
  const actual = await vi.importActual('@pulse/core')
  return {
    ...actual,
    FeatureFlagManager: {
      isScheduleActivated: () => false,
    },
  }
})

const feedCenterActivatedFlag = vi.hoisted(() => ({
  value: 'false',
}))

vi.mock('env-vars', () => ({
  ...envVarsValues,
  VITE_FEED_CENTER_ACTIVATED: feedCenterActivatedFlag.value,
}))

import.meta.env.PROD = true

window.embedded_svc = {
  addEventHandler: vi.fn(),
  settings: vi.fn(),
  init: vi.fn(),
} as any

window.HubSpotConversations = {
  widget: {
    load: vi.fn(),
    open: vi.fn(),
  },
} as any

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Home, {
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

describe('home', () => {
  it('should not call any feedcenter API if feature is disabled', async () => {
    createWrapper()
    await flushPromises()
    await nextTick()

    expect(fetchUnreadNotificationsCountMock).not.toHaveBeenCalled()
  })
  it('should open hubspot when productfruits_button_ext_widget_init event is triggered', async () => {
    const wrapper: VueWrapper<any> = createWrapper()
    wrapper.vm.isLoading = false
    wrapper.vm.defaultEntity = {
      accountId: 2,
      accountNumber: '3669209950',
      legalName: 'Restaurant Le Grand Bleu',
      color: 'persian',
    }
    await nextTick()
    window.dispatchEvent(new Event('productfruits_button_ext_widget_init'))
    await flushPromises()
    await nextTick()
    expect(window.HubSpotConversations.widget.load).toHaveBeenCalledOnce()
    expect(window.HubSpotConversations.widget.open).toHaveBeenCalledOnce()
  })
  it('should not have ScheduleDrawer if feature is disabled', async () => {
    const wrapper = createWrapper()
    const HomeScheduleDrawer = wrapper.findComponent({ name: 'HomeScheduleDrawer' })

    expect(HomeScheduleDrawer.exists()).toBeFalsy()
  })
})

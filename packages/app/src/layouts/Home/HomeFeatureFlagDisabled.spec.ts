import { envVarsValues, fetchUnreadNotificationsCountMock } from '@app/../vitest.setup'
import {
  ScheduleServicesMock,
  KpmgCommontMock,
} from '@app/schedule/tests/mocks/commonViMock'
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import router from '@app/plugins/router'
import { nextTick } from 'vue'
import mockedEntities from '@app/mocks/entities.mock.json'
import Home from '.'
const pinia = createTestingPinia()

const mock = vi.hoisted(() => {
  return {
    salesforceChat: vi.fn(),
    isChatDisplayed: {
      value: false,
    },
  }
})

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
vi.mock('@pulse/common', () => KpmgCommontMock)

const feedCenterActivatedFlag = vi.hoisted(() => ({
  value: 'false',
}))

vi.mock('@app/plugins/SalesForce/useSalesforceService', () => ({
  useSalesforceService: () => {
    return {
      salesforceChat: mock.salesforceChat,
      isChatDisplayed: mock.isChatDisplayed,
    }
  },
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

describe('home', () => {
  it('should not call any feedcenter API if feature is disabled', async () => {
    createWrapper()
    await flushPromises()
    await nextTick()

    expect(fetchUnreadNotificationsCountMock).not.toHaveBeenCalled()
  })
})

import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import {
  envVarsMock,
  featureFlagManagerMock,
  isFeedCenterActivatedMock,
  isScheduleActivatedMock,
  loggerMock,
} from '@pulse/core/mocks'
import { entitiesServiceMock } from '@app/__mocks__/entities.service.mocks'
import { scheduleServicesMock } from '@app/__mocks__/schedule.service.mocks'
import { fetchUnreadNotificationsCountMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { routerMock } from '@app/__mocks__/router.mocks'
import { CurrentUserManagerMock, getMockedUserInfo } from '@pulse/common/mocks'
import { nextTick } from 'vue'

import Home from '.'

const userMock = getMockedUserInfo()
const dataProviderMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  dataProvider: dataProviderMock,
}))

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)

declare let window: {
  embedded_svc: {
    addEventHandler: () => void
    settings: () => void
    init: () => void
  }
} & Window

vi.mock('@app/schedule/services', () => scheduleServicesMock)
vi.mock('@app/services/entities', () => entitiesServiceMock)
vi.mock('@app/plugins/ProductFruits/productFruits.plugin')
vi.mock('@app/plugins/Hubspot/hubspot.plugin')

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

vi.mock('env-vars', () => envVarsMock)

import.meta.env.PROD = true

window.embedded_svc = {
  addEventHandler: vi.fn(),
  settings: vi.fn(),
  init: vi.fn(),
}

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Home, {
    attachTo: document.body,
    global: {
      plugins: [routerMock],
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub" />' },
        MyInformation: { template: '<div />' },
        PContainer: { template: '<div><slot /></div>' },
        PCHeader: { template: '<div><slot /></div>' },
        PAside: true,
        PDrawer: true,
        Header: true,
        HomeScheduleDrawer: true,
        FeedCenterDrawer: true,
      },
    },
  })

describe('home', () => {
  beforeEach(() => {
    dataProviderMock.mockReturnValue({
      fetchUserData: () => userMock,
    })
  })

  it('should not call any feedcenter API if feature is disabled', async () => {
    isFeedCenterActivatedMock.mockReturnValue(false)
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false
    await nextTick()

    expect(fetchUnreadNotificationsCountMock).not.toHaveBeenCalled()
  })

  it('should not have ScheduleDrawer if feature is disabled', async () => {
    isScheduleActivatedMock.mockReturnValue(false)
    const wrapper = createWrapper()
    wrapper.vm.isLoading = false
    wrapper.vm.calendarHasBeenOpened = true
    await nextTick()

    const HomeScheduleDrawer = wrapper.findComponent({ name: 'HomeScheduleDrawer' })

    expect(HomeScheduleDrawer.exists()).toBeFalsy()
  })
})

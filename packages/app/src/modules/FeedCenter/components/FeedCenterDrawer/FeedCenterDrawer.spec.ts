import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { FeatureFlagManager } from '@pulse/core'
import { fetchNotificationsMock, notificationsServiceMock } from '@app/__mocks__/notification.service.mocks'
import { trackingServiceMock, trackNotificationMarkAsReadMock } from '@app/__mocks__/tracking.service.mocks'
import { feedCenterDrawerManagerMock, patchAllNotificationsAsReadMock } from '@app/__mocks__/feed-center-drawer.manager.mocks'
import { NotificationTrackingReadType } from '@app/modules/FeedCenter/services/tracking/tracking.types'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks'
import { notificationsMock } from '@app/__mocks__/notifications.mocks'
import { FeedCenterActions } from '@app/modules/FeedCenter/feed-center.enum'


import FeedCenterDrawer from '.'

vi.mock('@app/modules/FeedCenter/services/notifications.service', () => notificationsServiceMock)
vi.mock('@app/modules/FeedCenter/services/tracking/tracking.service', () => trackingServiceMock)
vi.mock('./feed-center-drawer.manager', () => feedCenterDrawerManagerMock)

getStoreMock(useUserStore)

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => vi.fn(),
    },
  }),
}))

vi.mock('@pulse/core', () => ({
  FeatureFlagManager: {
    isNotificationSettingsDrawerActivated: vi.fn(),
  },
}))

function createWrapper(props: FeedCenterDrawerProps = FeedCenterDrawerBaseProps) {
  return shallowMount(FeedCenterDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot/> </div>',
          events: ['close-drawer-button'],
        },
        PTabs: {
          name: 'PTabs',
          template: '<div><slot /></div>',
        },
        PTabPane: {
          name: 'PTabPane',
          template: '<div><slot /><slot name="label" /></div>',
        },
        PPastille: {
          name: 'PPastille',
          template: '<div><slot /></div>',
        },
        NotificationsWrapper: {
          name: 'NotificationsWrapper',
          template: '<div />',
          events: ['notification-clicked'],
        },
      },
    },
  })
}

const FeedCenterDrawerBaseProps: FeedCenterDrawerProps = {
  modelValue: true,
  unreadNotificationsCount: 0,
}

const unreadNotificationsMock = notificationsMock.filter(n => n.isRead === false)

describe('feed center drawer', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedCenterDrawer>>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  function findFeedCenterDrawer(wrapper: VueWrapper) {
    return wrapper.findComponent({ name: 'PDrawer' })
  }

  describe('rendering', () => {
    it.each([
      {
        count: 10,
        expectedTextOutput: '10',
      },
      {
        count: 100,
        expectedTextOutput: '99+',
      },
    ])('displays the formatted unread notifications count', async ({ count, expectedTextOutput }) => {
      wrapper = createWrapper(
        {
          ...FeedCenterDrawerBaseProps,
          unreadNotificationsCount: count,
        })
      await flushPromises()
      const countWrapper = wrapper.findComponent({ name: 'PPastille' })
      expect(countWrapper.text()).toBe(expectedTextOutput)
    })
  })

  describe('interactions', () => {
    it('should close drawer on close-drawer-button', async () => {
      const expectedEmitModelValue = false
      const drawerWrapper = findFeedCenterDrawer(wrapper)
      await drawerWrapper.vm.$emit('close-drawer-button')
      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedEmitModelValue]])
    })

    it('should close drawer on "notification-clicked" event', async () => {
      const expectedEmitModelValue = false
      const notificationWrapper = wrapper.findComponent({ name: 'NotificationsWrapper' })
      notificationWrapper.vm.$emit('notification-clicked')

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[expectedEmitModelValue]])
    })

    it('should call patchAllNotificationAsRead when p-toolbox-item-clicked event is fired', async () => {
      const notificationDrawer = wrapper.findComponent({ name: 'PDrawer' })
      notificationDrawer.vm.$emit('p-toolbox-item-clicked', FeedCenterActions.MARK_ALL_AS_READ)
      expect(patchAllNotificationsAsReadMock).toHaveBeenCalledOnce()
    })

    it('should emit open-notification-settings-drawer when settings option is clicked', async () => {
      vi.mocked(FeatureFlagManager.isNotificationSettingsDrawerActivated).mockReturnValue(true)
      wrapper = createWrapper()
      const notificationDrawer = findFeedCenterDrawer(wrapper)

      await notificationDrawer.vm.$emit('p-toolbox-item-clicked', FeedCenterActions.OPEN_SETTINGS_DRAWER)

      expect(wrapper.emitted('open-notification-settings-drawer')).toBeTruthy()
    })
  })

  describe('data streams', () => {
    it('should fetch notifications on component creation', async () => {
      await flushPromises()
      expect(fetchNotificationsMock).toHaveBeenCalledOnce()
    })

    it('should filters the unread notifications', async () => {
      await flushPromises()
      // Casting as any because type resolution can't know that unreadNotifications is exposed to the template
      expect((wrapper.vm as any).unreadNotifications).toMatchObject(unreadNotificationsMock)
    })
  })

  describe('tracking feedcenter', () => {
    it('should track NotificationMarkAsRead with type ALL_READ when p-toolbox-item-clicked event is fired', async () => {
      const notificationDrawer = findFeedCenterDrawer(wrapper)
      await notificationDrawer.vm.$emit('p-toolbox-item-clicked', FeedCenterActions.MARK_ALL_AS_READ)
      expect(trackNotificationMarkAsReadMock).toHaveBeenCalledWith(NotificationTrackingReadType.ALL_READ)
    })
  })
})

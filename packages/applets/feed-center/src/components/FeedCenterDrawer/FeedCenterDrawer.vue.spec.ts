import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { FeatureFlagManager } from '@pulse/common/managers'
import { fetchNotificationsMock, armNotificationsServiceDefaults } from '../../__mocks__/notification.service.mocks'
import { trackNotificationMarkAsReadMock } from '../../__mocks__/tracking.service.mocks'
import { armFeedCenterDrawerManagerDefaults, patchAllNotificationsAsReadMock } from '../../__mocks__/feed-center-drawer.manager.mocks'
import { NotificationTrackingReadType } from '../../services/tracking/tracking.types'
import type { FeedCenterDrawerProps } from './feed-center-drawer.types'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { FeedCenterActions } from '../../feed-center.enum'
import { useFeedCenterStore } from '../../stores/feed-center.store'
import FeedCenterDrawer from '.'

getStoreMock(useUserStore)
getStoreMock(useFeedCenterStore)

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

beforeEach(() => {
  armNotificationsServiceDefaults()
  armFeedCenterDrawerManagerDefaults()
  vi.spyOn(FeatureFlagManager, 'isNotificationSettingsDrawerActivated').mockReturnValue(false)
})

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
      vi.spyOn(FeatureFlagManager, 'isNotificationSettingsDrawerActivated').mockReturnValue(true)
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
  })

  describe('tracking feedcenter', () => {
    it('should track NotificationMarkAsRead with type ALL_READ when p-toolbox-item-clicked event is fired', async () => {
      const notificationDrawer = findFeedCenterDrawer(wrapper)
      await notificationDrawer.vm.$emit('p-toolbox-item-clicked', FeedCenterActions.MARK_ALL_AS_READ)
      expect(trackNotificationMarkAsReadMock).toHaveBeenCalledWith(NotificationTrackingReadType.ALL_READ)
    })
  })
})

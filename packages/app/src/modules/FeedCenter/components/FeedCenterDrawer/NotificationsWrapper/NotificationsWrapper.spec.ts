import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import NotificationsWrapper from '.'
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { NotificationsWrapperProps } from './notifications-wrapper.types'
import { notificationsMock } from '@app/mocks/FeedCenter/notifications.mock'
import { handleNotificationAction } from './notifications-wrapper.manager'

function createWrapper(props: NotificationsWrapperProps = NoNotificationsPlaceholderBaseProps) {
  return mount(NotificationsWrapper, {
    props,
    shallow: true,
  })
}

const mockRouter = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    router: mockRouter,
  }),
}))

vi.mock('./notifications-wrapper.manager', async () => {
  const actual = await vi.importActual('./notifications-wrapper.manager')
  return {
    ...(actual as object),
    getNotificationAccountNames: vi.fn(() => []),
    getTimeSinceCreation: vi.fn(() => ''),
    handleNotificationAction: vi.fn(),
  }
})

const NoNotificationsPlaceholderBaseProps: NotificationsWrapperProps = {
  isLoading: false,
  wrapperType: SelectedNotificationEnum.ALL,
  notifications: notificationsMock,
}

function findNoNotificationsWrapper(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'NoNotificationsPlaceholder' })
}

function findFirstNotifications(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'Notification' })
}

describe('notifications wrapper', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotificationsWrapper>>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it('does NOT render a notification list if there is no notification', () => {
      wrapper = createWrapper({ ...NoNotificationsPlaceholderBaseProps, notifications: [] })
      const noNotificationsWrapper = findNoNotificationsWrapper(wrapper)
      const notification = findFirstNotifications(wrapper)

      expect(noNotificationsWrapper.exists()).toBeTruthy()
      expect(notification.exists()).toBeFalsy()
    })

    it('renders a notifications list when there are notifications', () => {
      const noNotificationsWrapper = findNoNotificationsWrapper(wrapper)
      const notification = findFirstNotifications(wrapper)

      expect(noNotificationsWrapper.exists()).toBeFalsy()
      expect(notification.exists()).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('triggers handleNotificationAction and emits "notification-clicked" on notification click', async () => {
      const notification = findFirstNotifications(wrapper)
      await notification.trigger('click')
      expect(handleNotificationAction).toHaveBeenCalledOnce()
      expect(wrapper.emitted('notification-clicked')).toHaveLength(1)
    })
  })
})

/* eslint-disable import/extensions */
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import FeedCenterDrawer from '.'
import type { FeedCenterDrawerProps } from './FeedCenterDrawerTypes'
import { fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import { notificationsMock } from '@app/mocks/FeedCenter/notifications.mock'

function createWrapper(props: FeedCenterDrawerProps = FeedCenterDrawerBaseProps) {
  return mount(FeedCenterDrawer, {
    props,
  })
}

const FeedCenterDrawerBaseProps: FeedCenterDrawerProps = {
  modelValue: true,
  unreadNotificationsCount: 0,
}

const unreadNotificationsMock = notificationsMock.filter(n => n.isRead === false)

vi.mock('@router/modules/FeedCenter/services/notifications.service', () => ({
  fetchNotifications: vi.fn(() => Promise.resolve({ notifications: notificationsMock })),
}))

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
    ])('displays the formatted unread notifiactions count', async ({ count, expectedTextOutput }) => {
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
      const drawerWrapper = findFeedCenterDrawer(wrapper)
      await drawerWrapper.vm.$emit('close-drawer-button')
      expect(drawerWrapper.isVisible()).toBeFalsy()
    })
  })

  describe('data streams', () => {
    it('should fetch notifications on component creation', async () => {
      await flushPromises()
      expect(fetchNotifications).toHaveBeenCalledOnce()
    })

    it('should filters the unread notifications', async () => {
      await flushPromises()
      // Casting as any because type resolution can't know that unreadNotifications is exposed to the template
      expect((wrapper.vm as any).unreadNotifications).toMatchObject(unreadNotificationsMock)
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { defineStore } from 'pinia'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { fetchNotificationsMock } from '@app/../vitest.setup'
import FeedCenterDrawer from '.'
import type { FeedCenterDrawerProps } from './FeedCenterDrawerTypes'
import { notificationsMock } from '@app/mocks/FeedCenter/notifications.mock'
import { createTestingPinia } from '@pinia/testing'
import { patchAllNotificationsAsRead } from './feed-center.manager'
const pinia = createTestingPinia()
vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: 13,
      },
    }),
  }) }))

vi.mock('./feed-center.manager', async () => {
  return {
    patchAllNotificationsAsRead: vi.fn(() => notificationsMock),
    fetchNotificationsWithTimeout: vi.fn(),
  }
})

function createWrapper(props: FeedCenterDrawerProps = FeedCenterDrawerBaseProps) {
  return shallowMount(FeedCenterDrawer, {
    props,
    global: {
      plugins: [pinia],
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
      notificationDrawer.vm.$emit('p-toolbox-item-clicked')
      expect(patchAllNotificationsAsRead).toHaveBeenCalledOnce()
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
})

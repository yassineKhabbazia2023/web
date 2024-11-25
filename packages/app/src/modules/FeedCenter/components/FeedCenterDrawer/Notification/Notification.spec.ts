import { vi, describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Notifications from '.'
import type { NotificationProps } from './NotificationTypes'
import { accountsMock } from '@app/mocks/Account/accounts.mock'
import { notificationsMock } from '@app/mocks/FeedCenter/notifications.mock'

vi.mock('@pulse/common', async () => {
  const actual = await vi.importActual('@pulse/common')
  return actual
})

const notificationMock = notificationsMock[0]
const FeedCenterDrawerBaseProps: NotificationProps = {
  accountsNames: [accountsMock[0].name],
  elapsedTime: '1j',
  id: notificationMock.id,
  isRead: notificationMock.isRead,
  message: notificationMock.message,
  notificationType: notificationMock.notificationType,
}

function createWrapper() {
  return mount(Notifications, {
    props: FeedCenterDrawerBaseProps,
  })
}

describe('notification', () => {
  let wrapper: VueWrapper
  beforeEach(() => {
    wrapper = createWrapper()
  })
  describe('rendering', () => {
    it('renders', () => {
      const notificationWrapper = wrapper.find('.notification')
      expect(notificationWrapper.exists()).toBeTruthy()
    })
  })
})

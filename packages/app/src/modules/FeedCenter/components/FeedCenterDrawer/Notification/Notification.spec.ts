import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { NotificationProps } from './notification.types'
import { accountsMock } from '@app/__mocks__/accounts.mocks'
import { notificationsMock } from '@app/__mocks__/notifications.mocks'

import Notifications from '.'

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

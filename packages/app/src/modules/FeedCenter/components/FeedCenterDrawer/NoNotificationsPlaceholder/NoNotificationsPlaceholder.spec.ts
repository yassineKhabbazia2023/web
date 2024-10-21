/* eslint-disable import/extensions */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
// eslint-disable-next-line import/extensions
import { SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import NoNotificationsPlaceholder from '.'
import type { NoNotificationsPlaceholderProps } from './NoNotificationsPlaceholderTypes'

function createWrapper(props: NoNotificationsPlaceholderProps = NoNotificationsPlaceholderBaseProps) {
  return mount(NoNotificationsPlaceholder, {
    props,
  })
}

const NoNotificationsPlaceholderBaseProps: NoNotificationsPlaceholderProps = {
  placeholderType: SelectedNotificationEnum.ALL,
}

describe('no notifications placeholder', () => {
  let wrapper: VueWrapper<InstanceType<typeof NoNotificationsPlaceholder>>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it.each([
      {
        placeholderType: SelectedNotificationEnum.ALL,
        expectedText: '',
      },
      {
        placeholderType: SelectedNotificationEnum.UNREAD,
        expectedText: '',
      },
    ])('renders the appropriate wording based on placeholder type', ({ placeholderType, expectedText }) => {
      wrapper = createWrapper(
        {
          ...NoNotificationsPlaceholderBaseProps,
          placeholderType,
        })
      const wordingWrapper = wrapper.find('p[data-testid="no-notification-additional-information"]')
      expect(wordingWrapper.text()).toContain(expectedText)
    })
  })
})

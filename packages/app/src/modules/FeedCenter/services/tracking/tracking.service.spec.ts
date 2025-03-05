import { describe } from 'vitest'
import { NotificationKindEnum, SelectedNotificationEnum } from '../../types/notification.type'
import { NotificationTrackingType,NotificationTrackingReadType, NotificationTrackingTab } from './tracking.types'

import {
  trackFeedcenterOpened,
  trackFeedCenterTabConsultation,
  trackNotificationMarkAsRead,
  trackNotificationsConsulted,
} from './tracking.service'

const amplitudeTrackMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeTrackMock,
  },
}))

describe('feedcenter opened tracking', () => {
  it('tracks if feedcenter is opened', () => {
    trackFeedcenterOpened()

    expect(amplitudeTrackMock).toHaveBeenCalledWith(
      'Feedcenter opened',
    )
  })
})

describe('feedcenter notification consultation tracking', () => {
  it.each([
    {
      notificationKind: NotificationKindEnum.GED,
      expectedTrackingValue: NotificationTrackingType.GED ,
    },
    {
      notificationKind: NotificationKindEnum.Mandate,
      expectedTrackingValue: NotificationTrackingType.MANDATE ,
    },
    {
      notificationKind: NotificationKindEnum.Delegation,
      expectedTrackingValue: NotificationTrackingType.DELEGATION ,
    },
  ])('tracks notification consulted $notificationKind with tracking value $expectedTrackingValue', ({ notificationKind, expectedTrackingValue }) => {
    trackNotificationsConsulted(notificationKind)
    expect(amplitudeTrackMock).toHaveBeenCalledWith('Feedcenter notifications consulted', {
      notification_type_consultation: expectedTrackingValue,
    })
  })
})

describe('feedcenter notifications marked as read', () => {
  it('tracks single notification mark as read', () => {
    trackNotificationMarkAsRead(NotificationTrackingReadType.SINGLE_READ)
    expect(amplitudeTrackMock).toHaveBeenCalledWith(
      'Feedcenter notifications marked as read', {
        Marked_as_read_origin: NotificationTrackingReadType.SINGLE_READ,
      },
    )
  })
  it('tracks all notifications mark as read', () => {
    trackNotificationMarkAsRead(NotificationTrackingReadType.ALL_READ)
    expect(amplitudeTrackMock).toHaveBeenCalledWith(
      'Feedcenter notifications marked as read', {
        Marked_as_read_origin: NotificationTrackingReadType.ALL_READ,
      },
    )
  })
})

describe('feedcenter tabs selection', () => {
  it.each([
    {
      selectedTab: SelectedNotificationEnum.ALL,
      expectedTrackingValue: NotificationTrackingTab.ALL ,
    },
    {
      selectedTab: SelectedNotificationEnum.UNREAD,
      expectedTrackingValue: NotificationTrackingTab.UNREAD ,
    },
  ])('tracks $selectedTab tab consultation', ({ selectedTab, expectedTrackingValue }) => {
    trackFeedCenterTabConsultation(selectedTab)
    expect(amplitudeTrackMock).toHaveBeenCalledWith(
      'Feedcenter tabs selected', {
        feedcenter_tabs_consultation: expectedTrackingValue,
      },
    )
  })
})
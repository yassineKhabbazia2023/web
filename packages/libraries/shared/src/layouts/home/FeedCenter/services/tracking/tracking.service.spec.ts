import { describe } from 'vitest'
import { SelectedNotificationEnum } from '../../types/notification.type'
import { NotificationKindEnum } from '@pulse/common/enums'
import { NotificationTrackingType, NotificationTrackingReadType, NotificationTrackingTab } from './tracking.types'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'

import {
  trackFeedcenterOpened,
  trackFeedCenterTabConsultation,
  trackNotificationMarkAsRead,
  trackNotificationsConsulted,
} from './tracking.service'

vi.mock('@pulse/common/services/amplitude')

describe('feedcenter opened tracking', () => {
  it('tracks if feedcenter is opened', () => {
    trackFeedcenterOpened()

    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(
      'Feedcenter opened',
    )
  })
})

describe('feedcenter notification consultation tracking', () => {
  it.each([
    {
      notificationKind: NotificationKindEnum.AccountingDocumentUploaded,
      expectedTrackingValue: NotificationTrackingType.AccountingDocumentUploaded,
    },
    {
      notificationKind: NotificationKindEnum.GSDocumentUploaded,
      expectedTrackingValue: NotificationTrackingType.GSDocumentUploaded,
    },
    {
      notificationKind: NotificationKindEnum.Mandate,
      expectedTrackingValue: NotificationTrackingType.MANDATE,
    },
    {
      notificationKind: NotificationKindEnum.Delegation,
      expectedTrackingValue: NotificationTrackingType.DELEGATION,
    },
  ])('tracks notification consulted $notificationKind with tracking value $expectedTrackingValue', ({ notificationKind, expectedTrackingValue }) => {
    trackNotificationsConsulted(notificationKind)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Feedcenter notifications consulted', {
      notification_type_consultation: expectedTrackingValue,
    })
  })
})

describe('feedcenter notifications marked as read', () => {
  it('tracks single notification mark as read', () => {
    trackNotificationMarkAsRead(NotificationTrackingReadType.SINGLE_READ)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(
      'Feedcenter notifications marked as read', {
        Marked_as_read_origin: NotificationTrackingReadType.SINGLE_READ,
      },
    )
  })
  it('tracks all notifications mark as read', () => {
    trackNotificationMarkAsRead(NotificationTrackingReadType.ALL_READ)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(
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
      expectedTrackingValue: NotificationTrackingTab.ALL,
    },
    {
      selectedTab: SelectedNotificationEnum.UNREAD,
      expectedTrackingValue: NotificationTrackingTab.UNREAD,
    },
  ])('tracks $selectedTab tab consultation', ({ selectedTab, expectedTrackingValue }) => {
    trackFeedCenterTabConsultation(selectedTab)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(
      'Feedcenter tabs selected', {
        feedcenter_tabs_consultation: expectedTrackingValue,
      },
    )
  })
})

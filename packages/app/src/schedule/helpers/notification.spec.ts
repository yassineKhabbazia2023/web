import type { MockInstance } from 'vitest'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import { showNotification } from './notification'
import type { NotificationType } from './notificationTypes'
import * as styleguide from '@pulse/styleguide'

vi.mock('@pulse/styleguide', () => {
  return {
    PICheck: 'PICheck',
    PIExclamationTriangle: 'PIExclamationTriangle',
    PIDownload: 'PIDownload',
    PNotification: vi.fn(),
  }
})

describe('test NotificationHelper', () => {
  const messagesByType: Record<NotificationType, string> = {
    downloading: 'is downloading',
    success: 'is success',
    error: 'is error',
  }
  let PNotificationMocked: MockInstance
  const closeNotifiationSpy = vi.fn()
  beforeEach(() => {
    PNotificationMocked = vi.spyOn(styleguide, 'PNotification')
  })

  const tests: {
    type: NotificationType
    duration: number | undefined
    icon: string
  }[] = [{
    type: 'downloading',
    duration: 0,
    icon: 'PIDownload',
  }, {
    type: 'success',
    duration: undefined,
    icon: 'PICheck',
  }, {
    type: 'error',
    duration: undefined,
    icon: 'PIExclamationTriangle',
  }]

  it.each(tests)('should call PNotification with proper params when type is $type', ({
    type,
    duration,
    icon,
  }) => {
    showNotification(messagesByType, type)
    const expectedParams = {
      message: messagesByType[type],
      duration,
      customClass: type,
      icon,
      position: 'bottom-right',
      showClose: true,
    }

    expect(PNotificationMocked).toHaveBeenCalledOnce()
    expect(PNotificationMocked).toHaveBeenNthCalledWith(1, expectedParams)
  })

  it('should close first notification on second call', () => {
    const type = 'downloading'
    PNotificationMocked.mockImplementation(() => ({
      close: closeNotifiationSpy,
    }))
    const firstNotification = showNotification(messagesByType, type)
    showNotification(messagesByType, type, firstNotification)

    expect(PNotificationMocked).toHaveBeenCalledTimes(2)
    expect(closeNotifiationSpy).toHaveBeenCalledOnce()
  })
})

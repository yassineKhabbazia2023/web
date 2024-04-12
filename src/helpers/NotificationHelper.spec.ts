import type { SpyInstance } from 'vitest'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import { showNotification } from './NotificationHelper'
import type { NotificationMessagesByType } from './NotificationHelperTypes'
import * as styleguide from '@kpmg/styleguide'

vi.mock('@kpmg/styleguide', () => {
  return {
    PICheck: 'PICheck',
    PIExclamationTriangle: 'PIExclamationTriangle',
    PILoader: 'PILoader',
    PNotification: vi.fn(),
  }
})

describe('test NotificationHelper', () => {
  const messagesByType: NotificationMessagesByType = {
    loading: 'is loading',
    success: 'is success',
    error: 'is error',
  }
  let PNotificationMocked: SpyInstance
  const closeNotifiationSpy = vi.fn()
  beforeEach(() => {
    PNotificationMocked = vi.spyOn(styleguide, 'PNotification')
  })

  const tests: {
    type: 'loading' | 'success' | 'error'
    duration: number | undefined
    icon: string
  }[] = [{
    type: 'loading',
    duration: 0,
    icon: 'PILoader',
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
    const type = 'loading'
    PNotificationMocked.mockImplementation(() => ({
      close: closeNotifiationSpy,
    }))
    const firstNotification = showNotification(messagesByType, type)
    showNotification(messagesByType, type, firstNotification)

    expect(PNotificationMocked).toHaveBeenCalledTimes(2)
    expect(closeNotifiationSpy).toHaveBeenCalledOnce()
  })
})

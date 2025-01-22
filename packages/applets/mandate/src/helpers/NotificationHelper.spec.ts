import { expect, describe, it, vi } from 'vitest'
import { showNotification } from './NotificationHelper'
import type { NotificationMessagesByType } from './NotificationHelperTypes'
import { type IconName } from '@pulse/styleguide/types'

const PNotificationMocked = vi.hoisted(() => vi.fn())

vi.mock('@pulse/styleguide', () => ({
  PNotification: PNotificationMocked,
}))

describe('test NotificationHelper', () => {
  const messagesByType: NotificationMessagesByType = {
    loading: 'is loading',
    success: 'is success',
    error: 'is error',
  }
  const closeNotifiationSpy = vi.fn()

  const tests: {
    type: 'loading' | 'success' | 'error'
    autoClose: boolean
    duration: number | undefined
    iconName: IconName
  }[] = [{
    type: 'loading',
    autoClose: false,
    duration: 0,
    iconName: 'loader',
  }, {
    type: 'success',
    autoClose: true,
    duration: undefined,
    iconName: 'check',
  }, {
    type: 'error',
    autoClose: true,
    duration: undefined,
    iconName: 'exclamationTriangle',
  }]

  it.each(tests)('should call PNotification with proper params when type is $type', ({
    type,
    autoClose,
    duration,
    iconName,
  }) => {
    showNotification(messagesByType, type, autoClose)
    const expectedParams = {
      message: messagesByType[type],
      duration,
      customClass: type,
      iconName,
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
    const firstNotification = showNotification(messagesByType, type, true)
    const expectedParams1 = {
      customClass: 'loading',
      duration: undefined,
      iconName: 'loader',
      message: 'is loading',
      position: 'bottom-right',
      showClose: true,
    }
    const expectedParams2 = {
      customClass: 'loading',
      duration: 0,
      iconName: 'loader',
      message: 'is loading',
      position: 'bottom-right',
      showClose: true,
    }
    showNotification(messagesByType, type, false, firstNotification)

    expect(PNotificationMocked).toHaveBeenCalledTimes(2)
    expect(PNotificationMocked).toHaveBeenNthCalledWith(1, expectedParams1)
    expect(PNotificationMocked).toHaveBeenNthCalledWith(2, expectedParams2)
    expect(closeNotifiationSpy).toHaveBeenCalledOnce()
  })
})

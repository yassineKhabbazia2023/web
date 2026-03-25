import { expect, describe, it, vi } from 'vitest'
import { PNotificationMocked } from '@mandate/__mocks__/styleguide.mocks'
import type { NotificationMessagesByType } from './NotificationHelperTypes'
import { type IconName } from '@pulse/styleguide/types'
import { showNotification } from './NotificationHelper'


vi.mock('@pulse/styleguide', () => ({
  PNotification: PNotificationMocked,
}))

describe('test NotificationHelper', () => {
  const messagesByType: NotificationMessagesByType = {
    loading: 'is loading',
    success: 'is success',
    error: 'is error',
  }
  const closeNotificationSpy = vi.fn()

  const tests: {
    type: 'loading' | 'success' | 'error'
    autoClose: boolean
    duration: number | undefined
    iconName: IconName
  }[] = [{
    type: 'loading',
    autoClose: false,
    duration: 0,
    iconName: 'loaderGradient',
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
      close: closeNotificationSpy,
    }))
    const firstNotification = showNotification(messagesByType, type, true)
    const expectedParams1 = {
      customClass: 'loading',
      duration: undefined,
      iconName: 'loaderGradient',
      message: 'is loading',
      position: 'bottom-right',
      showClose: true,
    }
    const expectedParams2 = {
      customClass: 'loading',
      duration: 0,
      iconName: 'loaderGradient',
      message: 'is loading',
      position: 'bottom-right',
      showClose: true,
    }
    showNotification(messagesByType, type, false, firstNotification)

    expect(PNotificationMocked).toHaveBeenCalledTimes(2)
    expect(PNotificationMocked).toHaveBeenNthCalledWith(1, expectedParams1)
    expect(PNotificationMocked).toHaveBeenNthCalledWith(2, expectedParams2)
    expect(closeNotificationSpy).toHaveBeenCalledOnce()
  })
})

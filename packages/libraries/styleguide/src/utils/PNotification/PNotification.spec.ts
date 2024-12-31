import { vi, describe, it, expect } from 'vitest'
import { PNotification } from './PNotification'

const iconResolverMock = vi.hoisted(() => vi.fn())
vi.mock('../../utils/iconResolver', () => ({
  iconResolver: iconResolverMock,
}))

const ElNotificationMock = vi.hoisted(() => vi.fn())
vi.mock('element-plus', () => ({
  ElNotification: ElNotificationMock,
}))

describe('test PNotification', () => {
  it('call ElNotification with proper arguments', () => {
    const mockedIconComponent = 'PICheck'
    const mockedNotification = 'mocked notification'
    const title = 'Titre'
    const expectedParams = {
      title,
      icon: mockedIconComponent,
    }

    iconResolverMock.mockReturnValue(mockedIconComponent)
    ElNotificationMock.mockReturnValue(mockedNotification)

    const notification = PNotification({
      title,
      iconName: 'check',
    })
    expect(ElNotificationMock).toHaveBeenCalledOnce()
    expect(ElNotificationMock).toHaveBeenNthCalledWith(1, expectedParams)
    expect(notification).toBe(mockedNotification)
  })
})

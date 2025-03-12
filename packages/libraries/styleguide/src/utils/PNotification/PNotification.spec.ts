import { vi, describe, it, expect } from 'vitest'
import { getIconComponentMock, iconHelperMock } from '@styleguide/__mocks__/icon.helper.mocks'

import { PNotification } from './PNotification'

vi.mock('../../utils/iconHelper', () => iconHelperMock)

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

    getIconComponentMock.mockReturnValue(mockedIconComponent)
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

import { getIconComponentMock, iconHelperMock } from '@styleguide/__mocks__/icon.helper.mocks'

import { PNotification, displayNotification } from './PNotification'

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

describe('test displayNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display success notification with check icon', () => {
    const mockedIconComponent = 'PICheck'
    const message = 'Opération réussie'

    getIconComponentMock.mockReturnValue(mockedIconComponent)

    displayNotification('success', message)

    expect(getIconComponentMock).toHaveBeenCalledWith('check')
    expect(ElNotificationMock).toHaveBeenCalledOnce()
    expect(ElNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message,
        icon: mockedIconComponent,
        customClass: 'success',
        showClose: true,
        position: 'bottom-right',
        duration: 3000,
      }),
    )
  })

  it('should display error notification with x icon', () => {
    const mockedIconComponent = 'PIX'
    const message = 'Une erreur est survenue'

    getIconComponentMock.mockReturnValue(mockedIconComponent)

    displayNotification('error', message)

    expect(getIconComponentMock).toHaveBeenCalledWith('x')
    expect(ElNotificationMock).toHaveBeenCalledOnce()
    expect(ElNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message,
        icon: mockedIconComponent,
        customClass: 'error',
        showClose: true,
        position: 'bottom-right',
        duration: 3000,
      }),
    )
  })

  it('should display warning notification with exclamationTriangle icon', () => {
    const mockedIconComponent = 'PIExclamationTriangle'
    const message = 'Attention : action partiellement réussie'

    getIconComponentMock.mockReturnValue(mockedIconComponent)

    displayNotification('warning', message)

    expect(getIconComponentMock).toHaveBeenCalledWith('exclamationTriangle')
    expect(ElNotificationMock).toHaveBeenCalledOnce()
    expect(ElNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message,
        icon: mockedIconComponent,
        customClass: 'warning',
        showClose: true,
        position: 'bottom-right',
        duration: 3000,
      }),
    )
  })

  it('should allow custom position and duration', () => {
    const mockedIconComponent = 'PICheck'
    const message = 'Message personnalisé'
    const customPosition = 'top-left'
    const customDuration = 5000

    getIconComponentMock.mockReturnValue(mockedIconComponent)

    displayNotification('success', message, customPosition, customDuration)

    expect(ElNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message,
        position: customPosition,
        duration: customDuration,
      }),
    )
  })
})

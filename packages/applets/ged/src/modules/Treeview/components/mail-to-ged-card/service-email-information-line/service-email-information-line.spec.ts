import { vi, describe } from 'vitest'
import { copyServiceEmailToClipboard } from './service-email-information-line.manager'
import { PNotification } from '@pulse/styleguide'

vi.mock('@pulse/styleguide', () => ({
  PNotification: vi.fn(),
}))

const mockClipboardWriteText = vi.hoisted(() => vi.fn())


describe('service email information line', () => {
  beforeEach(() => {
    // Mock global navigator.clipboard
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: mockClipboardWriteText,
      },
      writable: true,
    })

  })

  it('should copy the given email to clipboard and display a copy success notification', async () => {
    mockClipboardWriteText.mockResolvedValueOnce({})

    const email = 'test@example.com'
    await copyServiceEmailToClipboard(email)

    expect(mockClipboardWriteText).toHaveBeenCalledWith(email)

    expect(PNotification).toHaveBeenCalledWith({
      message: 'L\'e-mail a été copié dans votre presse-papier.',
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 3000,
    })
  })

  it('should display a copy error notification when the copy to clipboard promise fails', async () => {
    const errorName = 'Clipboard error'
    mockClipboardWriteText.mockRejectedValueOnce(new Error(errorName))

    const email = 'test@example.com'
    await copyServiceEmailToClipboard(email)

    expect(mockClipboardWriteText).toHaveBeenCalledWith(email)

    expect(PNotification).toHaveBeenCalledWith({
      message: `Une erreur est survenue lors de la copie de l'adresse mail: Error: ${errorName}`,
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
      duration: 3000,
    })
  })
})

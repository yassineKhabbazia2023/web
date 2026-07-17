import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { useCompletedStep } from './completed-step.composable'
import { armConformityDocumentMocks } from '@entities/__mocks__/vitest'

const downloadSignedMandateMock = vi.fn()
const displayNotificationMock = vi.mocked(displayNotification)
const openDocumentInNewTabMock = vi.mocked(openDocumentInNewTab)

const paramsMock = { accountId: 602, downloadErrorMessage: 'downloadError' }

describe('completed-step.composable', () => {
  beforeEach(() => {
    armConformityDocumentMocks()
    vi.spyOn(ConformityPaymentService, 'downloadSignedMandate').mockImplementation(downloadSignedMandateMock)
    downloadSignedMandateMock.mockResolvedValue(new Blob(['signed mandate'], { type: 'application/pdf' }))
  })

  describe('openSignedMandate', () => {
    it('should open the signed mandate in a new tab', async () => {
      openDocumentInNewTabMock.mockResolvedValue(true)
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(openDocumentInNewTabMock).toHaveBeenCalledOnce()
      // The fetcher handed to the helper downloads the signed mandate for the current prospect.
      const [fetchDocument] = openDocumentInNewTabMock.mock.calls[0]
      await fetchDocument()
      expect(downloadSignedMandateMock).toHaveBeenCalledWith(602)
      expect(displayNotificationMock).not.toHaveBeenCalled()
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })

    it('should notify when the browser blocks the popup', async () => {
      openDocumentInNewTabMock.mockResolvedValue(false)
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })

    it('should notify when the download fails', async () => {
      openDocumentInNewTabMock.mockRejectedValue(new Error('boom'))
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })
  })
})

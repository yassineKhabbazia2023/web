import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { useCompletedStep } from './completed-step.composable'

vi.mock('@entities/services/conformity-payment')
vi.mock('@pulse/common/helpers')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const downloadSignedMandateMock = vi.mocked(ConformityPaymentService.downloadSignedMandate)
const displayNotificationMock = vi.mocked(displayNotification)
const openDocumentInNewTabMock = vi.mocked(openDocumentInNewTab)

const paramsMock = { accountId: 602, downloadErrorMessage: 'downloadError' }

describe('completed-step.composable', () => {
  beforeEach(() => {
    downloadSignedMandateMock.mockResolvedValue(new Blob(['signed mandate'], { type: 'application/pdf' }))
  })

  describe('openSignedMandate', () => {
    it('should open the signed mandate in a new tab', async () => {
      openDocumentInNewTabMock.mockResolvedValueOnce(true)
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
      openDocumentInNewTabMock.mockResolvedValueOnce(false)
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })

    it('should notify when the download fails', async () => {
      openDocumentInNewTabMock.mockRejectedValueOnce(new Error('boom'))
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })
  })
})

import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { useCompletedStep } from './completed-step.composable'

vi.mock('@entities/services/conformity-payment')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const downloadSignedMandateMock = vi.mocked(ConformityPaymentService.downloadSignedMandate)
const displayNotificationMock = vi.mocked(displayNotification)

const paramsMock = { prospectId: 602, downloadErrorMessage: 'downloadError' }

describe('completed-step.composable', () => {
  const windowOpenSpy = vi.fn()
  const createObjectUrlMock = vi.fn().mockReturnValue('blob:mocked-url')

  beforeEach(() => {
    downloadSignedMandateMock.mockResolvedValue(new Blob(['signed mandate'], { type: 'application/pdf' }))
    windowOpenSpy.mockClear()
    vi.stubGlobal('open', windowOpenSpy)
    URL.createObjectURL = createObjectUrlMock
  })

  describe('openSignedMandate', () => {
    it('should download the signed mandate and open it in a new tab', async () => {
      const signedMandateBlob = new Blob(['signed mandate'], { type: 'application/pdf' })
      downloadSignedMandateMock.mockResolvedValueOnce(signedMandateBlob)
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(downloadSignedMandateMock).toHaveBeenCalledWith(602)
      expect(createObjectUrlMock).toHaveBeenCalledWith(signedMandateBlob)
      expect(windowOpenSpy).toHaveBeenCalledWith('blob:mocked-url', '_blank', 'noopener,noreferrer')
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })

    it('should notify and not open a tab when the download fails', async () => {
      downloadSignedMandateMock.mockRejectedValueOnce(new Error('boom'))

      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.openSignedMandate()

      expect(windowOpenSpy).not.toHaveBeenCalled()
      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.isLoadingSignedMandate.value).toBe(false)
    })
  })
})

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
  beforeEach(() => {
    downloadSignedMandateMock.mockResolvedValue(new Blob(['signed mandate'], { type: 'application/pdf' }))
  })

  describe('fetchSignedMandate', () => {
    it('should download and store the signed mandate blob', async () => {
      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.fetchSignedMandate()

      expect(downloadSignedMandateMock).toHaveBeenCalledWith(602)
      expect(step.signedMandateBlob.value).toBeInstanceOf(Blob)
    })

    it('should notify when the download fails', async () => {
      downloadSignedMandateMock.mockRejectedValueOnce(new Error('boom'))

      const [step] = withSetup(() => useCompletedStep(paramsMock))

      await step.fetchSignedMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', paramsMock.downloadErrorMessage)
      expect(step.signedMandateBlob.value).toBeNull()
    })
  })
})

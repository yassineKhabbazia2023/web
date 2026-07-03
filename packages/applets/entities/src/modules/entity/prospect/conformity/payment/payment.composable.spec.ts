import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { downloadFile } from '@pulse/common/helpers'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { SIGNED_MANDATE_FILE_NAME } from './payment.consts'
import { usePayment } from './payment.composable'

vi.mock('@entities/services/conformity-payment')
vi.mock('@pulse/common/helpers')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const getPaymentPreferenceMock = vi.mocked(ConformityPaymentService.getPaymentPreference)
const setOtherPaymentPreferenceMock = vi.mocked(ConformityPaymentService.setOtherPaymentPreference)
const resetPaymentPreferenceMock = vi.mocked(ConformityPaymentService.resetPaymentPreference)
const downloadSignedMandateMock = vi.mocked(ConformityPaymentService.downloadSignedMandate)
const downloadFileMock = vi.mocked(downloadFile)
const displayNotificationMock = vi.mocked(displayNotification)

const onPaymentPreferenceChangedMock = vi.fn()

const optionsMock = {
  updateErrorMessage: 'updateError',
  downloadErrorMessage: 'downloadError',
  onPaymentPreferenceChanged: onPaymentPreferenceChangedMock,
}

const accountIdMock = 602

describe('payment.composable', () => {
  beforeEach(() => {
    // The download tests assert downloadFile was not called, so call history must be reset per test.
    vi.clearAllMocks()
    getPaymentPreferenceMock.mockResolvedValue({ paymentType: null })
    setOtherPaymentPreferenceMock.mockResolvedValue(undefined)
    resetPaymentPreferenceMock.mockResolvedValue(undefined)
  })

  describe('initial loading on mount', () => {
    it('should fetch the payment preference and expose it', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.MandateSepa })

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(getPaymentPreferenceMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.paymentType.value).toBe(ConformityPaymentType.MandateSepa)
      expect(result.isLoading.value).toBe(false)
    })

    it('should handle fetch errors gracefully', async () => {
      getPaymentPreferenceMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      expect(result.paymentType.value).toBeNull()
      expect(result.isLoading.value).toBe(false)
    })
  })

  describe('selectOtherMethod', () => {
    it('should set the preference to OTHER and update the local state', async () => {
      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.selectOtherMethod()

      expect(setOtherPaymentPreferenceMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.paymentType.value).toBe(ConformityPaymentType.Other)
      expect(result.isSaving.value).toBe(false)
      expect(onPaymentPreferenceChangedMock).toHaveBeenCalledTimes(1)
    })

    it('should display an error notification and keep the previous state when it fails', async () => {
      setOtherPaymentPreferenceMock.mockRejectedValue(new Error('POST Error'))

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.selectOtherMethod()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.updateErrorMessage)
      expect(result.paymentType.value).toBeNull()
      expect(result.isSaving.value).toBe(false)
      expect(onPaymentPreferenceChangedMock).not.toHaveBeenCalled()
    })
  })

  describe('returnToSepa', () => {
    it('should reset the preference to null and update the local state', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.Other })

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.returnToSepa()

      expect(resetPaymentPreferenceMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.paymentType.value).toBeNull()
      expect(result.isSaving.value).toBe(false)
      expect(onPaymentPreferenceChangedMock).toHaveBeenCalledTimes(1)
    })

    it('should display an error notification and keep the previous state when it fails', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.Other })
      resetPaymentPreferenceMock.mockRejectedValue(new Error('DELETE Error'))

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.returnToSepa()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.updateErrorMessage)
      expect(result.paymentType.value).toBe(ConformityPaymentType.Other)
      expect(result.isSaving.value).toBe(false)
      expect(onPaymentPreferenceChangedMock).not.toHaveBeenCalled()
    })
  })

  describe('refreshPaymentPreference', () => {
    it('should re-fetch the preference and update the state without toggling isLoading', async () => {
      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.MandateSepa })

      const pending = result.refreshPaymentPreference()
      // The refresh stays silent: the card loader never flips back on.
      expect(result.isLoading.value).toBe(false)
      await pending

      expect(getPaymentPreferenceMock).toHaveBeenLastCalledWith(accountIdMock)
      expect(result.paymentType.value).toBe(ConformityPaymentType.MandateSepa)
      expect(result.isLoading.value).toBe(false)
      expect(onPaymentPreferenceChangedMock).toHaveBeenCalledTimes(1)
    })

    it('should keep the previous state when the refresh fails', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.Other })

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      getPaymentPreferenceMock.mockRejectedValue(new Error('GET Error'))

      await result.refreshPaymentPreference()

      expect(result.paymentType.value).toBe(ConformityPaymentType.Other)
      expect(onPaymentPreferenceChangedMock).not.toHaveBeenCalled()
    })
  })

  describe('downloadMandate', () => {
    it('should fetch the signed mandate and trigger its download', async () => {
      const signedMandate = new Blob(['signed mandate'], { type: 'application/pdf' })
      downloadSignedMandateMock.mockResolvedValue(signedMandate)

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.downloadMandate()

      expect(downloadSignedMandateMock).toHaveBeenCalledWith(accountIdMock)
      expect(downloadFileMock).toHaveBeenCalledWith(signedMandate, SIGNED_MANDATE_FILE_NAME)
      expect(result.isSaving.value).toBe(false)
    })

    it('should notify and not download when the fetch fails', async () => {
      downloadSignedMandateMock.mockRejectedValue(new Error('GET Error'))

      const [result] = withSetup(() => usePayment(accountIdMock, optionsMock))
      await flushPromises()

      await result.downloadMandate()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.downloadErrorMessage)
      expect(downloadFileMock).not.toHaveBeenCalled()
      expect(result.isSaving.value).toBe(false)
    })
  })
})

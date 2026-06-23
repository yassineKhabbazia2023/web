import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { displayNotification } from '@pulse/styleguide'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { usePayment } from './payment.composable'

vi.mock('@entities/services/conformity-payment')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')

const getPaymentPreferenceMock = vi.mocked(ConformityPaymentService.getPaymentPreference)
const setOtherPaymentPreferenceMock = vi.mocked(ConformityPaymentService.setOtherPaymentPreference)
const resetPaymentPreferenceMock = vi.mocked(ConformityPaymentService.resetPaymentPreference)
const displayNotificationMock = vi.mocked(displayNotification)

const optionsMock = {
  updateErrorMessage: 'updateError',
}

const prospectIdMock = 602

describe('payment.composable', () => {
  beforeEach(() => {
    getPaymentPreferenceMock.mockResolvedValue({ paymentType: null })
    setOtherPaymentPreferenceMock.mockResolvedValue(undefined)
    resetPaymentPreferenceMock.mockResolvedValue(undefined)
  })

  describe('initial loading on mount', () => {
    it('should fetch the payment preference and expose it', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.MandateSepa })

      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))

      expect(result.isLoading.value).toBe(true)

      await flushPromises()

      expect(getPaymentPreferenceMock).toHaveBeenCalledWith(prospectIdMock)
      expect(result.paymentType.value).toBe(ConformityPaymentType.MandateSepa)
      expect(result.isLoading.value).toBe(false)
    })

    it('should handle fetch errors gracefully', async () => {
      getPaymentPreferenceMock.mockRejectedValue(new Error('API Error'))

      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))
      await flushPromises()

      expect(result.paymentType.value).toBeNull()
      expect(result.isLoading.value).toBe(false)
    })
  })

  describe('selectOtherMethod', () => {
    it('should set the preference to OTHER and update the local state', async () => {
      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))
      await flushPromises()

      await result.selectOtherMethod()

      expect(setOtherPaymentPreferenceMock).toHaveBeenCalledWith(prospectIdMock)
      expect(result.paymentType.value).toBe(ConformityPaymentType.Other)
      expect(result.isSaving.value).toBe(false)
    })

    it('should display an error notification and keep the previous state when it fails', async () => {
      setOtherPaymentPreferenceMock.mockRejectedValue(new Error('POST Error'))

      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))
      await flushPromises()

      await result.selectOtherMethod()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.updateErrorMessage)
      expect(result.paymentType.value).toBeNull()
      expect(result.isSaving.value).toBe(false)
    })
  })

  describe('returnToSepa', () => {
    it('should reset the preference to null and update the local state', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.Other })

      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))
      await flushPromises()

      await result.returnToSepa()

      expect(resetPaymentPreferenceMock).toHaveBeenCalledWith(prospectIdMock)
      expect(result.paymentType.value).toBeNull()
      expect(result.isSaving.value).toBe(false)
    })

    it('should display an error notification and keep the previous state when it fails', async () => {
      getPaymentPreferenceMock.mockResolvedValue({ paymentType: ConformityPaymentType.Other })
      resetPaymentPreferenceMock.mockRejectedValue(new Error('DELETE Error'))

      const [result] = withSetup(() => usePayment(prospectIdMock, optionsMock))
      await flushPromises()

      await result.returnToSepa()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', optionsMock.updateErrorMessage)
      expect(result.paymentType.value).toBe(ConformityPaymentType.Other)
      expect(result.isSaving.value).toBe(false)
    })
  })
})

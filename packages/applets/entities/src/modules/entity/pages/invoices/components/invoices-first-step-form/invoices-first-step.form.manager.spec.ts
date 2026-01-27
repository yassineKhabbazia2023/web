import { InvoicesFirstStepFormManager } from './invoices-first-step.form.manager'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'
import type { FormInstance } from 'element-plus'
import type { InvoicesFormModel } from '@entities/modules/entity/types'

vi.mock('@entities/services/invoices/invoices.tracking.service')

const createFormRefMock = (validateResult: boolean): FormInstance => ({
  validate: vi.fn().mockImplementation(() => {
    if (validateResult) {
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Validation failed'))
  }),
} as unknown as FormInstance)

const formModelMock: InvoicesFormModel = {
  email: 'test@example.com',
  acceptTerms: true,
}

describe('InvoicesFirstStepFormManager', () => {
  describe('submitForm', () => {
    it('should return success false when formRef is null', async () => {
      const result = await InvoicesFirstStepFormManager.submitForm(null, formModelMock)

      expect(result).toEqual({ success: false })
    })

    it('should call formRef.validate when formRef is provided', async () => {
      const formRefMock = createFormRefMock(true)

      await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(formRefMock.validate).toHaveBeenCalled()
    })

    it('should track success when validation passes', async () => {
      const formRefMock = createFormRefMock(true)

      await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(vi.mocked(InvoicesTracking.trackDigitizationInitializedSuccess)).toHaveBeenCalled()
    })

    it('should return success true with data when validation passes', async () => {
      const formRefMock = createFormRefMock(true)

      const result = await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(formModelMock)
    })

    it('should return a copy of formModel data, not the original reference', async () => {
      const formRefMock = createFormRefMock(true)

      const result = await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(result.data).not.toBe(formModelMock)
      expect(result.data).toEqual(formModelMock)
    })

    it('should track failure when validation fails', async () => {
      const formRefMock = createFormRefMock(false)

      await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(vi.mocked(InvoicesTracking.trackDigitizationInitializedFail)).toHaveBeenCalled()
    })

    it('should return success false when validation fails', async () => {
      const formRefMock = createFormRefMock(false)

      const result = await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(result).toEqual({ success: false })
    })

    it('should not track success when validation fails', async () => {
      const formRefMock = createFormRefMock(false)

      await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(vi.mocked(InvoicesTracking.trackDigitizationInitializedSuccess)).not.toHaveBeenCalled()
    })

    it('should not track failure when validation passes', async () => {
      const formRefMock = createFormRefMock(true)

      await InvoicesFirstStepFormManager.submitForm(formRefMock, formModelMock)

      expect(vi.mocked(InvoicesTracking.trackDigitizationInitializedFail)).not.toHaveBeenCalled()
    })
  })
})

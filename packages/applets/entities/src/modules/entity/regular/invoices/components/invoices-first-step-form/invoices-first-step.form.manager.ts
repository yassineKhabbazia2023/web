import type { FormInstance } from 'element-plus'
import type { SubmitFormResult } from './invoices-first-step.form.types'
import { InvoicesTracking } from '../../services/invoices.tracking.service'

export class InvoicesFirstStepFormManager {
  static async submitForm(
    formRef: FormInstance | null,
  ): Promise<SubmitFormResult> {
    if (formRef === null) {
      return { success: false }
    }

    try {
      await formRef.validate()
      InvoicesTracking.trackDigitizationInitializedSuccess()
      return { success: true }
    } catch {
      InvoicesTracking.trackDigitizationInitializedFail()
      return { success: false }
    }
  }
}

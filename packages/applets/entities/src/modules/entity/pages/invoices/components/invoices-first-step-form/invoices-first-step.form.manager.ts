import type { FormInstance } from 'element-plus'
import type { InvoicesFormModel } from '@entities/modules/entity/types'
import type { SubmitFormResult } from './invoices-first-step.form.types'
import { InvoicesTracking } from '@entities/services/invoices/invoices.tracking.service'

export class InvoicesFirstStepFormManager {
  static async submitForm(
    formRef: FormInstance | null,
    formModel: InvoicesFormModel,
  ): Promise<SubmitFormResult> {
    if (formRef === null) {
      return { success: false }
    }

    try {
      await formRef.validate()
      InvoicesTracking.trackDigitizationInitializedSuccess()
      return { success: true, data: { ...formModel } }
    } catch {
      InvoicesTracking.trackDigitizationInitializedFail()
      return { success: false }
    }
  }
}

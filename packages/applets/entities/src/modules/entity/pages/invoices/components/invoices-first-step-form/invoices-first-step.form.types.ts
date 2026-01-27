import type { InvoicesFormModel } from '@entities/modules/entity/types'

export interface SubmitFormResult {
  success: boolean
  data?: InvoicesFormModel
}

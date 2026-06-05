import type { PennylaneAccessDetails, PennylaneFreeTrialInfo } from '@pulse/common/services/pennylane'

export interface PennylaneAmendmentFlowDialogProps {
  modelValue: boolean
  currentAccountId?: number
  accessDetails?: PennylaneAccessDetails
  freeTrialInfo?: PennylaneFreeTrialInfo
}

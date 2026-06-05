import type { PennylaneAccessDetails, PennylaneFreeTrialInfo } from '@pulse/common/services/pennylane'

export interface GlobalPennylaneAmendmentDialogProps {
  modelValue: boolean
  accessDetails?: PennylaneAccessDetails
  freeTrialInfo?: PennylaneFreeTrialInfo
}

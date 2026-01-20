import type { PennylaneAccessDetails } from '@pulse/common/services/pennylane'

export interface PennylaneAmendmentFlowDialogProps {
  modelValue: boolean
  currentAccountId: number
  accessDetails?: PennylaneAccessDetails
}

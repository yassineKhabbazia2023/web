import type { PennylaneAccessAccount, PennylaneFreeTrialInfo } from '@pulse/common/services/pennylane'

export interface StepAccountsPricingProps {
  accounts: PennylaneAccessAccount[]
  freeTrialInfo: PennylaneFreeTrialInfo
}

import { type Account } from '@entities/services/account'
import type { ProviderName } from '@entities/enums'

export interface CompanyInformationProps {
  modelValue?: Account
  providerName?: ProviderName
  offerCode?: string
  selectedPlanCode?: string
}

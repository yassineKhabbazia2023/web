import type { PFieldProps } from '@kpmg/styleguide'
import { type Account } from '@/services/account'

export type ProviderFormName = 'MEG' | 'LOOP' | undefined

export type FormSection = {
  title: string
  fields: PFieldProps<string>[]
}

export interface CompanyInformationProps {
  modelValue: Account
  providerName: ProviderFormName
}

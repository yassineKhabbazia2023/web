import type { PFieldProps } from '@kpmg/styleguide'
import { type Account } from '@entities/services/account'

export type ProviderFormName = 'MEG' | 'LOOP' | undefined

export interface FormField extends PFieldProps<string> {
  referentialKey?: string
}

export type FormSection = {
  title: string
  fields: FormField[]
  sectionKey?: string
}

export interface CompanyInformationProps {
  modelValue: Account
  providerName: ProviderFormName
}

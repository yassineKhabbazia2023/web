import type { PFieldProps } from '@pulse/styleguide'
import { type Account } from '@entities/services/account'
import type { ProviderName } from '@entities/common/types/ProviderNameEnums'

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
  providerName?: ProviderName
}

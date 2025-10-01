import type { PFieldProps } from '@pulse/styleguide/types'
import { type Account } from '@entities/services/account'
import type { ProviderName } from '@entities/common/types/ProviderNameEnums'

export interface FormField extends PFieldProps<string> {
  referentialKey?: string
  isStoredHasNumber?: boolean // true when referential values are numbers represented by strings
}

export type FormSection = {
  title: string
  fields: FormField[]
  sectionKey?: string
}

export interface CompanyInformationProps {
  modelValue?: Account
  providerName?: ProviderName
  offerCode?: string
}

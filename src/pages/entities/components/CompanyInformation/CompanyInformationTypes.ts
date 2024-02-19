import type { PFieldProps } from '@kpmg/styleguide'

export type ProviderFormName = 'MEG' | 'LOOP' | undefined

export type FormSection = {
  title: string
  fields: PFieldProps<string>[]
}

export interface CompanyInformationProps {
  modelValue: Record<string, string | number>
  providerName: ProviderFormName
}

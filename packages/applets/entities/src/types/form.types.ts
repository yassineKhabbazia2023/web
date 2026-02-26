import type { PFieldProps } from '@pulse/styleguide/types'

export interface FormField extends PFieldProps<string> {
  referentialKey?: string
  isStoredHasNumber?: boolean // true when referential values are numbers represented by strings
}

export type FormSection = {
  title: string
  fields: FormField[]
  sectionKey?: string
}

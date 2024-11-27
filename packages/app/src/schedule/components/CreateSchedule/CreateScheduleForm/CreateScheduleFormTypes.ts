import type { POptionProps } from '@pulse/styleguide/types'

export type FormProps = {
  checkValidity?: boolean
  defaultCreateDate?: Date
  recipientsCollection: POptionProps[]
  frequenciesCollection: string[]
}

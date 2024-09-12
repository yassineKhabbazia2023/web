import type { Options }
  from '@/schedule/components/Common/DropdownMultiSelectWithToggleAll/DropdownMultiSelectWithToggleAllTypes'

export type FormProps = {
  checkValidity?: boolean
  defaultCreateDate?: Date
  recipientsCollection: Options[]
  frequenciesCollection: string[]
}

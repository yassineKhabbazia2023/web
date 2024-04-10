export type Options = {
  label: string
  value: number
}

export interface DropdownMultiSelectWithToggleAllProps {
  placeholder?: string
  toggleAllCheckboxLabel?: string
  optionsCollection: Options[]
  modelValue: number[]
}

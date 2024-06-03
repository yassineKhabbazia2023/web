import type { PFilterOptionProps } from '@/atoms/PFilterOption/PFilterOptionTypes'
export interface FilterOption<T = string> extends Omit<PFilterOptionProps, 'pSelected'>{
  pCode: T
}
export interface PFilterGroupProps<T = string> {
  modelValue: string[]
  pFilters: FilterOption<T>[]
}

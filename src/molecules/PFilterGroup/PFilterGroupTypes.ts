import type { PFilterOptionProps } from '@/atoms/PFilterOption/PFilterOptionTypes'
export interface PFilterOption extends Omit<PFilterOptionProps, 'pSelected'>{
  pCode: string
}
export interface PFilterGroupProps {
  modelValue: string[]
  pFilters: PFilterOption[]
}

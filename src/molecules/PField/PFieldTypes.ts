import type { FormItemRule } from 'element-plus'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'

export interface PFieldPropsBase<T> {
  modelValue: T,
  pFieldType: 'input' | 'dropdown',
  pFieldKey: string,
  pLabel: string,
  pPlaceholder?: string
  pReadonly?: boolean,
  pDisabled?: boolean,
  pCssClass?: string | undefined,
  pRules?: FormItemRule[]
}

export interface PFieldPropsInput<T> extends PFieldPropsBase<T> {
  pType?: string,
}

export interface PFieldPropsSelect<T> extends PFieldPropsBase<T> {
  pDropdownOptions?: PDropdownOption[]
}

export type PFieldProps<T> = PFieldPropsInput<T> & PFieldPropsSelect<T>

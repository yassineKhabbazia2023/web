import type { FormItemRule } from 'element-plus'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'

export interface PFieldPropsBase<T> {
  modelValue?: T | undefined,
  pFieldType: 'input' | 'dropdown' | 'date',
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

export interface PFieldPropsDropdown<T> extends PFieldPropsBase<T> {
  pDropdownOptions?: PDropdownOption[]
}

export interface PFieldPropsDate<T> extends PFieldPropsBase<T> {
  pType?: string,
}

export type PFieldProps<T> = PFieldPropsInput<T> & PFieldPropsDropdown<T> & PFieldPropsDate<T>

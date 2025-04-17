import type { FormItemRule } from 'element-plus'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import type { PDatePickerProps } from '../../atoms/PDatePicker/PDatePickerTypes'
import { IconName } from '@styleguide/types/IconName.types'

export interface PFieldPropsBase<T> {
  modelValue?: T
  pFieldType: 'input' | 'dropdown' | 'date' | 'radio' | 'email-input' | 'checkbox'
  pFieldKey: string
  pLabel?: string
  pPlaceholder?: string
  pReadonly?: boolean
  pDisabled?: boolean
  pCssClass?: string
  pTestId?: string
  pRules?: FormItemRule[]
  pSuffixIconName?: IconName
}

export interface PFieldPropsInput<T> extends PFieldPropsBase<T> {
  pType?: string
  pAutosize?: boolean
}

export interface PFieldPropsDropdown<T> extends PFieldPropsBase<T> {
  pDropdownOptions?: PDropdownOption[]
  pMultiple?: boolean
  pCheckAllLabel?: string
  pCollapseTags?: boolean
  pCollapseTagsTooltip?: boolean
}

export interface PFieldPropsDate<T> extends PFieldPropsBase<T> {
  pDateType?: PDatePickerProps['pType']
  pFormat?: string
  pValueFormat?: string
}

export interface PFieldRadioOptions {
  pValue: string | number | boolean
  pLabel: string
}

export interface PFieldPropsRadio<T> extends PFieldPropsBase<T> {
  pBorder?: boolean
  pSize?: 'large' | 'default' | 'small'
  pName?: string
  pFlexColumn?: boolean
  pMultiple?: boolean
  pOptions?: PFieldRadioOptions[]
}

export interface PFieldPropsEmailInput<T> extends PFieldPropsBase<T> {
  pDefaultDomainPart?: string
  pLocalPartPlaceholder?: string
  pDomainPartPlaceholder?: string
  pLocalPartDisabled?: boolean
  pDomainPartDisabled?: boolean
}

export interface PFieldPropsCheckbox<T> extends PFieldPropsBase<T> {
  pChecked?: boolean
  pRounded?: boolean
}

export type PFieldProps<T> = PFieldPropsInput<T> &
  PFieldPropsDropdown<T> &
  PFieldPropsDate<T> &
  PFieldPropsRadio<T> &
  PFieldPropsEmailInput<T> &
  PFieldPropsCheckbox<T>

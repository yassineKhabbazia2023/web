import { type FormItemRule } from 'element-plus'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import type { PFieldPropsInput, PFieldPropsDropdown, PFieldPropsDate } from './PFieldTypes'
import type { PDatePickerProps } from '@/atoms/PDatePicker/PDatePickerTypes'

export function getMockedRule(ruleType: string): FormItemRule | undefined {
  if (ruleType === 'email') {
    return {
      type: 'email',
      message: 'Veuillez saisir une adresse email correcte',
      trigger: ['blur', 'change'],
    }
  }
  if (ruleType === 'phone') {
    return {
      type: 'string',
      pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$',
      message: 'Veuillez saisir numéro de téléphone correct',
      trigger: ['blur', 'change'],
    }
  }
  throw new Error(`Unknown rule type '${ruleType}'`)
}

export function getMockedInputField(
  pFieldKey: string,
  pLabel: string,
  pPlaceholder: string,
  flexBasis: number,
  pDisabled: boolean = false,
  ruleTypes?: string[],
  pTestId?: string,
): PFieldPropsInput<string> {
  const pRules = (ruleTypes ?? [])
    .map(ruleType => getMockedRule(ruleType))
    .filter(Boolean) as FormItemRule[]

  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue: '',
    pFieldKey,
    pLabel,
    pFieldType: 'input',
    pPlaceholder,
    pDisabled,
    pCssClass,
    pRules,
    pTestId,
  }
}

export function getDropdownField(
  pFieldKey: string,
  pLabel: string,
  flexBasis: number,
  pDropdownOptions?: PDropdownOption[],
  pDisabled: boolean = false,
  pTestId?: string,
): PFieldPropsDropdown<number | undefined> {
  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue: undefined,
    pFieldKey,
    pLabel,
    pFieldType: 'dropdown',
    pCssClass,
    pDisabled,
    pDropdownOptions,
    pTestId,
  }
}

export function getDateField(
  pFieldKey: string,
  pLabel: string,
  pPlaceholder: string,
  flexBasis: number,
  pFormat: string = 'DD/MM/YYYY',
  pValueFormat: string = 'YYYY-MM-DD',
  pDisabled: boolean = false,
  pDateType: PDatePickerProps['pType'] = 'date',
  pTestId?: string,
): PFieldPropsDate<string> {
  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue: '',
    pFieldKey,
    pLabel,
    pPlaceholder,
    pFieldType: 'date',
    pCssClass,
    pDisabled,
    pDateType,
    pFormat,
    pValueFormat,
    pTestId,
  }
}

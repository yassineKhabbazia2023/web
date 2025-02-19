import { type FormItemRule } from 'element-plus'
import type { PDropdownOption } from '../PDropdown/PDropdownTypes'
import type {
  PFieldPropsInput,
  PFieldPropsDropdown,
  PFieldPropsDate,
  PFieldPropsRadio,
  PFieldPropsEmailInput,
} from './PFieldTypes'
import type { PDatePickerProps } from '../../atoms/PDatePicker/PDatePickerTypes'

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

export function getMockedCheckbox(
  pFieldKey: string,
  pLabel: string,
  flexBasis: number,
  ruleTypes?: string[],
  pTestId?: string,
): PFieldPropsInput<boolean> {
  const pRules = (ruleTypes ?? []).map((ruleType) => getMockedRule(ruleType)).filter(Boolean) as FormItemRule[]

  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue: false,
    pFieldKey,
    pLabel,
    pFieldType: 'checkbox',
    pCssClass,
    pRules,
    pTestId,
  }
}

export function getMockedEmailInputField(
  pFieldKey: string,
  pDefaultDomainPart: string,
  pLocalPartPlaceholder: string,
  pDomainPartPlaceholder: string,
  pLocalPartDisabled: boolean,
  pDomainPartDisabled: boolean,
  flexBasis: number,
  ruleTypes?: string[],
  pTestId?: string,
): PFieldPropsEmailInput<string> {
  const pRules = (ruleTypes ?? []).map((ruleType) => getMockedRule(ruleType)).filter(Boolean) as FormItemRule[]

  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue: '',
    pFieldKey,
    pLocalPartPlaceholder,
    pDomainPartPlaceholder,
    pFieldType: 'email-input',
    pDefaultDomainPart,
    pLocalPartDisabled,
    pDomainPartDisabled,
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
  pMultiple?: boolean,
  pTestId?: string,
  pCheckAllLabel: string = 'Tout afficher',
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
    pMultiple,
    pCheckAllLabel,
    pCollapseTags: true,
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

export function getRadioField({
  modelValue = '',
  pFieldKey = '',
  pLabel = '',
  flexBasis,
  pPlaceholder = '',
  pDisabled = false,
  pTestId,
  pName,
  pBorder,
  pFlexColumn,
  pMultiple = false,
  pOptions = [
    {
      pValue: 'a',
      pLabel: 'A',
    },
    {
      pValue: 'b',
      pLabel: 'B',
    },
  ],
}: {
  modelValue?: string | string[]
  pFieldKey?: string
  pLabel?: string
  flexBasis?: number
  pPlaceholder?: string
  pDisabled?: boolean
  pTestId?: string
  pName?: string
  pBorder?: boolean
  pFlexColumn?: boolean
  pMultiple?: boolean
  pOptions?: PFieldPropsRadio<string>['pOptions']
}): PFieldPropsRadio<string | string[]> {
  const pCssClass = `flex--grow-1 min-width--4 flex--basis-${flexBasis}`

  return {
    modelValue,
    pFieldKey,
    pLabel,
    pPlaceholder,
    pFieldType: 'radio',
    pCssClass,
    pDisabled,
    pTestId,
    pBorder,
    pSize: 'default',
    pName: pName ?? pLabel,
    pOptions,
    pMultiple,
    pFlexColumn,
  }
}

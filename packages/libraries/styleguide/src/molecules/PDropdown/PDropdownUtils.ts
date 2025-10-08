import { logger } from '@pulse/toolbox'
import type { DropdownGroup, PDropdownOption, PDropdownProps } from './PDropdownTypes'

export function addOptionInGroups(groups: DropdownGroup[], pGroupLabel: string, pOptions: PDropdownOption) {
  const group = groups.find(({ label }) => label === pGroupLabel)
  if (group) {
    group.options.push(pOptions)
  } else {
    groups.push({
      label: pGroupLabel,
      options: [pOptions],
    })
  }
}

export function getDropdownGroups(pOptions: PDropdownOption[]) {
  const groups = pOptions
    .reduce<DropdownGroup[]>((groups, pOption) => {
      const { pGroupLabel } = pOption

      addOptionInGroups(groups, pGroupLabel ?? '', pOption)

      return groups
    }, [] as DropdownGroup[])

  return groups
}

export function getHasGroups(dropdownGroup: DropdownGroup[]) {
  return dropdownGroup.length > 1 || (dropdownGroup.at(0)?.label ?? '') !== ''
}

export function getIsCheckAll(
  pOptions: PDropdownOption[],
  modelValue: PDropdownProps['modelValue'],
) {
  const allEnabledValues = getAllEnabledValues(pOptions)
  if (Array.isArray(modelValue) && allEnabledValues.length > 0 && allEnabledValues.length === modelValue.length) {
    const hasUncheckedOption = allEnabledValues.some(value => !modelValue.includes(value))

    return !hasUncheckedOption
  }
  return false
}

export function getAllEnabledValues(
  pOptions: PDropdownOption[],
) {
  return pOptions
    .filter(({ pDisabled }) => !pDisabled)
    .map(({ pValue }) => pValue)
}

export function getInternalOptions(pOptions: PDropdownOption[]) {
  return pOptions.map((option) => {
    // should replace label by value when element-plus will be 2.6.0 or higher
    // see: https://element-plus.org/en-US/component/radio.html#radio-api
    const internalValue = typeof option.pValue === 'object'
      ? undefined
      : option.pValue

    if (internalValue === undefined) {
      logger.warn('Unexpected undefined value for option', option)
    }

    return {
      ...option,
      internalValue,
    }
  })
}

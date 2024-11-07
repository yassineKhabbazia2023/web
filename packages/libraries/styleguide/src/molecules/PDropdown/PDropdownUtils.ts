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

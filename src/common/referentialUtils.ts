import type { PDropdownOption } from '@kpmg/styleguide'
import type { FormSection, FormField }
  from '@/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import type { ReferentialStructure, ReferentialOptions, Hub } from '@/services/account'

export function referentialOptionsToPDropdownOption(
  referentialOptions: ReferentialOptions | undefined,
): PDropdownOption[] | undefined {
  if (referentialOptions === undefined) {
    return undefined
  }
  const keys = Object.keys(referentialOptions)
  return keys
    .map<PDropdownOption>((key) => {
      const dropdownOption: PDropdownOption = {
        pValue: key,
        pLabel: referentialOptions[key],
      }

      return dropdownOption
    })
}

export function getReferentialDropdownOptions(
  referential: ReferentialStructure,
  referentialHubs: Hub[],
  referentialKey: string | undefined,
): PDropdownOption[] | undefined {
  if (referentialKey === undefined) {
    return undefined
  }
  if (referentialKey === 'hubName') {
    return referentialHubs
      .map<PDropdownOption>(({ hubId, hubName }) => ({
        pValue: hubId,
        pLabel: hubName,
      }))
  }
  const referentialItem = referential[referentialKey]

  return referentialOptionsToPDropdownOption(referentialItem)
}

export function getEnrichedField(
  referential: ReferentialStructure,
  referentialHubs: Hub[],
  field: FormField,
): FormField {
  const { referentialKey, pFieldType } = field
  if (pFieldType !== 'dropdown') {
    return field
  }

  const pDropdownOptions = getReferentialDropdownOptions(
    referential,
    referentialHubs,
    referentialKey,
  )
  if (!pDropdownOptions) {
    console.warn(`missing referential for field: '${referentialKey}'`)

    return field
  }

  return {
    ...field,
    pDropdownOptions,
  }
}

export function getEnrichedFormSection(
  referential: ReferentialStructure,
  referentialHubs: Hub[],
  formSection: FormSection,
): FormSection {
  const fields = formSection.fields.map((field) => getEnrichedField(
    referential,
    referentialHubs,
    field,
  ))

  return {
    title: formSection.title,
    fields,
  }
}

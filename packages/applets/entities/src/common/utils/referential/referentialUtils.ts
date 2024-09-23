import type { PDropdownOption } from '@kpmg/styleguide'
import type {
  FormSection,
  FormField,
} from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import {
  fetchAccountReferential,
  fetchReferentialHubs,
} from '@entities/services/account'
import type {
  ReferentialStructure,
  ReferentialOptions,
  Hub,
} from '@entities/services/account'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import MEGOffersFormReadOnlyStructure from '@entities/common/config/forms/MEGOffersFormReadOnlyStructure.json'
import LOOPOfferFormStructure from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'

export function referentialOptionsToPDropdownOption(
  referentialOptions: ReferentialOptions | undefined,
): PDropdownOption[] | undefined {
  if (referentialOptions === undefined) {
    return undefined
  }
  const keys = Object.keys(referentialOptions)
  return keys.map<PDropdownOption>((key) => {
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
    return referentialHubs.map<PDropdownOption>(({ hubId, hubName }) => ({
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
  const fields = formSection.fields.map((field) =>
    getEnrichedField(referential, referentialHubs, field),
  )

  return {
    title: formSection.title,
    sectionKey: formSection.sectionKey,
    fields,
  }
}

export const getFormSections = (formType: string): FormSection[] => {
  switch (formType) {
    case 'MEG':
      return MEGOffersFormStructure as FormSection[]
    case 'MEG_RO': // For MEG Form Structure in read-only mode
      return MEGOffersFormReadOnlyStructure as FormSection[]
    case 'LOOP':
      return LOOPOfferFormStructure as FormSection[]
    case 'CompanyProfile':
      return InformationFormStructure as FormSection[]
    default:
      return []
  }
}

export async function getFormStructure(formType: string) {
  const formSections = getFormSections(formType)
  const accountReferential = await fetchAccountReferential()
  const referentialHubs = await fetchReferentialHubs()

  const enrichedFormSections: FormSection[] = formSections.map((formSection) =>
    getEnrichedFormSection(accountReferential, referentialHubs, formSection),
  )

  return enrichedFormSections
}

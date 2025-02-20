import { logger } from '@pulse/core'
import type { PDropdownOption } from '@pulse/styleguide/types'
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
import LOOPOfferFormStructure from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'
import EntityCreatorFormStructure from '@entities/common/config/forms/EntityCreatorFormStructure.json'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import type { FormStructureName } from './referentialUtilsTypes'

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
  forceDisabled = false,
): FormField {
  const { referentialKey, pFieldType } = field

  const enrichedField = forceDisabled
    ? {
      ...field,
      pDisabled: true,
    }
    : field

  if (pFieldType !== 'dropdown') {
    return enrichedField
  }
  const pDropdownOptions = getReferentialDropdownOptions(
    referential,
    referentialHubs,
    referentialKey,
  )
  if (!pDropdownOptions) {
    logger.warn(`missing referential for field: '${referentialKey}'`)

    return enrichedField
  }

  return {
    ...enrichedField,
    pDropdownOptions,
  }
}

export function getEnrichedFormSection(
  referential: ReferentialStructure,
  referentialHubs: Hub[],
  formSection: FormSection,
  forceDisabled = false,
): FormSection {
  const fields = formSection.fields.map((field) =>
    getEnrichedField(referential, referentialHubs, field, forceDisabled),
  )

  return {
    title: formSection.title,
    sectionKey: formSection.sectionKey,
    fields,
  }
}

export const getFormSections = (formStructureName: FormStructureName) => {
  switch (formStructureName) {
  case ProviderName.MEG:
    return MEGOffersFormStructure as FormSection[]
  case ProviderName.LOOP:
    return LOOPOfferFormStructure as FormSection[]
  case 'CompanyProfile':
    return InformationFormStructure as FormSection[]
  case 'EntityCreator':
    return EntityCreatorFormStructure as FormSection[]
  default:
    return []
  }
}

export async function getFormStructure(formStructureName?: FormStructureName, forceDisabled = false) {
  if (formStructureName === undefined) {
    return []
  }
  const formSections = getFormSections(formStructureName)
  const accountReferential = await fetchAccountReferential()
  const referentialHubs = await fetchReferentialHubs()

  const enrichedFormSections: FormSection[] = formSections.map((formSection) =>
    getEnrichedFormSection(accountReferential, referentialHubs, formSection, forceDisabled),
  )

  return enrichedFormSections
}

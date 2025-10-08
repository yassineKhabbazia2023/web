import { logger } from '@pulse/toolbox'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type {
  FormSection,
  FormField,
} from '@entities/pages/entities/components/CompanyInformation/CompanyInformationTypes'
import {
  fetchAccountReferential,
  fetchReferentialHubs,
  fetchReferentialOffices,
} from '@entities/services/account'
import type {
  ReferentialStructure,
  ReferentialOptions,
  Hub,
} from '@entities/services/account'
import type { Office } from '@pulse/common/types'
import MEGOffersFormStructure from '@entities/common/config/forms/MEGOffersFormStructure.json'
import LOOPOfferFormStructure from '@entities/common/config/forms/LOOPOfferFormStructure.json'
import PennylaneOfferFormStructure from '@entities/common/config/forms/PennylaneOfferFormStructure.json'
import InformationFormStructure from '@entities/common/config/forms/InformationFormStructure.json'
import EntityCreatorFormStructure from '@entities/common/config/forms/EntityCreatorFormStructure.json'
import { ProviderName } from '@entities/common/types/ProviderNameEnums'
import type { FormStructureName } from './referentialUtilsTypes'
import { get, setWith } from 'lodash-es'

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
  referentialOffices: Office[],
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
  if (referentialKey === 'officeName') {
    return referentialOffices.map<PDropdownOption>(({ officeId, name }) => ({
      pValue: officeId,
      pLabel: name,
    }))
  }
  const referentialItem = referential[referentialKey]

  return referentialOptionsToPDropdownOption(referentialItem)
}

export function getEnrichedField(
  referential: ReferentialStructure,
  referentialHubs: Hub[],
  referentialOffices: Office[],
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
    referentialOffices,
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
  refentialOffices: Office[],
  formSection: FormSection,
  forceDisabled = false,
): FormSection {
  const fields = formSection.fields.map((field) =>
    getEnrichedField(referential, referentialHubs, refentialOffices, field, forceDisabled),
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
    case ProviderName.PENNYLANE:
      return PennylaneOfferFormStructure as FormSection[]
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
  const referentialOffices = await fetchReferentialOffices()

  const enrichedFormSections: FormSection[] = formSections.map((formSection) =>
    getEnrichedFormSection(accountReferential, referentialHubs, referentialOffices, formSection, forceDisabled),
  )

  return enrichedFormSections
}

export function hasValueInDropdownOptions(
  pDropdownOptions: PDropdownOption[],
  isStoredHasNumber: boolean | undefined,
  value: any,
) {
  const hasValue = pDropdownOptions.some(({ pValue }) => {
    return isStoredHasNumber
      ? Number(pValue) === value // referential values are numbers represented by strings
      : pValue === value
  })

  return hasValue
}

export function cleanRecordDropdownField<T extends Record<string, any>>(
  pFieldKey: string,
  pDropdownOptions: PDropdownOption[],
  isStoredHasNumber: boolean | undefined,
  record: T,
) {
  const value = get(record, pFieldKey)
  if (value === undefined) {
    return
  }
  const hasValue = hasValueInDropdownOptions(pDropdownOptions, isStoredHasNumber, value)

  if (hasValue === false) {
    setWith(record, pFieldKey, undefined, Object)
  }
}

export function cleanRecordStructure<T extends Record<string, any>>(formStructure: FormSection[], record: T) {
  formStructure.forEach((formSection) => {
    formSection.fields.forEach((formField) => {
      const { pFieldKey, pDropdownOptions, isStoredHasNumber } = formField
      if (pDropdownOptions !== undefined) {
        cleanRecordDropdownField(pFieldKey, pDropdownOptions, isStoredHasNumber, record)
      }
    })
  })
}

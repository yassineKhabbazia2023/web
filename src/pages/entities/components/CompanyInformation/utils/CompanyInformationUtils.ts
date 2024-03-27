import MEGOffersFormStructure from '../config/MEGOffersFormStructure.json'
import LOOPOfferFormStructure from '../config/LOOPOfferFormStructure.json'
import type { FormSection, ProviderFormName } from '../CompanyInformationTypes'
import { fetchAccountReferential, fetchReferentialHubs } from '@/services/account'
import { getEnrichedFormSection } from '@/common/referentialUtils'

export const getOfferFormSections = (
  offerType: ProviderFormName,
): FormSection[] => {
  if (offerType === 'MEG') {
    return MEGOffersFormStructure as FormSection[]
  } else if (offerType === 'LOOP') {
    return LOOPOfferFormStructure as FormSection[]
  }
  return []
}

export async function getOfferFormStructure(
  offerType: ProviderFormName,
) {
  const formSections = getOfferFormSections(offerType)
  const accountReferential = await fetchAccountReferential()
  const referentialHubs = await fetchReferentialHubs()

  const enrichedFormSections: FormSection[] = formSections.map((formSection) => getEnrichedFormSection(
    accountReferential,
    referentialHubs,
    formSection,
  ))

  return enrichedFormSections
}

// This function is not used at the moment, but we plan to use it later to obtain a range based on a number
export const getStaffSizeRange = (staffSize: number) => {
  switch (true) {
    case staffSize >= 11 && staffSize <= 49:
      return '11-49'
    case staffSize >= 50 && staffSize <= 299:
      return '50-299'
    case staffSize >= 300:
      return '+300'
    default:
      return `${staffSize}`
  }
}

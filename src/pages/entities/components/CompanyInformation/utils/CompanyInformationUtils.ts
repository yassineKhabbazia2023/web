import MEGOffersFormStructure from '../config/MEGOffersFormStructure.json'
import LOOPOfferFormStructure from '../config/LOOPOfferFormStructure.json'
import type { FormSection, ProviderFormName } from '../CompanyInformationTypes'

export const getOfferFormStructure = (
  offerType: ProviderFormName,
): FormSection[] => {
  if (offerType === 'MEG') {
    return MEGOffersFormStructure as FormSection[]
  } else if (offerType === 'LOOP') {
    return LOOPOfferFormStructure as FormSection[]
  }
  return []
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

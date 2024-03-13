import InformationFormStructure from '../config/InformationFormStructure.json'
import type { FormSection } from '@/pages/entities/components/CompanyInformation/CompanyInformationTypes'

export const getInformationFormStructure = () => {
  return InformationFormStructure as FormSection[]
}

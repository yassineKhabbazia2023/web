import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'

export const BENEFICIARIES_I18N_PREFIX = 'entities.prospect.conformity.beneficiaries'

export const BENEFICIARY_DOCUMENT_TYPE_TRANSLATION_KEYS: Record<BeneficiaryDocumentType, string> = {
  [BeneficiaryDocumentType.CNI]: `${BENEFICIARIES_I18N_PREFIX}.documentTypes.cni`,
  [BeneficiaryDocumentType.PASSPORT]: `${BENEFICIARIES_I18N_PREFIX}.documentTypes.passport`,
}

export const BENEFICIARY_MAX_FILES_COUNT = 2

// Backend contract: a CNI requires both sides as two files, a passport is a single file
export const BENEFICIARY_REQUIRED_FILES_COUNT_BY_DOCUMENT_TYPE: Record<BeneficiaryDocumentType, number> = {
  [BeneficiaryDocumentType.CNI]: 2,
  [BeneficiaryDocumentType.PASSPORT]: 1,
}

export const BENEFICIARY_UPLOAD_ZONE_LABELS = {
  CNI_RECTO: `${BENEFICIARIES_I18N_PREFIX}.upload.cniRecto`,
  CNI_VERSO: `${BENEFICIARIES_I18N_PREFIX}.upload.cniVerso`,
  PASSPORT: `${BENEFICIARIES_I18N_PREFIX}.upload.passport`,
} as const

export const BENEFICIARIES_I18N_KEYS = {
  SAVE_SUCCESS: `${BENEFICIARIES_I18N_PREFIX}.saveSuccess`,
  SAVE_ERROR: `${BENEFICIARIES_I18N_PREFIX}.saveError`,
  VALIDATE_SUCCESS: `${BENEFICIARIES_I18N_PREFIX}.validateSuccess`,
  VALIDATE_ERROR: `${BENEFICIARIES_I18N_PREFIX}.validateError`,
} as const

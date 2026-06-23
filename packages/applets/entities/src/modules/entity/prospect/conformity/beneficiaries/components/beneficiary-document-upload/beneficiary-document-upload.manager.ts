import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import { BENEFICIARY_UPLOAD_ZONE_LABELS } from '../../beneficiaries.constants'

export class BeneficiaryDocumentUploadManager {
  /**
   * Get required upload zones for document type
   */
  static getRequiredZones(documentType: BeneficiaryDocumentType | null): Array<{
    index: number
    labelKey: string
  }> {
    if (documentType === BeneficiaryDocumentType.CNI) {
      return [
        { index: 0, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.CNI_RECTO },
        { index: 1, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.CNI_VERSO },
      ]
    }
    if (documentType === BeneficiaryDocumentType.PASSPORT) {
      return [
        { index: 0, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.PASSPORT },
      ]
    }
    return []
  }
}

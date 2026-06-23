import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import { BENEFICIARY_UPLOAD_ZONE_LABELS } from '../../beneficiaries.constants'
import { BeneficiaryDocumentUploadManager } from './beneficiary-document-upload.manager'

describe('beneficiary-document-upload.manager', () => {
  describe('getRequiredZones', () => {
    it('should return a recto and a verso zone for a CNI', () => {
      const zones = BeneficiaryDocumentUploadManager.getRequiredZones(BeneficiaryDocumentType.CNI)

      expect(zones).toEqual([
        { index: 0, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.CNI_RECTO },
        { index: 1, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.CNI_VERSO },
      ])
    })

    it('should return a single zone for a passport', () => {
      const zones = BeneficiaryDocumentUploadManager.getRequiredZones(BeneficiaryDocumentType.PASSPORT)

      expect(zones).toEqual([
        { index: 0, labelKey: BENEFICIARY_UPLOAD_ZONE_LABELS.PASSPORT },
      ])
    })

    it('should return no zones when the document type is null', () => {
      expect(BeneficiaryDocumentUploadManager.getRequiredZones(null)).toEqual([])
    })
  })
})

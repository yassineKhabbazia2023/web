import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import {
  BENEFICIARY_MAX_FILES_COUNT,
  BENEFICIARY_REQUIRED_FILES_COUNT_BY_DOCUMENT_TYPE,
} from './beneficiaries.constants'
import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import type { Beneficiary, BeneficiaryDocument } from '@entities/modules/entity/prospect/types'
import type { BeneficiaryFormState } from './beneficiaries.types'

export class BeneficiariesManager {
  static buildFormState(beneficiary: Beneficiary): BeneficiaryFormState {
    return {
      documentType: beneficiary.documentType ?? BeneficiaryDocumentType.CNI,
      firstName: beneficiary.firstName,
      lastName: beneficiary.lastName,
      files: [],
    }
  }

  /**
   * Get which document corresponds to zone based on document type
   * Zone index is 0-based, fileOrder is 1-based
   * For CNI: backend returns fileOrder - zone 0 = fileOrder 1 (recto), zone 1 = fileOrder 2 (verso)
   * For PASSPORT: backend doesn't return fileOrder - use array index directly
   */
  static getDocumentForZone(
    beneficiary: Beneficiary,
    zoneIndex: number,
  ): BeneficiaryDocument | undefined {
    // CNI: backend returns fileOrder, use it
    if (beneficiary.documentType === BeneficiaryDocumentType.CNI) {
      const targetFileOrder = zoneIndex + 1
      return beneficiary.documents.find((doc) => doc.fileOrder === targetFileOrder)
    }
    // Passport: no fileOrder from backend, use array index
    return beneficiary.documents[zoneIndex]
  }

  /**
   * Get number of required zones for document type
   */
  static getRequiredZonesCount(documentType: BeneficiaryDocumentType | null): number {
    if (documentType === null) {
      return 0
    }
    return BENEFICIARY_REQUIRED_FILES_COUNT_BY_DOCUMENT_TYPE[documentType]
  }

  // `formState.files` is zone-indexed and may contain empty slots (a zone whose
  // pending file was removed holds null), so `files.length` cannot be trusted
  static getSelectedFiles(formState: BeneficiaryFormState | undefined): File[] {
    return formState?.files.filter(isNotNullNorEmpty) ?? []
  }

  static getAttachmentsCount(
    beneficiary: Beneficiary,
    formState: BeneficiaryFormState | undefined,
  ): number {
    return beneficiary.documents.length + this.getSelectedFiles(formState).length
  }

  static canAddFiles(
    beneficiary: Beneficiary,
    formState: BeneficiaryFormState | undefined,
  ): boolean {
    return this.getAttachmentsCount(beneficiary, formState) < BENEFICIARY_MAX_FILES_COUNT
  }

  static isFormStateDirty(
    beneficiary: Beneficiary,
    formState: BeneficiaryFormState | undefined,
  ): boolean {
    if (formState === undefined) {
      return false
    }
    return this.getSelectedFiles(formState).length > 0
      || formState.documentType !== beneficiary.documentType
      || formState.firstName !== beneficiary.firstName
      || formState.lastName !== beneficiary.lastName
  }

  // The required count applies to the total of already uploaded documents
  // plus the locally selected files, so complementary uploads stay possible
  static hasRequiredFilesCount(
    beneficiary: Beneficiary,
    formState: BeneficiaryFormState | undefined,
  ): boolean {
    const documentType = formState?.documentType
    if (documentType === null || documentType === undefined) {
      return false
    }
    return this.getAttachmentsCount(beneficiary, formState)
      === BENEFICIARY_REQUIRED_FILES_COUNT_BY_DOCUMENT_TYPE[documentType]
  }

  /**
   * Check if beneficiary can save documents
   */
  static canSaveDocuments(
    beneficiary: Beneficiary,
    formState?: BeneficiaryFormState,
  ): boolean {
    if (formState?.documentType === null || formState?.documentType === undefined) {
      return false
    }
    return (
      this.getSelectedFiles(formState).length > 0
      && this.hasRequiredFilesCount(beneficiary, formState)
      && this.isFormStateDirty(beneficiary, formState)
    )
  }

  /**
   * Check if beneficiary is complete (has all required documents uploaded)
   */
  static isBeneficiaryComplete(beneficiary: Beneficiary): boolean {
    if (beneficiary.documentType === null) {
      return false
    }
    const requiredCount = BENEFICIARY_REQUIRED_FILES_COUNT_BY_DOCUMENT_TYPE[beneficiary.documentType]
    return beneficiary.documents.length === requiredCount
  }
}

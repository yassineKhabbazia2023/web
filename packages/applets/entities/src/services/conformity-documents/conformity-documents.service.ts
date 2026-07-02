import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { SupportingDocumentType } from '@entities/enums'
import type { SupportingDocumentsResponse, ConformityDocument } from './conformity-documents.types'
import type { PaginationResponse } from '@pulse/common/types'

export class ConformityDocumentsService {
  static async getConformityDocuments(prospectId: number) {
    const response = await api.gateway.get<PaginationResponse<ConformityDocument>>(
      `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/documents`,
    )

    return response.data.items
  }

  static async getSupportingDocuments(accountId: number): Promise<SupportingDocumentsResponse> {
    const response = await api.gateway.get<SupportingDocumentsResponse>(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/supporting-documents`,
    )
    return response.data
  }

  static uploadConformityDocument(
    prospectId: number,
    documentType: SupportingDocumentType,
    file: File,
  ): Promise<void> {
    const formData = new FormData()
    formData.append('documentType', documentType)
    formData.append('file', file)

    return api.gateway.post(
      `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/supporting-documents/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  static async getConformityDocumentContent(
    prospectId: number,
    documentId: number | string,
  ): Promise<Blob> {
    const response = await api.gateway.get<Blob>(
      `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/documents/${documentId}/content`,
      { responseType: 'blob' },
    )
    return response.data
  }
}

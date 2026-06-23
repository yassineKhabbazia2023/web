import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { ConformityDocumentType } from '@entities/enums'
import type { ConformityDocumentsResponse } from './conformity-documents.types'

export class ConformityDocumentsService {
  static async getConformityDocuments(prospectId: number): Promise<ConformityDocumentsResponse> {
    const response = await api.gateway.get<ConformityDocumentsResponse>(
      `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents`,
    )
    return response.data
  }

  static uploadConformityDocument(
    prospectId: number,
    documentType: ConformityDocumentType,
    file: File,
  ): Promise<void> {
    const formData = new FormData()
    formData.append('documentType', documentType)
    formData.append('file', file)

    return api.gateway.post(
      `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  static markConformityDocumentsAsCompleted(prospectId: number): Promise<void> {
    return api.gateway.put(
      `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/justificatifs/complete`,
    )
  }

  static async getConformityDocumentContent(
    prospectId: number,
    documentId: number | string,
  ): Promise<Blob> {
    const response = await api.gateway.get<Blob>(
      `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents/${documentId}/content`,
      { responseType: 'blob' },
    )
    return response.data
  }
}

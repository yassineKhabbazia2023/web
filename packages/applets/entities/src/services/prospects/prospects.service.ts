import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { PaginationResponse } from '@pulse/common/types'
import type {
  CollaboratorTargetRole,
  ProspectAccountRow,
  ProspectCreationDropdownContent,
  ProspectCreationPayload,
  ProspectEntitySearchResult,
} from '@entities/modules/wallet/types'
import { ProspectEligibilityStatus } from '@entities/modules/wallet/enums'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { BeneficiariesResponse, BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import { OnboardingStep } from '@entities/modules/entity/prospect/conformity/prospect-conformity.enums'
import type { OnboardingStepResponse } from './prospects.types'

export class ProspectsService {
  static async fetchProspectsAccounts(searchParams?: URLSearchParams): Promise<PaginationResponse<ProspectAccountRow>> {
    const query = searchParams ? `?${searchParams}` : ''
    const response = await api.gateway.get<PaginationResponse<ProspectAccountRow>>(
      `${API_PREFIXES.WALLET}/prospects/currentuser${query}`,
    )
    return response.data
  }

  static archiveProspect(prospectId: number): Promise<void> {
    return api.gateway.delete(`${API_PREFIXES.WALLET}/prospects/${prospectId}/currentuser`)
  }

  static async fetchProspectCreationDropdownContent(): Promise<ProspectCreationDropdownContent> {
    const response = await api.gateway.get<ProspectCreationDropdownContent>(
      `${API_PREFIXES.PROSPECT}/referential-infos`,
    )
    return response.data
  }

  static async searchEntities(query: string): Promise<ProspectEntitySearchResult[]> {
    const response = await api.gateway.get<ProspectEntitySearchResult[]>(
      `${API_PREFIXES.PROSPECT}/accounts/search`,
      { params: { query } },
    )
    return response.data ?? []
  }

  static async createProspect(payload: ProspectCreationPayload): Promise<void> {
    return api.gateway.post(`${API_PREFIXES.PROSPECT}/onboarding/currentuser`, payload)
  }

  static async checkProspectCreationEligibility(siret: string): Promise<ProspectEligibilityStatus> {
    const response = await api.gateway.get(`${API_PREFIXES.PROSPECT}/prospects/check-eligibility`, {
      params: { siret },
      validateStatus: status => status === 200 || status === 202 || status === 400,
    })

    if (response.status === 202) {
      return ProspectEligibilityStatus.ELIGIBLE
    }
    if (response.status === 200) {
      return ProspectEligibilityStatus.ALREADY_CLIENT
    }
    return ProspectEligibilityStatus.INVALID_SIRET
  }

  static async fetchCollaboratorTargetRoles(): Promise<CollaboratorTargetRole[]> {
    const response = await api.gateway.get<CollaboratorTargetRole[]>(`${API_PREFIXES.PROSPECT}/collab-roles`)
    return response.data ?? []
  }

  static async fetchCollaborators(search: string, pageSize: number = 100): Promise<Contact[]> {
    const response = await api.gateway.get(`${API_PREFIXES.PROSPECT}/contacts`, {
      params: { search, pageSize },
    })
    return response.data.items ?? []
  }

  static async fetchBeneficiaries(accountId: number): Promise<BeneficiariesResponse> {
    const response = await api.gateway.get<BeneficiariesResponse>(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/beneficiaries`,
    )
    return response.data
  }

  static async uploadBeneficiaryDocuments(
    accountId: number,
    beneficiaryId: string,
    documentType: BeneficiaryDocumentType,
    files: File[],
  ): Promise<void> {
    const formData = new FormData()
    formData.append('documentType', documentType)
    for (const file of files) {
      formData.append('files', file)
    }

    return api.gateway.post(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/beneficiaries/${beneficiaryId}/identity-documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  static deleteProspectDocument(
    accountId: number,
    documentId: number | string,
  ): Promise<void> {
    return api.gateway.delete(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/documents/${documentId}`,
    )
  }

  static async fetchOnboardingSteps(accountId: number): Promise<OnboardingStepResponse[]> {
    const response = await api.gateway.get<OnboardingStepResponse[]>(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/steps`,
    )
    return response.data
  }

  static completeOnboardingStep(accountId: number, step: OnboardingStep): Promise<void> {
    return api.gateway.put(
      `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/steps/complete`,
      { StepName: step },
    )
  }

  static async downloadCommercialProposal(entityId: number): Promise<Blob> {
    const response = await api.gateway.get<Blob>(
      `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/commercial-proposal/content`,
      { responseType: 'blob' },
    )
    return response.data
  }

  static uploadCommercialProposal(entityId: number, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    return api.gateway.post(
      `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/commercial-proposal`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }

  static async downloadEngagementLetter(entityId: number): Promise<Blob> {
    const response = await api.gateway.get<Blob>(
      `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/engagement-letter/content`,
      { responseType: 'blob' },
    )
    return response.data
  }

  static uploadEngagementLetter(entityId: number, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)

    return api.gateway.post(
      `${API_PREFIXES.PROSPECT}/onboarding/${entityId}/engagement-letter`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }
}

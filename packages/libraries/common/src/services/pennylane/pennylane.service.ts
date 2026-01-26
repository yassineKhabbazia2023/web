import { commonApi } from '@pulse/common'
import { logger } from '@pulse/toolbox'
import type { AxiosResponse } from 'axios'

import { API_PREFIXES } from '../../constants/api-prefixes'
import type { PennylaneRole, PennylaneDocumentQueryResult, PennylaneAvailableRole, PennylaneAccessResponse, PennylaneValidationPayload } from './pennylane.service.types'

export class PennylaneService {
  static readonly availableRolesByCompanyId: Record<string, Promise<AxiosResponse<PennylaneAvailableRole[], any>>> = {}

  static async getAvailableRoles(companyId: string, accountId: number | null, contactId?: number) {
    const url = `${API_PREFIXES.PENNYLANE}/roles`
    const params = {
      companyId,
      accountId,
      contactId,
    }

    if (PennylaneService.availableRolesByCompanyId[companyId] === undefined) {
      const apiCall = commonApi().gateway.get<PennylaneAvailableRole[]>(url, { params })
      PennylaneService.availableRolesByCompanyId[companyId] = apiCall
    }

    try {
      const { data } = await PennylaneService.availableRolesByCompanyId[companyId]

      return data
    } catch (e) {
      logger.error(e)
    }
  }

  static async createRole(role: PennylaneRole) {
    const url = `${API_PREFIXES.PENNYLANE}/role`

    await commonApi().gateway.post(url, role, { params: { accountId: role.accountId, contactId: role.contactId } })
  }

  static async getAccountContactRole(accountId: number, contactId: number) {
    const url = `${API_PREFIXES.PENNYLANE}/role/accounts/${accountId}/contacts/${contactId}`

    const { data } = await commonApi().gateway.get<PennylaneRole>(url)

    return data
  }

  static async getDocuments(
    accountNumber: string,
    accountId: number,
    page?: number,
    pageSize?: number,
    search?: string,
  ) {
    const queryParams = {
      accountNumber,
      page,
      pageSize,
      search,
    }
    const url = `${API_PREFIXES.PENNYLANE}/accounts/${accountId}/documents/currentuser`

    const { data } = await commonApi().gateway.get<PennylaneDocumentQueryResult>(url, {
      params: queryParams,
    })

    return data
  }

  static async getDocumentContent(accountNumber: string, accountId: number, documentId: number) {
    const queryParams = {
      accountNumber,
    }
    const url = `${API_PREFIXES.PENNYLANE}/accounts/${accountId}/documents/${documentId}/content/currentuser`

    const { data } = await commonApi().gateway.get(url, {
      params: queryParams,
      responseType: 'arraybuffer',
    })

    return data
  }

  static async checkPennylaneAccess(accountId: number): Promise<PennylaneAccessResponse> {
    const url = `${API_PREFIXES.PENNYLANE}/accounts/${accountId}/access/currentuser`

    const { data } = await commonApi().gateway.get<PennylaneAccessResponse>(url)

    return data
  }

  static async getTermsContent(accountId: number) {
    const url = `${API_PREFIXES.PENNYLANE}/terms/content`
    const queryParams = {
      accountId,
    }

    const { data } = await commonApi().gateway.get(url, {
      params: queryParams,
      responseType: 'arraybuffer',
    })

    return data
  }

  static async validatePennylaneAmendment(accountId: number, details: PennylaneValidationPayload) {
    const url = `${API_PREFIXES.PENNYLANE}/accounts/${accountId}/validation/currentuser`

    const { data } = await commonApi().gateway.post(url, details)

    return data
  }
}

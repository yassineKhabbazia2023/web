import { commonApi } from '@pulse/common'
import { logger } from '@pulse/core'
import type { AxiosResponse } from 'axios'
import { API_PREFIXES } from '../../constants/api-prefixes'
import type { PennylaneRole, PennylaneDocumentQueryResult, PennylaneAvailableRole } from './pennylane.service.types'

export class PennylaneService {
  static readonly availableRolesByCompanyId: Record<string, Promise<AxiosResponse<PennylaneAvailableRole[], any>>> = {}

  static async getAvailableRoles(companyId: string) {
    const url = `${API_PREFIXES.PENNYLANE}/roles`
    const params = {
      companyId,
    }

    if (PennylaneService.availableRolesByCompanyId[companyId] === undefined) {
      const apiCall = commonApi().gateway.get<PennylaneAvailableRole[]>(url, { params })
      PennylaneService.availableRolesByCompanyId[companyId] = apiCall
    }

    try {
      const { data } = await PennylaneService.availableRolesByCompanyId[companyId]

      return data
    } catch(e) {
      logger.error(e)
    }
  }

  static async createRole(role: PennylaneRole) {
    const url = `${API_PREFIXES.PENNYLANE}/role`

    await commonApi().gateway.post(url, role)
  }

  static async getAccountContactRole(accountId: number, contactId: number) {
    const url = `${API_PREFIXES.PENNYLANE}/role/accounts/${accountId}/contacts/${contactId}`

    const { data } = await commonApi().gateway.get<PennylaneRole>(url)

    return data
  }

  static async getDocuments(accountNumber: string) {
    const queryParams = {
      accountNumber,
    }
    const url = `${API_PREFIXES.PENNYLANE}/documents`

    const { data } = await commonApi().gateway.get<PennylaneDocumentQueryResult>(url, {
      params: queryParams,
    })

    return data
  }

  static async getDocumentContent(accountNumber: string, documentId: number) {
    const queryParams = {
      accountNumber,
    }
    const url = `${API_PREFIXES.PENNYLANE}/documents/${documentId}/content`

    const { data } = await commonApi().gateway.get(url, {
      params: queryParams,
      responseType: 'arraybuffer',
    })

    return data
  }
}

import { commonApi } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { PaginationResponse } from '@pulse/common/types'
import type { OperationStatus } from '@entities/enums'
import type { AccountOperations } from './registry.type'

export const fetchOperationsForAccount = async (accountId: number) => {
  const response = await commonApi().gateway.get(
    `${API_PREFIXES.REGISTRY}/operations`,
    {
      params: {
        accountId,
      },
    },
  )

  return response?.data
}

export async function fetchAccountOperations(page: number, pageSize: number, search?: string) {
  const response = await commonApi().gateway.get<PaginationResponse<AccountOperations>>(
    `${API_PREFIXES.REGISTRY}/currentuser/operations`,
    {
      params: {
        page,
        search,
        pageSize,
      },
    },
  )

  return response?.data
}

export const patchOperationStatus = async (
  operationId: number,
  status: OperationStatus.APPROVED | OperationStatus.REJECTED,
) => {
  await commonApi().gateway.patch(
    `${API_PREFIXES.REGISTRY}/operations/${operationId}/currentuser`,
    [
      {
        path: '/status',
        op: 'replace',
        value: status,
      },
    ],
  )
}

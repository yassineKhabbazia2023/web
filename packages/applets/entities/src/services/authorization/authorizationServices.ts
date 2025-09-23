import { commonApi } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import type { ContactType } from '@pulse/common/enums'
import type { AuthorizationConfig } from '@entities/common/components/ManageRightsDrawer/components/RightsList/RightsListTypes'

// User permissions
export const fetchAuthorizationsConfig = async (
  contactId: number,
  accountId: number | null,
): Promise<AuthorizationConfig[]> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.AUTHENTICATION}/authorizations/configuration`,
    {
      params: {
        contactId,
        accountId,
      },
    },
  )

  return data
}

export const updateUserPermissions = async (
  contactId: number,
  accountId: number | null,
  permissionCodes: string[],
) => {
  await commonApi().gateway.post(
    `${API_PREFIXES.AUTHENTICATION}/authorizations/configuration`,
    permissionCodes,
    {
      params: {
        contactId,
        accountId,
      },
    },
  )
}

// Account permissions
export const fetchAccountAuthorizationsConfig = async (
  accountId: number | null,
  type: ContactType,
): Promise<AuthorizationConfig[]> => {
  const { data } = await commonApi().gateway.get(
    `${API_PREFIXES.AUTHENTICATION}/authorizations/configuration/account`,
    {
      params: {
        accountId,
        type,
        configurable: true,
      },
    },
  )

  return data
}

export const updateAccountPermissions = async (
  accountId: number | null,
  type: ContactType,
  permissionCodes: string[],
) => {
  await commonApi().gateway.post(
    `${API_PREFIXES.AUTHENTICATION}/authorizations/configuration/account`,
    permissionCodes,
    {
      params: {
        accountId,
        type,
        configurable: true,
      },
    },
  )
}

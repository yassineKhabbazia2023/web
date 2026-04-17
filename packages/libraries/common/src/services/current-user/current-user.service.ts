import { logger } from '@pulse/toolbox'
import { api } from '../../api'
import type { UserContextInfo, UserInfo, UserWalletInformation } from '../../types/user.type'
import { API_PREFIXES } from '@pulse/common/constants'

export class CurrentUserService {
  static async getCurrentUserContext(): Promise<UserContextInfo | undefined> {
    try {
      const url = 'connect/api/get-user-information'
      const { data } = await api.gateway.get(url)
      const {
        contact,
        permissions,
        favoriteEntities,
      } = data

      const user: UserContextInfo = {
        contact: {
          ...contact,
          isCollab: contact.isCustomer === false,
        },
        permissions,
        favoriteEntities,
      }

      return user
    } catch (error) {
      logger.error('Unable to retrieve current-user', error)
    }
  }

  static async getCurrentUser(): Promise<UserInfo | undefined> {
    try {
      const url = 'contact/me'
      const { data } = await api.gateway.get(url)
      const { firstName, lastName, id, email, officeMobile, isCustomer, oldId, persona } = data

      const user: UserInfo = {
        firstName,
        lastName,
        id,
        email,
        officeMobile,
        isCollab: !isCustomer,
        oldId,
        persona,
        gigyaUserId: '',
        occupation: '',
        entities: {
          default: undefined,
        },
      }

      return user
    } catch (error) {
      logger.error('Unable to retrieve current-user', error)
    }
  }

  static async getUserWalletInformation() {
    const url = `${API_PREFIXES.WALLET}/infos/currentuser`
    const { data } = await api.gateway.get<UserWalletInformation>(url)

    return {
      prospectEntitiesCount: data.prospectEntitiesCount,
      regularEntitiesCount: data.regularEntitiesCount,
    }
  }
}

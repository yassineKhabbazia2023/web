import { logger } from '@pulse/core'
import api from '../../api'
import type { UserInfo } from '../../stores/types'

export class CurrentUserService {
  static async getCurrentUser(): Promise<UserInfo | undefined> {
    try {
      const url = 'contact/me'
      const { data } = await api().gateway.get(url)
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
}

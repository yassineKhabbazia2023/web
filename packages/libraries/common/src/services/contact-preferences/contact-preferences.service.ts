import { api } from '@pulse/common/api'

import { API_PREFIXES } from '../../constants/api-prefixes'
import { HTTP_RESPONSES } from '../../constants/http-responses-status'
import type { LastSelectedEntityResponse } from './contact-preferences.service.types'

const SELECTED_ACCOUNT_URL = `${API_PREFIXES.ACCOUNT}/preferences/selected-account`

export class ContactPreferencesService {
  /**
   * Fetches the entity the current contact selected last, persisted server-side.
   * Resolves undefined when the API answers 204 No Content: no selection yet, or the
   * selected entity is no longer accessible to the contact.
   */
  static async fetchLastSelectedEntity(): Promise<LastSelectedEntityResponse | undefined> {
    const { status, data } = await api.gateway.get<LastSelectedEntityResponse>(SELECTED_ACCOUNT_URL)

    if (status === HTTP_RESPONSES.NO_CONTENT) {
      return undefined
    }

    return data
  }

  /**
   * Persists the entity the current contact just selected. The account id travels in the
   * query string so the gateway can run its role check before reaching the Account API.
   */
  static async saveLastSelectedEntity(accountId: number): Promise<void> {
    await api.gateway.put(SELECTED_ACCOUNT_URL, undefined, { params: { accountId } })
  }
}

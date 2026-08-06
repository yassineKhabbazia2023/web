import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import type { CreationDropdownContent } from './creation-referential.types'

export class CreationReferentialService {
  static async fetchCreationDropdownContent(): Promise<CreationDropdownContent> {
    const response = await api.gateway.get<CreationDropdownContent>(
      `${API_PREFIXES.PROSPECT}/referential-infos`,
    )
    return response.data
  }
}

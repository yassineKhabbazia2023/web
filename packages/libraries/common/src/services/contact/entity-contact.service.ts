import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { CollaboratorRole, ContactType } from '@pulse/common/enums'
import type { PaginationResponse } from '@pulse/common/types'
import type { ContactResponseItem, EntityContact } from './contact.types'

// Rule: only CLP and AM contacts are considered as prospect contacts
// They are identified during prospect creation
const PROSPECT_CONTACT_ROLES = new Set<string>([CollaboratorRole.CLP, CollaboratorRole.AM])

export class EntityContactService {
  private static toEntityContact(item: ContactResponseItem): EntityContact {
    return {
      firstname: item.firstName,
      lastname: item.lastName,
      role: item.personaName ?? '',
      // Rule: if landPhone is available, use it, otherwise use mobilePhone, if both are not available, return an empty string
      phoneNumber: item.landPhone ?? item.mobilePhone ?? '',
      email: item.email,
    }
  }

  static async getProspectContacts(accountId: number): Promise<EntityContact[]> {
    try {
      const response = await api.gateway.get<PaginationResponse<ContactResponseItem>>(
        `${API_PREFIXES.CUSTOMER_WALLET}/accounts/${accountId}/contacts`,
        {
          params: {
            Type: ContactType.COLLABORATOR,
          },
        },
      )

      const items = response.data.items ?? []
      return items
        .filter(item => item.labels?.some(label => PROSPECT_CONTACT_ROLES.has(label.code)) === true)
        .map(EntityContactService.toEntityContact)
    } catch (error) {
      logger.error('Error fetching prospect contacts:', error)
      return []
    }
  }
}

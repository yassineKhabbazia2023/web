import { logger } from '@pulse/toolbox'
import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { CollaboratorRole, ContactType } from '@pulse/common/enums'
import type { PaginationResponse } from '@pulse/common/types'
import type { ContactLabel, ContactResponseItem, EntityContact, ProspectEntry } from './contact.types'

// Rule: only CLP and AM contacts are considered as prospect contacts (identified during prospect creation).
// `order` is the display order in the widget (account manager first, then account master).
// `roleKey` is the i18n key, forced on the front and translated in the contacts widget,
// independent of the backend collaboratorLabel.
const PROSPECT_CONTACT_ROLES: Readonly<Record<CollaboratorRole, { order: number, roleKey: string }>> = {
  [CollaboratorRole.CLP]: { order: 0, roleKey: 'widgets.contacts.roles.clp' },
  [CollaboratorRole.AM]: { order: 1, roleKey: 'widgets.contacts.roles.am' },
}

export class EntityContactService {
  private static getProspectLabel(item: ContactResponseItem): ContactLabel | undefined {
    return item.labels?.find(label => PROSPECT_CONTACT_ROLES[label.code as CollaboratorRole] !== undefined)
  }

  private static toEntityContact({ item, prospectLabel }: ProspectEntry): EntityContact {
    return {
      firstname: item.firstName,
      lastname: item.lastName,
      // Rule: the displayed role is the front-forced i18n key of the prospect label (CLP or AM) used to keep this contact
      role: PROSPECT_CONTACT_ROLES[prospectLabel.code as CollaboratorRole].roleKey,
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
        .map(item => ({ item, prospectLabel: EntityContactService.getProspectLabel(item) }))
        // Rule: only CLP and AM contacts are kept; the prospect label resolved here drives the role and the sort
        .filter((entry): entry is ProspectEntry => entry.prospectLabel !== undefined)
        // Rule: account manager (CLP) is displayed first, then account master (AM)
        .sort((first, second) =>
          PROSPECT_CONTACT_ROLES[first.prospectLabel.code as CollaboratorRole].order
          - PROSPECT_CONTACT_ROLES[second.prospectLabel.code as CollaboratorRole].order,
        )
        .map(EntityContactService.toEntityContact)
    } catch (error) {
      logger.error('Error fetching prospect contacts:', error)
      return []
    }
  }
}

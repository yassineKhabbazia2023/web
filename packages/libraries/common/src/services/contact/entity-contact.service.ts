import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { CollaboratorRole, ContactType } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'
import type { PaginationResponse } from '@pulse/common/types'
import type { ContactLabel, ContactResponseItem, EntityContact, ProspectEntry } from './contact.types'

// Rule: only CLP and AM contacts are considered as prospect contacts (identified during prospect creation).
// The value is the display order in the widget (account manager first, then account master).
const PROSPECT_CONTACT_ROLE_ORDER: Readonly<Record<CollaboratorRole, number>> = {
  [CollaboratorRole.CLP]: 0,
  [CollaboratorRole.AM]: 1,
}

export class EntityContactService {
  private static getProspectLabel(item: ContactResponseItem): ContactLabel | undefined {
    return item.labels?.find(label => PROSPECT_CONTACT_ROLE_ORDER[label.code as CollaboratorRole] !== undefined)
  }

  private static toEntityContact({ item, prospectLabel }: ProspectEntry, isCollab: boolean): EntityContact {
    return {
      firstname: item.firstName,
      lastname: item.lastName,
      // Rule: the displayed role is the backend label of the prospect contact:
      // collaboratorLabel for a collaborator user, customerLabel for a customer user.
      role: (isCollab ? prospectLabel.collaboratorLabel : prospectLabel.customerLabel) ?? '',
      // Rule: if landPhone is available, use it, otherwise use mobilePhone, if both are not available, return an empty string
      phoneNumber: isNotNullNorEmpty(item.landPhone) ? item.landPhone : (item.mobilePhone ?? ''),
      email: item.email,
    }
  }

  static async getProspectContacts(accountId: number): Promise<EntityContact[]> {
    try {
      const isCollab = useUserStore().isCollab === true

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
          PROSPECT_CONTACT_ROLE_ORDER[first.prospectLabel.code as CollaboratorRole]
          - PROSPECT_CONTACT_ROLE_ORDER[second.prospectLabel.code as CollaboratorRole],
        )
        .map(entry => EntityContactService.toEntityContact(entry, isCollab))
    } catch (error) {
      logger.error('Error fetching prospect contacts:', error)
      return []
    }
  }
}

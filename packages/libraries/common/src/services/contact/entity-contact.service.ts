import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { CollaboratorRole } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'
import type { ContactLabel, ContactResponseItem, EntityContact, ProspectEntry } from './contact.types'

// Rule: only CLP and AM contacts are considered as prospect contacts (identified during prospect creation).
// The value is the display order in the widget (account manager first, then account master).
const PROSPECT_CONTACT_ROLE_ORDER: Readonly<Record<CollaboratorRole, number>> = {
  [CollaboratorRole.CLP]: 0,
  [CollaboratorRole.AM]: 1,
}

const ROLE_LABEL_SEPARATOR = ' | '

export class EntityContactService {
  private static getProspectLabels(item: ContactResponseItem): ContactLabel[] {
    return item.labels
      ?.filter(label => PROSPECT_CONTACT_ROLE_ORDER[label.code as CollaboratorRole] !== undefined)
      .sort((first, second) =>
        PROSPECT_CONTACT_ROLE_ORDER[first.code as CollaboratorRole]
        - PROSPECT_CONTACT_ROLE_ORDER[second.code as CollaboratorRole],
      ) ?? []
  }

  private static getRoleLabel(prospectLabel: ContactLabel, isCollab: boolean): string {
    return (isCollab ? prospectLabel.collaboratorLabel : prospectLabel.customerLabel) ?? ''
  }

  private static toEntityContact({ item, prospectLabels }: ProspectEntry, isCollab: boolean): EntityContact {
    const roleLabels = prospectLabels
      .map(label => EntityContactService.getRoleLabel(label, isCollab))
      .filter(label => label !== '')

    // Deduplicate by displayed label, not by code, to avoid duplicated UX labels such as "Responsable | Responsable".
    const distinctRoleLabels = [
      ...new Set(roleLabels.length > 0 ? roleLabels : ['']),
    ]

    return {
      firstname: item.firstName,
      lastname: item.lastName,
      // Rule: the displayed role is the backend label of the prospect contact:
      // collaboratorLabel for a collaborator user, customerLabel for a customer user.
      role: distinctRoleLabels.join(ROLE_LABEL_SEPARATOR),
      // Rule: if landPhone is available, use it, otherwise use mobilePhone, if both are not available, return an empty string
      phoneNumber: isNotNullNorEmpty(item.landPhone) ? item.landPhone : (item.mobilePhone ?? ''),
      email: item.email,
    }
  }

  static async getProspectContacts(accountId: number): Promise<EntityContact[]> {
    try {
      const isCollab = useUserStore().isCollab === true

      const response = await api.gateway.get<ContactResponseItem[]>(
        `${API_PREFIXES.ACCOUNT}/prospects/${accountId}/contacts/currentuser`,
      )

      const items = response.data ?? []
      return items
        .map(item => ({ item, prospectLabels: EntityContactService.getProspectLabels(item) }))
        // Rule: only CLP and AM labels are kept; the prospect label resolved here drives the role and the sort
        .filter((entry): entry is ProspectEntry => entry.prospectLabels.length > 0)
        // Rule: account manager (CLP) is displayed first, then account master (AM)
        .sort((first, second) =>
          PROSPECT_CONTACT_ROLE_ORDER[first.prospectLabels[0].code as CollaboratorRole]
          - PROSPECT_CONTACT_ROLE_ORDER[second.prospectLabels[0].code as CollaboratorRole],
        )
        .map(entry => EntityContactService.toEntityContact(entry, isCollab))
    } catch (error) {
      logger.error('Error fetching prospect contacts:', error)
      return []
    }
  }
}

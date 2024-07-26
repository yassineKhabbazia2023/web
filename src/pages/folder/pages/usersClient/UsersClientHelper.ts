import type { ClientContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import type { ExtendedUser } from './UsersClientTypes.ts'
import type { Contact } from '@/common/types'
import { getInitials } from '@/helper'

export function formatItemsFromApi(
  items: Contact[],
  currentUserId?: number | undefined,
  principalContacts: ClientContact[] = [],
) {
  return items.map<ExtendedUser>((item) => {
    const { firstName, lastName, email, personaName, contactId, status } = item
    const isSignatory = principalContacts.some(
      ({ contactId }) => contactId === item.contactId,
    )

    const extendedUser: ExtendedUser = {
      ...item,
      initials: getInitials(firstName, lastName),
      fullName: `${firstName} ${lastName}`,
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email.toLowerCase(),
      status,
      isOwner: personaName === 'ADMIN/Dirigeant',
      isLoggedUser: contactId === currentUserId,
      isSignatory,
    }

    return extendedUser
  })
}

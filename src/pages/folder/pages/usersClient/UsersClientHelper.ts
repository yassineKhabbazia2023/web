import type { ClientContact } from '@/pages/entities/components/PrincipalContact/PrincipalContactTypes'
import { getInitials } from '@/helper'
import type { IExtendedUser } from './types.ts'
import type { IUserFromApi } from './types'

export function formatItemsFromApi(
  items: IUserFromApi[],
  currentUserId: number | undefined,
  principalContacts: ClientContact[],
) {
  return items
    .map<IExtendedUser>((item) => {
      const {
        firstName,
        lastName,
        email,
        personaName,
        contactId,
      } = item
      const isSignatory = principalContacts
        .some(({ contactId }) => contactId === item.contactId)

      const extendedUser: IExtendedUser = {
        ...item,
        initials: getInitials(firstName, lastName),
        fullName: `${firstName} ${lastName}`,
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        email: email.toLowerCase(),
        isOwner: personaName === 'ADMIN/Dirigeant',
        isLoggedUser: contactId === currentUserId,
        isSignatory,
      }

      return extendedUser
    })
}

import { getInitials } from '@/helper'
import type { IExtendedUser } from './types.ts'
import type { IUserFromApi } from './types'

export function formatItemsFromApi(
  items: IUserFromApi[],
  currentUserId: number | undefined,
) {
  return items
    .map<IExtendedUser>(({
      firstName,
      lastName,
      personaName,
      contactId,
      ...rest
    }) => ({
      ...rest,
      initials: getInitials(firstName, lastName),
      firstName,
      lastName,
      isOwner: personaName === 'ADMIN/Dirigeant',
      fullName: `${firstName} ${lastName}`,
      isLoggedUser: contactId === currentUserId,
      personaName,
      contactId,
    }))
}

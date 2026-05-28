import { logger } from '@pulse/toolbox'

import type { Contact, ExtendedUser } from '@entities/types'
import type { AccountSignatories } from '@entities/services/account/account.type'

export const handleRequestError = (action: string, error: any) => {
  logger.error(`Error ${action}:`, error)
}
export const getInitials = (firstName: string|undefined, lastName: string|undefined) => {
  const firstInitial = firstName?.at(0)?.toUpperCase() ?? ''
  const secondInitial = lastName?.at(0)?.toUpperCase() ?? ''
  return `${firstInitial}${secondInitial}`
}

/**
 * Simple function that extracts values from an object using dot-separate
 * keys and constructs a new object with these keys and values.
 *
 * Example : {'a.b': 22} ===> {a: {b: 22}}
 */
export const generateObject = (
  parentKey: string,
  mainObject: Record<string, string | number>,
) => {
  const generatedObject: any = { [parentKey]: {} }

  // To retrieve only the entries with keys that contain the parent key
  const filteredEntries = Object.fromEntries(
    Object.entries(mainObject).filter(([key]) => key.includes(`${parentKey}.`)),
  )
  // To construct our new object
  for (const [key, value] of Object.entries(filteredEntries)) {
    const childKey = key.split('.')[1]
    generatedObject[parentKey][childKey] = value
  }

  return generatedObject
}

export const formatDateToLocale = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}


const SORT_VALUES = new Map<string, string>([
  ['createdAt', 'created'],
  ['role', 'persona'],
  ['email', 'email'],
  ['persona', 'persona'],
  ['office', 'office'],
])
export const returnSortQueryField = (columnProp: string, descending: boolean) => {
  const sortPrefix = descending === true ? '-' : '+'
  const sortValue = SORT_VALUES.get(columnProp) ?? 'lastname'

  return `${sortPrefix}${sortValue}`
}

export function formatItemsFromApi(
  items: Contact[],
  currentUserId?: number | undefined,
  principalContacts: AccountSignatories[] = [],
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

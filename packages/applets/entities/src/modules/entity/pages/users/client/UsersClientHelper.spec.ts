import { describe, expect, it } from 'vitest'
import { formatItemsFromApi } from './UsersClientHelper'
import { generateContactsMock } from '@entities/__mocks__/contact.mocks'
import type { ClientContact } from '@entities/types'
import { ContactType } from '@pulse/common/enums'

const expectedItems = [{
  contactId: 1,
  creationDate: '2024-03-07',
  email: 'email@testemail.com0',
  firstName: 'firstname0',
  globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
  fullName: 'firstName0 lastName',
  initials: 'FL',
  isLoggedUser: false,
  isOwner: false,
  isSignatory: false,
  lastName: 'lastname',
  personaName: 'Customer',
  type: ContactType.CUSTOMER,
  status: 'Declared',
}, {
  globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
  contactId: 2,
  creationDate: '2024-03-07',
  email: 'email@testemail.com1',
  firstName: 'firstname1',
  fullName: 'firstName1 lastName',
  initials: 'FL',
  isLoggedUser: false,
  isOwner: false,
  isSignatory: true,
  lastName: 'lastname',
  personaName: 'Customer',
  type: ContactType.CUSTOMER,
  status: 'Declared',
}, {
  globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
  contactId: 3,
  creationDate: '2024-03-07',
  email: 'email@testemail.com2',
  firstName: 'firstname2',
  fullName: 'firstName2 lastName',
  initials: 'FL',
  isLoggedUser: true,
  isOwner: false,
  isSignatory: false,
  lastName: 'lastname',
  personaName: 'Customer',
  type: ContactType.CUSTOMER,
  status: 'Declared',
}]

describe('test UsersClientHelper', () => {
  describe('formatItemsFromApi', () => {
    it('returns formatted items', () => {
      const contactsList = generateContactsMock({
        numberOfContactsToReturn: 3,
        contactsTotalCount: 16,
        numberOfPages: 2,
        currentPage: 1,
      })

      const { data: mockedData } = contactsList
      const { items } = mockedData

      const principalContacts: ClientContact[] = [{
        contactId: items[1].contactId,
        globalContactId: '231231-34234',
        firstName: 'Signa',
        lastName: 'Tory',
        email: 'sign@test.fr',
        status: 'status',
        personaName: 'person Name',
        creationDate: '2024-03-25',
      }]

      const currentUserId = items[2].contactId
      const formattedItems = formatItemsFromApi(items, currentUserId, principalContacts)
      expect(formattedItems).toStrictEqual(expectedItems)
    })

    it('returns formatted items when principalContact is empty and currentUser is undefined', () => {
      const contactsList = generateContactsMock({
        numberOfContactsToReturn: 1,
        contactsTotalCount: 16,
        numberOfPages: 2,
        currentPage: 1,
      })

      const { data: mockedData } = contactsList
      const { items } = mockedData

      const formattedItems = formatItemsFromApi(items)
      expect(formattedItems).toStrictEqual([expectedItems[0]])
    })
  })
})

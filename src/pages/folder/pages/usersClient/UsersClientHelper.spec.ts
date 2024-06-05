import { describe, expect, it } from 'vitest'
import { formatItemsFromApi } from './UsersClientHelper'
import { generateContactsMock } from '@/../tests/mocks/contactsDataMock'

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

      const currentUserId = items[2].contactId
      const expectedItems = [{
        contactId: 1,
        creationDate: '2024-03-07',
        email: 'email@testemail.com0',
        firstName: 'firstName0',
        fullName: 'firstName0 lastName',
        initials: 'FL',
        isLoggedUser: false,
        isOwner: false,
        lastName: 'lastName',
        personaName: 'Customer',
      }, {
        contactId: 2,
        creationDate: '2024-03-07',
        email: 'email@testemail.com1',
        firstName: 'firstName1',
        fullName: 'firstName1 lastName',
        initials: 'FL',
        isLoggedUser: false,
        isOwner: false,
        lastName: 'lastName',
        personaName: 'Customer',
      }, {
        contactId: 3,
        creationDate: '2024-03-07',
        email: 'email@testemail.com2',
        firstName: 'firstName2',
        fullName: 'firstName2 lastName',
        initials: 'FL',
        isLoggedUser: true,
        isOwner: false,
        lastName: 'lastName',
        personaName: 'Customer',
      }]
      const formattedItems = formatItemsFromApi(items, currentUserId)
      expect(formattedItems).toStrictEqual(expectedItems)
    })
  })
})

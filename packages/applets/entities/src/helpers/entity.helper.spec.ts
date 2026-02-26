import { describe, it, expect } from 'vitest'
import {
  formatDateToLocale,
  formatItemsFromApi,
  generateObject,
  getInitials,
  returnSortQueryField,
} from './entity.helper'
import { generateContactsMock } from '@entities/__mocks__/contact.mocks'
import type { AccountSignatories } from '@entities/services/account/account.type'
import { ContactType } from '@pulse/common/enums'

describe('getInitials', () => {
  it.each([
    ['gojo', 'satoru', 'GS'],
    ['Gojo', '', 'G'],
    ['', 'Satoru', 'S'],
    [undefined, 'Gojo', 'G'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns correct initials (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const initials = getInitials(firstName, lastName)
      expect(initials).toBe(expected)
    },
  )
})

describe('generateObject', () => {
  it('should construct and return the correct object', () => {
    const expectedObject = { a: { b: 5 } }
    const generatedObject = generateObject('a', { 'a.b': 5 })
    expect(generatedObject).toStrictEqual(expectedObject)
  })
})

describe('formatDateToLocale', () => {
  it('should return the date formatted according to the local format', () => {
    const expectedDate = '19/02/2024'
    const dateString = formatDateToLocale('2024-02-19T07:25:58.8491912')
    expect(expectedDate).toStrictEqual(dateString)
  })
})

describe('should return the correct sort query field', () => {
  const testCases = [
    ['user', false, '+lastname'],
    ['user', true, '-lastname'],
    ['email', false, '+email'],
    ['email', true, '-email'],
    ['persona', false, '+persona'],
    ['persona', true, '-persona'],
    ['createdAt', false, '+created'],
    ['createdAt', true, '-created'],
    ['role', false, '+persona'],
    ['role', true, '-persona'],
    ['office', false, '+office'],
    ['office', true, '-office'],
  ]

  it.each(testCases)(
    'helper mapping with "%s"',
    (columnLabel, order, expectedResult) => {
      const actualResult = returnSortQueryField(columnLabel as string, order as boolean)
      expect(actualResult).toBe(expectedResult)
    },
  )
})

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

    const principalContacts: AccountSignatories[] = [{
      contactId: items[1].contactId,
      contactGlobalUniqueId: '231231-34234',
      firstName: 'Signa',
      lastName: 'Tory',
      email: 'sign@test.fr',
      status: 'status',
      personaName: 'person Name',
      office: 'Paris',
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

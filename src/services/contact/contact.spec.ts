import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '@/common/config/services'
import { getMockedCollaborators, getMockedCustomer } from './contactMocks'
import { getCollaborators, getContactById, patchContact } from '.'
import { omit } from 'lodash-es'
import type { PatchContactPayload } from './contactTypes'

const mockedCollaborators = getMockedCollaborators()

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn().mockImplementation((url) => {
          return handleGetApiMock(url)
        }),
        patch: vi.fn().mockImplementation((url, payload, contentType) => {
          return handlePatchApiMock(url, payload, contentType)
        }),
      },
    }),
  }
})

const mockedContact = getMockedCustomer()
const handleGetApiMock = (url: string) => {
  if (url === `${API_PREFIXES.CONTACT}/contacts`) {
    return Promise.resolve({
      data: {
        items: mockedCollaborators,
      },
    })
  } else if (url === `${API_PREFIXES.CUSTOMER_WALLET}/contacts/${mockedContact[0].id}`) {
    return Promise.resolve({
      data: mockedContact[0],
    })
  }
  return Promise.reject(new Error('rejected'))
}
const handlePatchApiMock = (url: string, _:object, __:object) => {
  if (url === `${API_PREFIXES.CUSTOMER_WALLET}/contacts/${mockedContact[0].id}`) {
    return Promise.resolve({
      data: mockedContact[0],
    })
  }
}

describe('contact', () => {
  describe('getCollaborators', () => {
    it('should return list of collaborators', async () => {
      const collaborators = await getCollaborators()

      expect(collaborators).toStrictEqual(mockedCollaborators)
    })
  })
  describe('getContactById', () => {
    it('should return the contact with the given id', async () => {
      const contact = await getContactById(mockedContact[0].id)

      expect(contact).toStrictEqual(mockedContact[0])
    })
  })
  describe('patchContact', () => {
    it('should return the patched contact with given payload', async () => {
      const patchPayload = omit(mockedContact[0], 'id', 'persona', 'email', 'type', 'office') as PatchContactPayload
      const contact = await patchContact(1, patchPayload)

      expect(contact).toStrictEqual(mockedContact[0])
    })
  })
})

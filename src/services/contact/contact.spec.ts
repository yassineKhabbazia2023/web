import { describe, it, vi, expect } from 'vitest'
import { API_PREFIXES } from '../config'
import { getMockedCollaborators } from './contactMocks'
import { getCollaborators } from '.'

const mockedCollaborators = getMockedCollaborators()

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      gateway: {
        get: vi.fn().mockImplementation((url) => {
          return url === `${API_PREFIXES.CONTACT}/contacts`
            ? Promise.resolve({
              data: {
                items: mockedCollaborators,
              },
            })
            : Promise.reject(new Error('rejected'))
        }),
      },
    }),
  }
})

describe('contact', () => {
  describe('getCollaborators', () => {
    it('should return list of collaborators', async () => {
      const collaborators = await getCollaborators()

      expect(collaborators).toStrictEqual(mockedCollaborators)
    })
  })
})

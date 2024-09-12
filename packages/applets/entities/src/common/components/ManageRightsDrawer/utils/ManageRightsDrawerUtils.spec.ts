import { describe, it, expect } from 'vitest'
import { getMockedAuthorizationState, getPermissionCodes } from '.'

// Mocks
const mockedAuthorizationState = getMockedAuthorizationState()

// Expectations
const expectedPermissionCodeList = [
  'CLUSER001',
  'CLUSER002',
  'CLUSER003',
  'CLGED0001',
  'CLGED0002',
]

describe('manageRightsDrawerUtils', () => {
  describe('getPermissionCodes', () => {
    it('should return the permission code list', () => {
      const permissionCodes = getPermissionCodes(mockedAuthorizationState)

      expect(permissionCodes).toStrictEqual(expectedPermissionCodeList)
    })
  })
})

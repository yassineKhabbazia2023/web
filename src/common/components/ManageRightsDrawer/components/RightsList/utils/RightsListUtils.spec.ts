import { it, expect, describe } from 'vitest'
import {
  getAuthorizationsConfigMapped,
  getAuthorizationState,
  getMockedAuthorizationState,
  getMockedRightCategories,
} from '.'
import { getMockedAuthorizationsConfig } from '../RightsListMocks'

// Mocks
const mockedRightCategories = getMockedRightCategories()
const mockedAuthorizationState = getMockedAuthorizationState()
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

// Expectations
const expectedAuthorizationState = {
  actions: ['COLUSER001', 'COLUSER002'],
  isActive: true,
}
const expectedAuthorizationsConfigMapped = [
  {
    category: {
      code: 'CLTGESTION',
      label: 'File management',
    },
    actions: mockedAuthorizationsConfig[0].actions,
  },
  {
    category: {
      code: 'COLADMIN',
      label: 'Administration',
    },
    actions: mockedAuthorizationsConfig[1].actions,
  },
  {
    category: {
      code: 'COLMIRROIR',
      label: 'Customer mirror view',
    },
    actions: mockedAuthorizationsConfig[2].actions,
  },
]

describe('rightsListUtils', () => {
  describe('getAuthorizationsConfigMapped', () => {
    it('should return an authorization config where each category is mapped with its corresponding label', () => {
      const authorizationsConfigMapped = getAuthorizationsConfigMapped(
        mockedAuthorizationsConfig,
        mockedRightCategories,
      )

      expect(authorizationsConfigMapped).toStrictEqual(
        expectedAuthorizationsConfigMapped,
      )
    })
  })
  describe('getAuthorizationState', () => {
    it('should return a list of enabled actions along with their isActive state', () => {
      const authorizationState = getAuthorizationState(mockedAuthorizationState)

      expect(authorizationState).toStrictEqual(expectedAuthorizationState)
    })
  })
})

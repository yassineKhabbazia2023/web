import { it, expect, describe } from 'vitest'
import { getMockedAuthorizationsConfig } from '@entities/__mocks__/permissions.mock'
import { getAuthorizationsConfigMapped, getAuthorizationState } from '.'

// Mocks
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

const mockedRightCategories = {
  COLADMIN: 'Administration',
  CLTGESTION: 'File management',
  COLMIRROIR: 'Customer mirror view',
}

const mockedActions = [
  {
    actionId: 21,
    code: 'COLUSER001',
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: true,
  },
  {
    actionId: 22,
    code: 'COLUSER002',
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: true,
  },
  {
    actionId: 23,
    code: 'COLUSER003',
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: false,
  },
  {
    actionId: 25,
    code: 'COLUSER004',
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: false,
  },
]

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
      const authorizationState = getAuthorizationState(mockedActions)

      expect(authorizationState).toStrictEqual(expectedAuthorizationState)
    })
  })
})

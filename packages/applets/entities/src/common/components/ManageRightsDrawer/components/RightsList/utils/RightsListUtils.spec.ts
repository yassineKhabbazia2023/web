import { it, expect, describe } from 'vitest'
import { getMockedAuthorizationsConfig } from '@entities/__mocks__/permissions.mocks'
import { getAuthorizationsConfigMapped, getAuthorizationState, getEnrichedActions } from '.'
import type { Action, EnrichedAction } from '../RightsListTypes'

// Mocks
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()

const mockedRightCategories = {
  COLADMIN: 'Administration',
  CLTGESTION: 'File management',
  COLMIRROIR: 'Customer mirror view',
}

const mockedActions: Action[] = [
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

const additionalInfoMock = 'additional info mock'
const tooltipByActionCode: Record<Action['code'], string> = {
  [mockedActions[0].code]: additionalInfoMock,
}


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
    actions: getEnrichedActions(mockedAuthorizationsConfig[0].actions, tooltipByActionCode),
  },
  {
    category: {
      code: 'COLADMIN',
      label: 'Administration',
    },
    actions: getEnrichedActions(mockedAuthorizationsConfig[1].actions, tooltipByActionCode),
  },
  {
    category: {
      code: 'COLMIRROIR',
      label: 'Customer mirror view',
    },
    actions: getEnrichedActions(mockedAuthorizationsConfig[2].actions, tooltipByActionCode),
  },
]

describe('rightsListUtils', () => {
  describe('getAuthorizationsConfigMapped', () => {
    it('should return an authorization config where each category is mapped with its corresponding label', () => {
      const authorizationsConfigMapped = getAuthorizationsConfigMapped(
        mockedAuthorizationsConfig,
        mockedRightCategories,
        tooltipByActionCode,
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
  describe('getEnrichedActions', () => {
    it('should return a list enriched actions', () => {
      const expectedEnrichedActions: EnrichedAction[] = [{
        ...mockedActions[0],
        tooltip: additionalInfoMock,
      }, {
        ...mockedActions[1],
        tooltip: '',
      }, {
        ...mockedActions[2],
        tooltip: '',
      }, {
        ...mockedActions[3],
        tooltip: '',
      }]
      const enrichedActions = getEnrichedActions(mockedActions, tooltipByActionCode)

      expect(enrichedActions).toStrictEqual(expectedEnrichedActions)
    })
  })
})

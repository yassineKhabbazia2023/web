import { it, expect, describe } from 'vitest'
import { getMockedAuthorizationsConfig, getMockedAuthorizationState } from '@entities/__mocks__/permissions.mocks'
import { getMockedPennylaneAvailableRole } from '@pulse/common/mocks'
import type { Action, EnrichedAction } from '../RightsListTypes'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_ACTION } from '@pulse/common/constants'

import {
  getAuthorizationsConfigMapped,
  getAuthorizationState,
  getEnrichedActions,
  getPennylaneDropdownOptions,
  getHasAction,
  getDropdownsByActionCode,
} from '.'

// Mocks
const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()
const authorizationStateMock = getMockedAuthorizationState()
const pennylanedropdownOptionsMock: PDropdownOption[] = [{
  pValue: 'a',
  pLabel: 'admin',
}]

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

  describe('getPennylaneDropdownOptions(', () => {
    const pennylaneAvailableRolesMock = [
      getMockedPennylaneAvailableRole(),
      getMockedPennylaneAvailableRole({
        code: 'compta',
        label: 'comptable',
        description: 'comptable',
      }),
    ]
    const expectedPennylanedropdownOptions = [{
      pValue: pennylaneAvailableRolesMock[0].code,
      pLabel: pennylaneAvailableRolesMock[0].label,
      pDescription: pennylaneAvailableRolesMock[0].description,
    }, {
      pValue: pennylaneAvailableRolesMock[1].code,
      pLabel: pennylaneAvailableRolesMock[1].label,
      pDescription: pennylaneAvailableRolesMock[1].description,
    }]
    const tests = [{
      pennylaneAvailableRoles: pennylaneAvailableRolesMock,
      expectedPennylanedropdownOptions,
    }, {
      pennylaneAvailableRoles: undefined,
      expectedPennylanedropdownOptions: [],
    }]
    it.each(tests)('should return', ({
      pennylaneAvailableRoles,
      expectedPennylanedropdownOptions,
    }) => {
      const pennylanedropdownOptions = getPennylaneDropdownOptions(pennylaneAvailableRoles)
      expect(pennylanedropdownOptions).toStrictEqual(expectedPennylanedropdownOptions)
    })
  })

  describe('getHasAction', () => {
    const tests = [{
      actionCode: 'foo',
      expectedHasAction: false,
    }, {
      actionCode: authorizationStateMock['CLTGESTION'].actions[0],
      expectedHasAction: true,
    }]
    it.each(tests)('should return $expectedHasAction when actionCode equals $actionCode', ({
      actionCode,
      expectedHasAction,
    }) => {
      const hasAction = getHasAction(
        authorizationStateMock,
        actionCode,
      )

      expect(hasAction).toBe(expectedHasAction)
    })
  })

  describe('getDropdownsByActionCode', () => {
    const pennylaneDropdownPlaceholderMock = 'Choisir un rôle'
    const pennylaneDropdownMockUnvisible = {
      isVisible: false,
      placeholder: pennylaneDropdownPlaceholderMock,
      options: pennylanedropdownOptionsMock,
    }

    const tests = [{
      hasPennylane: false,
      expectedDropdownsByActionCode: {
        [PERMISSION_ACTION.ACCESS_PENNYLANE]: pennylaneDropdownMockUnvisible,
      },
    }, {
      hasPennylane: true,
      expectedDropdownsByActionCode: {
        [PERMISSION_ACTION.ACCESS_PENNYLANE]: {
          ...pennylaneDropdownMockUnvisible,
          isVisible: true,
        },
      },
    }]
    it.each(tests)('should return $expectedHasAction when actionCode equals $actionCode', ({
      hasPennylane,
      expectedDropdownsByActionCode,
    }) => {
      const hasAction = getDropdownsByActionCode(
        hasPennylane,
        pennylanedropdownOptionsMock,
        pennylaneDropdownPlaceholderMock,
      )

      expect(hasAction).toStrictEqual(expectedDropdownsByActionCode)
    })
  })
})

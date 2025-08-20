import { getMockedAuthorizationsConfig, getMockedAuthorizationState } from '@entities/__mocks__/permissions.mocks'
import type { Action } from '../RightsListTypes'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/common/constants/rights-management.const'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'

import {
  getAuthorizationsConfigMapped,
  getAuthorizationState,
  getPennylaneDropdownOptions,
  getHasAction,
  getDropdownsByActionCode,
  getTooltipByActionCode,
} from '.'
import { getMockedPennylaneAvailableRole } from '@pulse/common/mocks'

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
    code: CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: true,
  },
  {
    actionId: 22,
    code: CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: true,
  },
  {
    actionId: 23,
    code: CollaboratorPermission.RETIRER_UTILISATEUR_CLIENT_DOSSIER,
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: false,
  },
  {
    actionId: 25,
    code: CollaboratorPermission.ACCEDER_CALENDRIER,
    name: 'Update user',
    label: 'Modifier les droits',
    enabled: false,
  },
]


// Expectations
const expectedAuthorizationState = {
  actions: [
    CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ],
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
      actionCode: CustomerPermission.ACCEDER_OUTIL_SILAE,
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
        [PERMISSION_PENNYLANE_CUSTOMER]: pennylaneDropdownMockUnvisible,
      },
    }, {
      hasPennylane: true,
      expectedDropdownsByActionCode: {
        [PERMISSION_PENNYLANE_CUSTOMER]: {
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

  describe('getTooltipByActionCode', () => {
    const label = 'tooltip label'
    const tooltipByActionCodeWithFeature = {
      [PERMISSION_PENNYLANE_CUSTOMER]: label,
    }
    const tooltipByActionCodeWithoutFeature = {}
    const tests = [{
      hasFeature: true,
      expectedTooltipByActionCode: tooltipByActionCodeWithFeature,
    }, {
      hasFeature: false,
      expectedTooltipByActionCode: tooltipByActionCodeWithoutFeature,
    }]

    it.each(tests)('should return expected object', ({
      hasFeature,
      expectedTooltipByActionCode,
    }) => {
      const tooltipByActionCode = getTooltipByActionCode({
        hasFeature,
        label,
      })
      expect(tooltipByActionCode).toStrictEqual(expectedTooltipByActionCode)
    })
  })
})

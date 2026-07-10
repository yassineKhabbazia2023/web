import { getMockedAuthorizationsConfig, getMockedAuthorizationState } from '@entities/__mocks__/permissions.mocks'
import type { Action } from '@entities/types'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { PERMISSION_PENNYLANE_CUSTOMER } from '@entities/constants'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'

import {
  getAuthorizationsConfigMapped,
  getAuthorizationState,
  getPennylaneDropdownOptions,
  getHasAction,
  getDropdownsByActionCode,
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
      const authorizationsConfigMapped = getAuthorizationsConfigMapped({
        authorizationsConfig: mockedAuthorizationsConfig as any,
        rightsCategories: mockedRightCategories,
        customLabels: {},
      })

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

    it('should include defaultCheckedRights that exist in available actions', () => {
      const authorizationState = getAuthorizationState(
        mockedActions,
        [
          CollaboratorPermission.ACCEDER_CALENDRIER, // exists in actions but disabled
          CollaboratorPermission.RETIRER_UTILISATEUR_CLIENT_DOSSIER, // exists but disabled
          'NON_EXISTENT_CODE' as any, // does not exist in actions
        ],
      )

      expect(authorizationState).toStrictEqual({
        actions: [
          CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
          CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
          CollaboratorPermission.ACCEDER_CALENDRIER,
          CollaboratorPermission.RETIRER_UTILISATEUR_CLIENT_DOSSIER,
        ],
        isActive: true,
      })
    })

    it('should filter out defaultCheckedRights that do not exist in available actions', () => {
      const authorizationState = getAuthorizationState(
        mockedActions,
        ['NON_EXISTENT_CODE_1' as any, 'NON_EXISTENT_CODE_2' as any],
      )

      expect(authorizationState).toStrictEqual(expectedAuthorizationState)
    })

    it('should deduplicate when defaultCheckedRights overlap with enabled actions', () => {
      const authorizationState = getAuthorizationState(
        mockedActions,
        [
          CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION, // already enabled
          CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE, // already enabled
          CollaboratorPermission.ACCEDER_CALENDRIER, // disabled, will be added
        ],
      )

      expect(authorizationState).toStrictEqual({
        actions: [
          CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
          CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
          CollaboratorPermission.ACCEDER_CALENDRIER,
        ],
        isActive: true,
      })
      // Verify no duplicates
      expect(authorizationState.actions.length).toBe(3)
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

  describe('getAuthorizationsConfigMapped — sorting', () => {
    const RIGHT_CATEGORIES_SORT = {
      CLTGEDESC: 'Espace documentaire – Comptabilité',
      CLTGESTION: 'File management',
    }

    // Helper to build minimal Action
    const mkAction = (actionId: number, code: CollaboratorPermission, label = String(code), enabled = true): Action => ({
      actionId,
      code,
      name: 'name',
      label,
      enabled,
    })

    // Base actions for tests (mix of ordered + unordered)
    const A = mkAction(1, CollaboratorPermission.ACCEDER_CALENDRIER) // unordered
    const B = mkAction(2, CollaboratorPermission.RETIRER_UTILISATEUR_CLIENT_DOSSIER) // unordered
    const C = mkAction(3, CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE) // ordered candidate
    const D = mkAction(4, CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION) // ordered candidate

    it('does NOT sort when actionOrder is undefined', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [A, C, B, D],
        },
      ]

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        customLabels: {},
      })
      expect(res[0].category).toStrictEqual({
        code: 'CLTGEDESC',
        label: RIGHT_CATEGORIES_SORT.CLTGEDESC,
      })
      // order should be preserved
      expect(res[0].actions.map(a => a.code)).toStrictEqual([A.code, C.code, B.code, D.code])
    })

    it('does NOT sort when an order exists but has no matching codes in actions', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [A, C, B, D],
        },
      ]
      const ACTION_ORDER = {
        CLTGEDESC: ['NON_EXISTENT_CODE_1', 'NON_EXISTENT_CODE_2'],
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        actionOrder: ACTION_ORDER,
        customLabels: {},
      })
      // no match => should not sort
      expect(res[0].actions.map(a => a.code)).toStrictEqual([A.code, C.code, B.code, D.code])
    })

    it('sorts when an order exists and matches at least one action code', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [A, C, B, D], // initial order
        },
      ]
      const ACTION_ORDER = {
        // D then C are explicitly ordered => they must come first, then A and B in their original relative order (A before B)
        CLTGEDESC: [D.code, C.code],
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        actionOrder: ACTION_ORDER,
        customLabels: {},
      })
      expect(res[0].actions.map(a => a.code)).toStrictEqual([D.code, C.code, A.code, B.code])
    })

    it('keeps relative order for unordered actions', () => {
      // Here only one code is ordered; the rest (A, B) must keep their original relative order
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [B, A, C, D], // original relative order among unordered: B before A
        },
      ]
      const ACTION_ORDER = {
        CLTGEDESC: [C.code], // only C is ordered
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        actionOrder: ACTION_ORDER,
        customLabels: {},
      })
      // C first, then keep B before A, then D is unordered too (after B,A) and keeps its original position relative to them
      // Original order after removing C is [B, A, D] => should be preserved as [B, A, D]
      expect(res[0].actions.map(a => a.code)).toStrictEqual([C.code, B.code, A.code, D.code])
    })

    it('applies sorting only to categories that have an order; others remain unchanged', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [A, C, B, D], // will be sorted
        },
        {
          category: 'CLTGESTION',
          actions: [D, B, C, A], // must remain untouched
        },
      ]
      const ACTION_ORDER = {
        CLTGEDESC: [D.code, C.code],
        // No rule for CLTGESTION
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        actionOrder: ACTION_ORDER,
        customLabels: {},
      })

      // CLTGEDESC sorted
      expect(res[0].category.code).toBe('CLTGEDESC')
      expect(res[0].actions.map(a => a.code)).toStrictEqual([D.code, C.code, A.code, B.code])

      // CLTGESTION unchanged
      expect(res[1].category.code).toBe('CLTGESTION')
      expect(res[1].actions.map(a => a.code)).toStrictEqual([D.code, B.code, C.code, A.code])
    })

    it('does NOT sort when the provided order array is empty', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [A, C, B, D],
        },
      ]
      const ACTION_ORDER = {
        CLTGEDESC: [] as string[],
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES_SORT,
        actionOrder: ACTION_ORDER,
        customLabels: {},
      })
      expect(res[0].actions.map(a => a.code)).toStrictEqual([A.code, C.code, B.code, D.code])
    })
  })

  describe('getAuthorizationsConfigMapped — custom labels', () => {
    const RIGHT_CATEGORIES = {
      CLTGEDESC: 'Espace documentaire – Comptabilité',
    }

    // Minimal helper for "GED Comptabilité" actions where codes are plain strings
    const mkDocAction = (actionId: number, code: string, label = code, enabled = true): Action => ({
      actionId,
      code: code as any, // code is a string; cast for the Action type
      name: 'name',
      label,
      enabled,
    })

    // Action codes in this category
    const PRESENCE_RIGHT = CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE as unknown as string
    const A1 = 'CLGED0002'
    const A2 = 'CLSPGDC01'
    const A3 = 'CLSPGDC02'

    it('does NOT apply custom labels when the presence right is NOT present', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          // No PRESENCE_RIGHT here
          actions: [
            mkDocAction(1, A1, 'Accéder à l’espace documentaire Comptabilité'),
            mkDocAction(2, A2, 'Accéder au dossier Comptabilité/Dépôt'),
            mkDocAction(3, A3, 'Accéder au dossier Comptabilité/RYDGE Conseil'),
          ],
        },
      ]

      const CUSTOM_LABELS_FLAT = {
        [A1]: "Accéder aux archives de l'espace documentaire Comptabilité",
        [A2]: 'Accéder au dossier Comptabilité/Dépôt dans les archives',
        [A3]: 'Accéder au dossier Comptabilité/RYDGE Conseil dans les archives',
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES,
        customLabels: CUSTOM_LABELS_FLAT,
      })

      // No change expected
      expect(res[0].actions.map(a => a.label)).toStrictEqual([
        'Accéder à l’espace documentaire Comptabilité',
        'Accéder au dossier Comptabilité/Dépôt',
        'Accéder au dossier Comptabilité/RYDGE Conseil',
      ])
    })

    it('applies custom labels when the presence right is present', () => {
      const cfg = [
        {
          category: 'CLTGEDESC',
          actions: [
            // Include the presence right among actions
            mkDocAction(0, PRESENCE_RIGHT, 'Accéder aux documents RYDGE Conseil'),
            mkDocAction(1, A1, 'Accéder à l’espace documentaire Comptabilité'),
            mkDocAction(2, A2, 'Accéder au dossier Comptabilité/Dépôt'),
            mkDocAction(3, A3, 'Accéder au dossier Comptabilité/RYDGE Conseil'),
          ],
        },
      ]

      const CUSTOM_LABELS_FLAT = {
        [A1]: "Accéder aux archives de l'espace documentaire Comptabilité",
        [A2]: 'Accéder au dossier Comptabilité/Dépôt dans les archives',
        [A3]: 'Accéder au dossier Comptabilité/RYDGE Conseil dans les archives',
      }

      const res = getAuthorizationsConfigMapped({
        authorizationsConfig: cfg as any,
        rightsCategories: RIGHT_CATEGORIES,
        customLabels: CUSTOM_LABELS_FLAT,
      })

      // Labels for A1/A2/A3 should be overridden; presence right label remains as initially provided
      expect(res[0].actions.map(a => a.label)).toStrictEqual([
        'Accéder aux documents RYDGE Conseil',
        "Accéder aux archives de l'espace documentaire Comptabilité",
        'Accéder au dossier Comptabilité/Dépôt dans les archives',
        'Accéder au dossier Comptabilité/RYDGE Conseil dans les archives',
      ])
    })
  })
})

import type { Action } from '../RightsListTypes'

export const getMockedRightCategories = (): Record<string, string> => {
  return {
    COLADMIN: 'Administration',
    CLTGESTION: 'File management',
    COLMIRROIR: 'Customer mirror view',
  }
}

export const getMockedAuthorizationState = (): Action[] => {
  return [
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
}

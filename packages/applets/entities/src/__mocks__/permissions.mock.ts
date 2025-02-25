
import { AuthorizationConfig } from '@entities/common/components/ManageRightsDrawer/components/RightsList/RightsListTypes'
import { AuthorizationState } from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'

export const getMockedAuthorizationState = (): Record<
  string,
  AuthorizationState
> => {
  return {
    CLTGESTION: {
      actions: ['CLUSER001', 'CLUSER002', 'CLUSER003'],
      isActive: true,
    },
    'CLTGED GS': {
      actions: ['CLGED0001'],
      isActive: true,
    },
    'CLTGED ESC': {
      actions: ['CLGED0002'],
      isActive: true,
    },
  }
}

export const getMockedAuthorizationsConfig = (): AuthorizationConfig[] => {
  return [
    {
      category: 'CLTGESTION',
      actions: [
        {
          actionId: 10,
          code: 'CLUSER001',
          name: 'View User',
          label: 'Consulter les utilisateurs',
          enabled: true,
        },
        {
          actionId: 11,
          code: 'CLUSER002',
          name: 'Add User',
          label: 'Ajouter un utilisateur',
          enabled: true,
        },
        {
          actionId: 12,
          code: 'CLUSER003',
          name: 'Delete User',
          label: 'Supprimer un utilisateur',
          enabled: false,
        },
      ],
    },
    {
      category: 'COLADMIN',
      actions: [
        {
          actionId: 15,
          code: 'COADMI001',
          name: 'View collabs',
          label: "Accéder à l'onglet collaborateurs",
          enabled: true,
        },
        {
          actionId: 16,
          code: 'COADMI002',
          name: 'Delete collab',
          label: 'Supprimer un collaborateur',
          enabled: false,
        },
        {
          actionId: 17,
          code: 'COADMI003',
          name: 'Update right collab',
          label: 'Gérer les droits des collaborateurs',
          enabled: false,
        },
      ],
    },
    {
      category: 'COLMIRROIR',
      actions: [
        {
          actionId: 20,
          code: 'COINFO001',
          name: 'Mirror informations',
          label: "Accéder à l'onglet informations",
          enabled: false,
        },
      ],
    },
  ]
}

export const mockedAuthorizationsConfig = getMockedAuthorizationsConfig()
export const mockedPermissionCodes = ['CLUSER001', 'CLUSER002']

export const mockHasPermission = vi.fn((_code: string) => true)
export const mockUpdateUserPermission = vi.fn()
export const mockUpdateAccountPermission = vi.fn()
export const mockFetchAuthorizationsConfig = vi.fn(() => Promise.resolve(mockedAuthorizationsConfig))

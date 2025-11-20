import type { Mock } from 'vitest'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'
import type { AuthorizationConfig } from '@entities/types'
import { AuthorizationState } from '@entities/components/ManageRightsDrawer/ManageRightsTypes'

export const getMockedAuthorizationState = (): Record<
  string,
  AuthorizationState
> => {
  return {
    CLTGESTION: {
      actions: [
        CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
        CustomerPermission.ACCEDER_EMBAUCHE_SALARIEE,
        CustomerPermission.ACCEDER_EVP,
      ],
      isActive: true,
    },
    'CLTGED GS': {
      actions: [
        CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
      ],
      isActive: true,
    },
    'CLTGED ESC': {
      actions: [
        CustomerPermission.ACCEDER_GED_COMPTABLE,
      ],
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
          code: CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
          name: 'View User',
          label: 'Consulter les utilisateurs',
          enabled: true,
        },
        {
          actionId: 11,
          code: CustomerPermission.ACCEDER_GED_COMPTABLE,
          name: 'Add User',
          label: 'Ajouter un utilisateur',
          enabled: true,
        },
        {
          actionId: 12,
          code: CustomerPermission.ACCEDER_OUTIL_MEG,
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
          code: CollaboratorPermission.ACCEDER_DONNEES_BANCAIRES,
          name: 'View collabs',
          label: "Accéder à l'onglet collaborateurs",
          enabled: true,
        },
        {
          actionId: 16,
          code: CollaboratorPermission.ACCEDER_FACTURES_PULSE,
          name: 'Delete collab',
          label: 'Supprimer un collaborateur',
          enabled: false,
        },
        {
          actionId: 17,
          code: CollaboratorPermission.ACCEDER_LANCEUR_SILAE,
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
          code: CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
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

export const mockUpdateUserPermission: Mock = vi.fn()
export const mockUpdateAccountPermission: Mock = vi.fn()
export const mockFetchAuthorizationsConfig: Mock = vi.fn(() => Promise.resolve(mockedAuthorizationsConfig))

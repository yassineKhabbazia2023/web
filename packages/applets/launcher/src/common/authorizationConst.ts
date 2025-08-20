import { LauncherKey } from '@launcher/pages/launcher/LauncherTypes'
import type { Permission } from '@pulse/common/types'
import { CollaboratorPermission, CustomerPermission } from '@pulse/common/enums'

const PermissionCodes: Record<string, Permission> = {
  MEG: CustomerPermission.ACCEDER_OUTIL_MEG,
  SILAE: CustomerPermission.ACCEDER_OUTIL_SILAE,
  SILAE_COLLAB: CollaboratorPermission.ACCEDER_LANCEUR_SILAE,
  PENNYLANE: CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
  PENNYLANE_COLLAB: CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
}

export const LAUNCHER_AUTHORIZATIONS: {
  key: LauncherKey
  authorizationCodes: Permission[]
}[] = [
  {
    key: LauncherKey.MEG,
    authorizationCodes: [PermissionCodes.MEG],
  },
  {
    key: LauncherKey.SILAE,
    authorizationCodes: [PermissionCodes.SILAE, PermissionCodes.SILAE_COLLAB],
  },
  {
    key: LauncherKey.PENNYLANE,
    authorizationCodes: [PermissionCodes.PENNYLANE, PermissionCodes.PENNYLANE_COLLAB],
  },
]

import { LauncherKey } from '@launcher/pages/launcher/LauncherTypes'

enum PermissionCodes {
  MEG = 'CLMEG001',
  SILAE = 'CLSILA001',
  SILAE_COLLAB = 'COSILA001',
  PENNYLANE = 'CLPEN001',
}

export const LAUNCHER_AUTHORIZATIONS = [
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
    authorizationCodes: [PermissionCodes.PENNYLANE],
  },
]

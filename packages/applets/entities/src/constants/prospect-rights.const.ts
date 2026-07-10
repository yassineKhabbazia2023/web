import { CustomerPermission } from '@pulse/common/enums'
import type { Permission } from '@pulse/common/types'

/**
 * Default rights granted to new users on Prospect entities.
 * These rights are pre-checked when adding a user to a prospect account.
 */
export const DEFAULT_PROSPECT_USER_RIGHTS: Permission[] = [
  CustomerPermission.CONSULTER_UTILISATEURS,
  CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
  CustomerPermission.ACCEDER_CONFORMITE_BENEFICIAIRES_EFFECTIFS,
  CustomerPermission.ACCEDER_CONFORMITE_DOCUMENTS_JUSTIFICATIFS,
  CustomerPermission.ACCEDER_CONFORMITE_PROPOSITION_COMMERCIALE,
  CustomerPermission.ACCEDER_CONFORMITE_MOYENS_PAIEMENT,
  CustomerPermission.ACCEDER_CONFORMITE_LETTRE_MISSION,
  CustomerPermission.ACCEDER_DOSSIER_DOCUMENTS_PROSPECT,
] as const

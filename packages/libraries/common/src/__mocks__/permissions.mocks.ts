import type { Permission } from '../types/permission.type'
import { CollaboratorPermission, CustomerPermission } from '../enums/permission.enum'

export function getPermissionsMock(): Permission[] {
  return [
    CollaboratorPermission.CREER_JEUX_DONNEES,
    CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
  ]
}

export function customerEntityPermissionsWithPennylane(): Permission[] {
  return [
    CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    CustomerPermission.ACCEDER_GED_COMPTABLE,
    CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
  ]
}

export function collaboratorEntityPermissionsWithPennylane(): Permission[] {
  return [
    CollaboratorPermission.GED,
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ]
}

export function customerEntityPermissionsWithoutPennylane(): Permission[] {
  return [
    CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    CustomerPermission.ACCEDER_GED_COMPTABLE,
  ]
}

export function collaboratorEntityPermissionsWithoutPennylane(): Permission[] {
  return [
    CollaboratorPermission.GED,
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  ]
}

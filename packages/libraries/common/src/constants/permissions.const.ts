import type { Permission } from '../types/permission.type'
import { CustomerPermission, CollaboratorPermission } from '../enums/permission.enum'

export const GLOBAL_PERMISSIONS: Record<string, Permission[]> = {
  ACCOUNT_MANAGEMENT: [
    CollaboratorPermission.GERER_DOSSIERS,
  ],
  COLLABORATORS: [
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS_ADMIN,
  ],
  ENTITY_CREATOR: [
    CollaboratorPermission.CREER_JEUX_DONNEES,
  ],
  HISTORY: [
    CollaboratorPermission.HISTORIQUE_DELEGATIONS,
  ],
  LAUNCHER: [
    CollaboratorPermission.ACCEDER_LANCEUR_SILAE,
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ],
  MANDATE: [
    CollaboratorPermission.ONGLET_MANDAT,
  ],
  POWERBI_REPORT: [
    CollaboratorPermission.DEPOSER_RAPPORT_BI,
  ],
  SUBSCRIPTIONS: [
    CollaboratorPermission.ONGLET_DEMANDES_MOD,
  ],
  USERS: [
    CustomerPermission.CONSULTER_UTILISATEURS,
  ],
}

export const ACCOUNT_PERMISSIONS: Record<string, Permission[]> = {
  APPS: [
    CustomerPermission.ACCEDER_OUTIL_SILAE,
    CustomerPermission.ACCEDER_OUTIL_MEG,
    CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
    CollaboratorPermission.ACCEDER_LANCEUR_SILAE,
    CollaboratorPermission.MEG,
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ],
  BANK: [
    CustomerPermission.ACCEDER_DONNEES_BANCAIRES,
    CollaboratorPermission.ACCEDER_DONNEES_BANCAIRES,
  ],
  COLLABORATORS: [
    CustomerPermission.CONSULTER_UTILISATEURS,
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
  ],
  GED: [
    CustomerPermission.ACCEDER_GED_GESTION_SOCIALE,
    CustomerPermission.ACCEDER_GED_COMPTABLE,
    CollaboratorPermission.GED,
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
  ],
  PENNYLANE: [
    CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ],
  PENNYLANE_ACCOUNTING_GED_LEGACY: [
    CollaboratorPermission.ACCEDER_GED_COMPTABLE,
    CustomerPermission.ACCEDER_GED_COMPTABLE,
  ],
  PENNYLANE_ACCOUNTING_GED_V2: [
    CustomerPermission.ACCEDER_DOCUMENTS_PENNYLANE,
  ],
  INDICATORS: [
    CustomerPermission.ACCEDER_INDICATEURS,
    CollaboratorPermission.ACCEDER_INDICATEURS,
  ],
  INFORMATION: [
    CustomerPermission.ACCEDER_INFORMATIONS_ENTREPRISE,
    CollaboratorPermission.ACCEDER_ONGLET_INFORMATIONS,
  ],
  INVOICES: [
    CustomerPermission.ACCEDER_FACTURES_PULSE,
    CollaboratorPermission.ACCEDER_FACTURES_PULSE,
  ],
  OFFER: [
    CustomerPermission.ACCEDER_OFFRES_SOUSCRITES,
    CollaboratorPermission.ACCEDER_ONGLET_OFFRE,
  ],
  POWERBI_REPORT: [
    CustomerPermission.ACCEDER_RAPPORTS_BI_FINANCIER,
    CollaboratorPermission.ACCEDER_RAPPORTS_BI,
  ],
  USERS: [
    CustomerPermission.CONSULTER_UTILISATEURS,
    CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
  ],
}

export const ACTION_PERMISSIONS: Record<string, Permission[]> = {
  ACCESS_PENNYLANE: [
    CustomerPermission.ACCEDER_OUTIL_PENNYLANE,
  ],
  ACCESS_PENNYLANE_COLLAB: [
    CollaboratorPermission.ACCEDER_LANCEUR_PENNYLANE,
  ],
  ACTIVATE_OFFER: [
    CollaboratorPermission.ACTIVER_OFFRE,
  ],
  ADD_USERS: [
    CustomerPermission.AJOUTER_UTILISATEUR,
    CollaboratorPermission.AJOUTER_UTILISATEUR,
  ],
  COLLAB_REMOVE_USER: [
    CollaboratorPermission.RETIRER_UTILISATEUR_CLIENT_DOSSIER,
  ],
  DELETE_ACCOUNT_COLLAB: [
    CollaboratorPermission.ACCEDER_ONGLET_COLLABORATEURS,
  ],
  DELETE_COLLAB: [
    CollaboratorPermission.SUPPRIMER_COLLABORATEUR_ADMIN,
  ],
  DELETE_USER: [
    CustomerPermission.SUPPRIMER_UTILISATEUR,
  ],
  DELETE_REPORT: [
    CollaboratorPermission.SUPPRIMER_RAPPORT_BI,
  ],
  EDIT_COMPANY_DATA: [
    CollaboratorPermission.MAJ_FICHE_ENTREPRISE_ONGLET_INFORMATION,
  ],
  MANAGE_ACCESS: [
    CollaboratorPermission.ACCEDER_ONGLET_UTILISATEURS,
  ],
  MODIFY_ACCOUNT_RIGHTS: [
    CollaboratorPermission.GESTION_DROITS_SUR_DOSSIER,
  ],
  MODIFY_RIGHTS_COLLAB: [
    CollaboratorPermission.GERER_DROITS_COLLABORATEURS_ADMIN,
  ],
  MODIFY_RIGHTS_USER: [
    CustomerPermission.GERER_DROITS_UTILISATEURS,
  ],
}

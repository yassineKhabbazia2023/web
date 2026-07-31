/** Filter categories, tracked as the filter type dimension. */
export enum WalletFilterType {
  FAVORITES = 'favoris',
  CUSTOMER_RELATION = 'en relation client',
  MISSION_TYPE = 'type de mission',
  STATUS = 'statut dossier',
  LAST_ACTIVITY = 'dernière utilisation',
  NONE = 'none',
}

/** Last activity period labels as displayed in the filters drawer. */
export enum WalletActivityFilterValue {
  TWO_WEEKS = '2 dernières semaines',
  THIRTY_DAYS = '30 derniers jours',
  NINETY_DAYS = '90 derniers jours',
}

/** Mission type labels as displayed in the filters drawer, so the analytics stay readable. */
export enum WalletMissionTypeFilterValue {
  TENUE = 'Tenue',
  REVISION = 'Révision',
  NOT_SPECIFIED = 'Non renseigné',
}

/** Deployment status labels as displayed in the filters drawer, instead of their raw ids. */
export enum WalletDeploymentStatusFilterValue {
  TO_DEPLOY = 'À déployer',
  IN_PROGRESS = 'En cours',
  CONNECTED = 'Connecté',
}

export enum WalletMenuActionValue {
  MENU_OPENED = 'Ouverture menu',
  ACCESS_FOLDER = 'Accéder au dossier',
  RESEND_ACTIVATION_EMAIL = 'Relancer le mail d\'activation',
  DECLARE_CUSTOMER_RELATION = 'Se déclarer en relation client',
  REMOVE_CUSTOMER_RELATION = 'Ne plus être en relation client',
  DELEGATE_WALLET = 'Déléguer le portefeuille',
  DELEGATE_FOLDERS = 'Déléguer une sélection de dossiers',
  REMOVE_FROM_FOLDERS = 'Retirer des dossiers',
  VIEW_PERMANENT_DELEGATIONS = 'Voir les délégations permanentes',
  REQUEST_DELEGATION = 'Demander une délégation',
  PENDING_DELEGATIONS = 'Voir les délégations en attente',
  CREATE_TEST_ACCOUNT = 'Créer un compte de test',
}

export enum WalletMenuActionType {
  GLOBAL = 'Global',
  UNITARY = 'Unitaire',
  BULK = 'En masse',
}

export enum WalletFavoriteActivation {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
}

export enum WalletSortColumn {
  COMPANY_NAME = 'Raison sociale',
  CUSTOMER_CODE = 'Code client',
  LEADER = 'Dirigeant',
  EMAIL = 'Mail',
  CITY = 'Ville',
  LAST_ACTIVITY_DATE = 'Dernière activité',
  FAVORITE = 'Favoris',
}

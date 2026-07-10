export enum WalletFilterValue {
  FAVORITES = 'favoris',
  CUSTOMER_RELATION = 'en relation client',
  LAST_ACTIVITY_TWO_WEEKS = '2 dernières semaines',
  LAST_ACTIVITY_THIRTY_DAYS = '30 derniers jours',
  LAST_ACTIVITY_NINETY_DAYS = '90 derniers jours',
  MISSION_TYPE = 'type de mission',
  STATUS = 'statut dossier',
  NONE = 'none',
}

export enum WalletMenuActionValue {
  MENU_OPENED = 'Ouverture menu',
  ACCESS_FOLDER = 'Accéder au dossier',
  RESEND_ACTIVATION_EMAIL = 'Relancer le mail d\'activation',
  DECLARE_CUSTOMER_RELATION = 'Se déclarer en relation client',
  REMOVE_CUSTOMER_RELATION = 'Ne plus être en relation client',
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
}

export enum WalletFilterValue {
  FAVORITES = 'favoris',
  CUSTOMER_RELATION = 'en relation client',
  MISSION_TYPE_TENUE = 'Tenue',
  MISSION_TYPE_REVISION = 'Révision',
  STATUS_TO_DEPLOY = 'A déployer',
  STATUS_IN_PROGRESS = 'En cours',
  STATUS_CONNECTED = 'Connectés',
  NONE = 'none',
}

export enum WalletMenuActionValue {
  MENU_OPENED = 'Ouverture menu',
  ACCESS_FOLDER = 'Accéder au dossier',
  RESEND_ACTIVATION_EMAIL = 'Relancer le mail d\'activation',
  DECLARE_CUSTOMER_RELATION = 'Se déclarer en relation client',
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
}

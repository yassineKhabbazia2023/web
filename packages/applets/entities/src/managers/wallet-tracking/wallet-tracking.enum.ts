export enum WalletFilterValue {
  FAVORITES = 'favoris',
  CUSTOMER_RELATION = 'en relation client',
  NONE = 'none',
}

export enum WalletStatusValue {
  TO_DEPLOY = 'A déployer',
  IN_PROGRESS = 'En cours',
  CONNECTED = 'Connectés',
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

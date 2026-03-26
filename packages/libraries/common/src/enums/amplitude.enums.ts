export enum AmplitudeUserType {
  CUSTOMER = 'Client',
  COLLAB = 'Collaborateur',
}

export enum AmplitudeTrackingLocation {
  LAUNCHER = 'launcher',
  HOMEPAGE = 'homepage',
}

export enum AmplitudeEvent {
  FEATURE_CONSULTED = 'Feature Consulted',
  WIDGET_INTERACTED = 'Widget Interacted With',
  WALLET_ACTION_CUSTOM_FILTER_VALIDATED = 'Wallet Action Custom Filter Validated',
  WALLET_ACTION_STATUS_CLICKED = 'Wallet Action Status Clicked',
  WALLET_ACTION_FOLDER_MENU_REQUESTED = 'Wallet Action Folder Menu Requested',
  WALLET_ACTION_FAVORITE_REQUEST = 'Wallet Action Favorite Request',
  WALLET_ACTION_PAGINATION_REQUESTED = 'Wallet Action Pagination Requested',
  WALLET_ACTION_PAGINATION_CONSULTED = 'Wallet Action Pagination Consulted',
  WALLET_ACTION_COLUMN_SORT_REQUESTED = 'Wallet Action Column Sort Requested',
}

export enum AmplitudeFeatureName {
  HOMEPAGE = 'homepage',
}

export enum AmplitudeFeatureLocalisation {
  PORTEFEUILLE = 'portefeuille',
  NAVIGATION = 'navigation',
}

export enum AmplitudeDeviceSize {
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

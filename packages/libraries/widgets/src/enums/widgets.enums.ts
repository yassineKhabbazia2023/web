export enum WidgetName {
  BOOKING_APPOINTMENT = 'BookingAppointment',
  DIGILAB = 'Digilab',
  EMAIL_PENNYLANE = 'EmailPennylane',
  PENNYLANE_DOCUMENTS = 'PennylaneDocuments',
  PENNYLANE_INTRO = 'PennylaneIntro',
  POWERBI_INTRO = 'PowerBIIntro',
  RSS_NEWS = 'RssNews',
  SMART_INTRO = 'SmartIntro',
  SSO = 'SSO',
  WORKSPACE_INTRO = 'WorkspaceIntro',
}

/**
 * Enum representing the size of a widget in terms of grid spans
 * - ONE_CELL: 1 grid cell
 * - TWO_SPANS: spans 2 cells
 * - THREE_SPANS: spans 3 cells
 * - FOUR_CELLS_SQUARE: 4 cells in a square layout
 */
export enum WidgetSize {
  ONE_CELL = 1,
  TWO_SPANS = 2,
  THREE_SPANS = 3,
  FOUR_CELLS_SQUARE = 4,
}

export enum WidgetScope {
  COLLAB = 'collab',
  CUSTOMER = 'customer',
}

export enum WidgetItemClicked {
  PENNYLANE_GETTING_STARTED = 'PNL - Bien débuter avec Pennylane',
  PENNYLANE_CONNECTED = 'PNL - Se connecter à Pennylane',
  PENNYLANE_SESSION = "PNL - S'inscrire à une formation",
  PENNYLANE_DEPOSED = 'PNL - Déposer ses factures',
  PENNYLANE_MOBILE = "PNL - Découvrir l'application mobile Pennylane",
  RSS_VIEW_ALL = 'RSS - View All',
}

export enum WidgetName {
  SSO = 'SSO',
  PENNYLANE_INTRO = 'PennylaneIntro',
  DIGILAB = 'Digilab',
  RSS_NEWS = 'RssNews',
  POWERBI_INTRO = 'PowerBIIntro',
  EMAIL_PENNYLANE = 'EmailPennylane',
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

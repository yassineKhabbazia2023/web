/**
 * How a widget renders the lines it reads. Authored, not derived from the
 * figures: it is written in `templates/key-moments.<id>.template.json`.
 */
export enum Renderer {
  TABLE = 'table',
  CARDS = 'cards',
  CHART = 'chart',
  /** Opening balance, movements, closing balance — read on a single exercise */
  WATERFALL = 'waterfall',
  /** The same lines split in two tables, by the side each one sits on */
  BALANCE_SHEET = 'balanceSheet',
  /**
   * The balance sheet read as two surfaces, each term a brick whose height is
   * its share of its half and whose colour is the aggregate it feeds
   */
  BALANCE_IMAGE = 'balanceImage',
  /** One sentence and one amount per line, grouped by the subtotals they close */
  NARRATIVE = 'narrative',
}

/** Which side of the balance sheet a line sits on. Authored, not derived. */
export enum BalanceSheetSide {
  ASSETS = 'assets',
  LIABILITIES = 'liabilities',
}

/**
 * How a step of a waterfall reads. A balance is an absolute position drawn from
 * zero; a movement is a step floating on the running total, and only its
 * direction distinguishes a rise from a fall.
 */
export enum WaterfallStepKind {
  BALANCE = 'balance',
  RISE = 'rise',
  FALL = 'fall',
}

/**
 * Shape of a chart. Period charts spread the indicators over the exercises,
 * whereas a composition splits a single period into labelled columns — the
 * balance sheet read as assets against liabilities.
 */
export enum ChartKind {
  GROUPED_BARS = 'groupedBars',
  STACKED_BARS = 'stackedBars',
  COMPOSITION = 'composition',
}

/** How a series is drawn. A line is plotted against the secondary axis. */
export enum ChartSeriesType {
  BAR = 'bar',
  LINE = 'line',
}

/**
 * Name a template writes in place of a color, resolved against
 * `KEY_MOMENTS_COLOR`. A template says which slot a series occupies, never
 * which ink it is painted with: repainting the module is then editing one
 * record rather than hunting hexadecimal down every template.
 */
export enum ColorToken {
  /** The four slots a period chart draws its series from, in reading order */
  SERIES_PRIMARY = 'seriesPrimary',
  SERIES_ACCENT = 'seriesAccent',
  SERIES_MUTED = 'seriesMuted',
  SERIES_SOFT = 'seriesSoft',
  /**
   * The three aggregates of the financial analysis, which own their inks
   * rather than borrowing the series slots: the balance sheet reads as its
   * own palette, told apart from the application's own green and navy.
   */
  BALANCE_WORKING_CAPITAL = 'balanceWorkingCapital',
  BALANCE_WORKING_CAPITAL_NEED = 'balanceWorkingCapitalNeed',
  BALANCE_CASH = 'balanceCash',
}

/**
 * Nature of a value, which drives how it is formatted. A indicator never
 * inherits: it declares its own kind, and a delta on a percentage is rendered
 * in points.
 */
export enum ValueKind {
  AMOUNT = 'amount',
  PERCENTAGE = 'percentage',
  DAYS = 'days',
  HEADCOUNT = 'headcount',
  POINTS = 'points',
}

/**
 * How a indicator reads. Says nothing about how its values are stored: an
 * expense is stored as a positive magnitude, and `EXPENSE` only means that a
 * rise of it is unfavourable.
 */
export enum IndicatorSign {
  INCOME = 'income',
  EXPENSE = 'expense',
}

/** Emphasis role of a line inside its widget. */
export enum LineRole {
  SUBTOTAL = 'subtotal',
  TOTAL = 'total',
  MEMO = 'memo',
}

/**
 * What a measure of the closing says. Only a variation carries a trend: a
 * period value and a ratio are read as they are.
 *
 * Drives the reading of a measure, never its production: the operands a
 * variation names are descriptive, and no value is ever recomputed from them.
 */
export enum MeasureNature {
  PERIOD = 'period',
  VARIATION = 'variation',
  RATIO = 'ratio',
}

/**
 * The place a measure takes in the comparison the reader applies. A column
 * naming a role reads whichever variation the applied comparison resolves it
 * to, so that switching reference rebases what is compared without the template
 * ever citing a variation key.
 */
export enum MeasureRole {
  VARIATION = 'variation',
  VARIATION_PCT = 'variationPct',
}

/**
 * The place an exercise takes in the comparison the reader applies, written
 * where a period key is expected. An exercise a widget names stays named — the
 * two are authoring choices: `N-1` always reads `N-1`, `reference` reads the
 * exercise the reader compares to, so the balance sheet drawn beside the
 * current one follows the comparison instead of ignoring it.
 */
export enum PeriodRole {
  CURRENT = 'current',
  REFERENCE = 'reference',
}

/**
 * Direction of a variation, used to colorize the value.
 */
export enum Trend {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

/**
 * Unit the whole report is read in. A reading choice of the page, frozen at
 * publication so that a publication says under which unit it was arbitrated.
 */
export enum CurrencyDisplay {
  EURO = 'euro',
  THOUSANDS = 'thousands',
}

/**
 * Why the report on screen differs from what the client reads. A gesture of the
 * firm and a delivery it received are told apart on purpose: the first is a
 * decision that has not reached the client yet, the second is figures arriving
 * on their own. Only the first is worth an alert.
 */
export enum DivergenceFamily {
  MODIFICATION = 'modification',
  DELIVERY = 'delivery',
}

/** What exactly differs, which is what the page names to the reader. */
export enum DivergenceKind {
  CLOSING = 'closing',
  CLOSING_VERSION = 'closingVersion',
  TEMPLATE = 'template',
  TEMPLATE_VERSION = 'templateVersion',
  COMPARISON = 'comparison',
  CURRENCY = 'currency',
  COMMENTS = 'comments',
  HIDDEN_WIDGETS = 'hiddenWidgets',
  RECOMMENDATIONS = 'recommendations',
}

/**
 * What the header says of the exercice on screen. `UNKNOWN` is the honest state
 * when what a publication froze could not be read: not knowing is never being
 * up to date, so the page offers to publish rather than claiming anything.
 */
export enum PublicationState {
  NEVER = 'never',
  UP_TO_DATE = 'upToDate',
  DELIVERY = 'delivery',
  MODIFIED = 'modified',
  UNKNOWN = 'unknown',
}

/**
 * How much a recommendation weighs. String-valued rather than ranked: the
 * microservice is configured with `allowIntegerValues: false`, and sending `1`
 * is refused with a 400.
 *
 * It never orders the section — the display order is carried by the position in
 * the list, and by it alone.
 */
export enum RecommendationPriority {
  PRIMARY = 'primary',
  SIGNIFICANT = 'significant',
  INFORMATIVE = 'informative',
}

/**
 * The closed list of rubrics a recommendation is filed under, in display
 * order: the order of the enum is the order of the section. The labels are
 * the front's, the microservice only ever carries the key.
 */
export enum RecommendationRubric {
  MANAGEMENT = 'management',
  ACCOUNTING = 'accounting',
  SECTOR = 'sector',
  SOCIAL = 'social',
  WEALTH = 'wealth',
}

/**
 * How the microservice words a refusal it means the page to act on, as opposed
 * to the schema report an import carries. One code, at the root of the body,
 * beside the `errors[]` pointing at what it names.
 *
 * `ambiguous-siret` is deliberately absent: the import route settles the
 * account itself, and the seeder is the only caller that can still meet it.
 */
export enum RejectionCode {
  /** The account of the route does not carry that SIRET, or is inactive */
  ACCOUNT_MISMATCH = 'account-mismatch',
  /** The exercice already belongs to another account */
  EXERCICE_ACCOUNT_CONFLICT = 'exercice-account-conflict',
  UNKNOWN_SIRET = 'unknown-siret',
  /** A recommendation of the publication could not be resolved in the catalogue */
  MISSING_OFFER_DESCRIPTION = 'missing-offer-description',
  /** The exercice has no active publication to restore the draft from */
  NOT_PUBLISHED = 'not-published',
}

/**
 * The two files the report is handed over as, which are the same pages written
 * twice. The value is the extension, since that is all that tells them apart
 * once downloaded.
 */
export enum ExportFormat {
  PPTX = 'pptx',
  PDF = 'pdf',
}

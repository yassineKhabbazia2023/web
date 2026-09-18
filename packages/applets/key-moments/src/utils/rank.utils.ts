/** Width of the ordinal displayed in a screen heading: 01, 02, … */
const SCREEN_RANK_DIGITS = 2

/**
 * The ordinal a section is announced by, read from its position in the report.
 *
 * Stated here rather than in each surface: the collaborator page, the client
 * page and the recommendations closing both of them number their sections on
 * one rule, and a copy of it is a report that counts differently depending on
 * who reads it.
 */
export function formatScreenRank(index: number): string {
  return String(index + 1).padStart(SCREEN_RANK_DIGITS, '0')
}

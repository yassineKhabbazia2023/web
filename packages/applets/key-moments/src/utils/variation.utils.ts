import type { Card } from '../types/key-moments.types'

/**
 * How a card writes the evolution it carries, for the screen and for the deck
 * alike.
 *
 * Stated once because the two surfaces render the same card: a separator
 * changed on one side, or the two figures swapped, would have the client read
 * one thing on screen and another in the deck they are sent — and the deck is
 * the copy that leaves the firm.
 */

/** Reads the two figures of an evolution as two statements, not as one number. */
const VARIATION_SEPARATOR = ' · '

/**
 * How much moved, then how much that weighs — `+154 453 € · +8,2 %`. A closing
 * shipping only one of the two writes that one alone: neither is derived from
 * the other. Empty when it ships neither.
 */
export function formatVariation(card: Card): string {
  return [card.variation?.value, card.variationPct?.value]
    .filter((value): value is string => value !== undefined)
    .join(VARIATION_SEPARATOR)
}

/**
 * Whether there is an evolution to show. Read from the text rather than from
 * the two figures: what is displayed and what decides to display it can then
 * not disagree.
 */
export function hasVariation(card: Card): boolean {
  return formatVariation(card).length > 0
}

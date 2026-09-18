import { Trend } from '../enums/key-moments.enums'
import { formatVariation, hasVariation } from './variation.utils'
import type { Card } from '../types/key-moments.types'

function buildCard(variation: Partial<Card> = {}): Card {
  return {
    id: 'tresorerie',
    title: 'Trésorerie',
    value: '1 852 400 €',
    trend: Trend.POSITIVE,
    isSignColored: false,
    isHighlighted: false,
    isHidden: false,
    ...variation,
  }
}

const ABSOLUTE = { value: '+154 453 €', trend: Trend.POSITIVE }
const PERCENTAGE = { value: '+8,2 %', trend: Trend.POSITIVE }

describe('key-moments variations', () => {

  describe('writing the evolution', () => {

    it('should write how much moved, then how much that weighs', () => {
      const card = buildCard({ variation: ABSOLUTE, variationPct: PERCENTAGE })

      expect(formatVariation(card)).toBe('+154 453 € · +8,2 %')
    })

    /** Neither figure is derived from the other: one alone is written alone. */
    it('should write the only figure a closing ships', () => {
      expect(formatVariation(buildCard({ variation: ABSOLUTE }))).toBe('+154 453 €')
      expect(formatVariation(buildCard({ variationPct: PERCENTAGE }))).toBe('+8,2 %')
    })

    it('should write nothing of a card carrying no evolution', () => {
      expect(formatVariation(buildCard())).toBe('')
    })
  })

  describe('whether there is one to show', () => {

    /**
     * Read from the text itself: what is displayed and what decides to display
     * it cannot then disagree — which is how the screen and the deck stay in
     * agreement on the same card.
     */
    it('should follow what would actually be written', () => {
      expect(hasVariation(buildCard({ variation: ABSOLUTE }))).toBe(true)
      expect(hasVariation(buildCard({ variationPct: PERCENTAGE }))).toBe(true)
      expect(hasVariation(buildCard({ variation: ABSOLUTE, variationPct: PERCENTAGE }))).toBe(true)
      expect(hasVariation(buildCard())).toBe(false)
    })
  })
})

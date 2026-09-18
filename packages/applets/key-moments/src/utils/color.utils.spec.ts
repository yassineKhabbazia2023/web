import { isLightColor, relativeLuminance } from './color.utils'

/** The two ends of the balance sheet palette, and the two inks written on them. */
const DARKEST_NAVY = '#0E0F30'
const PALEST_MINT = '#B5F0EF'
const WHITE = '#FFFFFF'
const BLACK = '#000000'

describe('key-moments colors', () => {

  describe('relative luminance', () => {

    it('should read black and white as the two ends of the scale', () => {
      expect(relativeLuminance(BLACK)).toBe(0)
      expect(relativeLuminance(WHITE)).toBe(1)
    })

    /** The one notation a template may ship beside the full one. */
    it('should read a three-digit notation as its expanded form', () => {
      expect(relativeLuminance('#fff')).toBe(relativeLuminance('#ffffff'))
      expect(relativeLuminance('#abc')).toBe(relativeLuminance('#aabbcc'))
    })

    it('should read a notation written in either case', () => {
      expect(relativeLuminance('#b5f0ef')).toBe(relativeLuminance(PALEST_MINT))
    })

    /**
     * Not a colour this can measure. Stated rather than guessed: what to do
     * about it belongs to the caller, and the two callers do not agree.
     */
    it('should say nothing of a colour it cannot read', () => {
      expect(relativeLuminance('rgb(14, 15, 48)')).toBeUndefined()
      expect(relativeLuminance('rebeccapurple')).toBeUndefined()
      expect(relativeLuminance('')).toBeUndefined()
    })
  })

  describe('light backgrounds', () => {

    /**
     * The two ends of the palette the balance sheet is drawn in: the ink has to
     * flip between them, which is the whole point of measuring.
     */
    it('should tell the two ends of the palette apart', () => {
      expect(isLightColor(PALEST_MINT)).toBe(true)
      expect(isLightColor(DARKEST_NAVY)).toBe(false)
    })

    /** Taken as dark, which is what the charts are drawn in. */
    it('should take a colour it cannot read as dark', () => {
      expect(isLightColor('rgb(255, 255, 255)')).toBe(false)
    })
  })
})

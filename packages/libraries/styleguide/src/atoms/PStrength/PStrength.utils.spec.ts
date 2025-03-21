import { getBgClassName, getTextClassName } from './PStrength.utils'

describe('test PStrength.utils', () => {
  describe('getBgClassName', () => {
    it('should return proper bg className', () => {
      const colorName = 'functionnal-orange'
      const expectedCssClassName = 'bg--functionnal-orange'
      const cssClassName = getBgClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })

    it('should return proper text className', () => {
      const colorName = 'functionnal-orange'
      const expectedCssClassName = 'text-color--functionnal-orange'
      const cssClassName = getTextClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })
  })
})

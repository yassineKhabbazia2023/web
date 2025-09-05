import { getBgClassName, getTextClassName } from './PStrength.utils'

describe('test PStrength.utils', () => {
  describe('getBgClassName', () => {
    it('should return proper bg className', () => {
      const colorName = 'stroke-warning'
      const expectedCssClassName = 'bg--stroke-warning'
      const cssClassName = getBgClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })

    it('should return proper text className', () => {
      const colorName = 'stroke-warning'
      const expectedCssClassName = 'text-color--stroke-warning'
      const cssClassName = getTextClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })
  })
})

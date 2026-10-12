import { getBgClassName, getTextClassName } from './PStrength.utils'

describe('test PStrength.utils', () => {
  describe('getBgClassName', () => {
    it('should return proper bg className', () => {
      const colorName = 'stroke-basic-warning'
      const expectedCssClassName = 'bg--stroke-basic-warning'
      const cssClassName = getBgClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })

    it('should return proper text className', () => {
      const colorName = 'stroke-basic-warning'
      const expectedCssClassName = 'text-color--stroke-basic-warning'
      const cssClassName = getTextClassName(colorName)

      expect(cssClassName).toBe(expectedCssClassName)
    })
  })
})

import { ref } from 'vue'
import { useDisplayCount } from './use-display-count.composable'

describe('useDisplayCount', () => {
  describe('displayCount formatting', () => {
    it('should return "0" when count is 0', () => {
      const count = ref(0)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('0')
    })

    it('should return the count as string when count is between 1 and 99', () => {
      const count = ref(42)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('42')
    })

    it('should return "99" when count is exactly 99', () => {
      const count = ref(99)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('99')
    })

    it('should return "99+" when count is 100', () => {
      const count = ref(100)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('99+')
    })

    it('should return "99+" when count is greater than 100', () => {
      const count = ref(250)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('99+')
    })
  })

  describe('reactivity', () => {
    it('should update displayCount when count ref changes', () => {
      const count = ref(5)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('5')

      count.value = 150

      expect(displayCount.value).toBe('99+')
    })

    it('should update from 99+ back to normal when count decreases', () => {
      const count = ref(120)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('99+')

      count.value = 50

      expect(displayCount.value).toBe('50')
    })

    it('should handle multiple updates correctly', () => {
      const count = ref(10)
      const { displayCount } = useDisplayCount(count)

      expect(displayCount.value).toBe('10')

      count.value = 99
      expect(displayCount.value).toBe('99')

      count.value = 100
      expect(displayCount.value).toBe('99+')

      count.value = 0
      expect(displayCount.value).toBe('0')
    })
  })
})

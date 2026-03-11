import { getFormattedExperts } from './booking-appointment-choose-expert.utils'
import { getMockExperts } from '../../../__mocks__'
import * as commonUtils from '@pulse/common/utils'

vi.mock('@pulse/common/utils', () => ({
  getInitials: vi.fn(),
}))

describe('booking-appointment-choose-expert.utils', () => {
  describe('getFormattedExperts', () => {
    it('should format experts with initials and full name', () => {
      const mockExperts = getMockExperts()

      vi.mocked(commonUtils.getInitials).mockImplementation((firstName, lastName) => {
        if (firstName === 'John' && lastName === 'Doe') {
          return 'JD'
        }
        if (firstName === 'Jane' && lastName === 'Smith') {
          return 'JS'
        }
        return ''
      })

      const result = getFormattedExperts(mockExperts)

      expect(result).toEqual([
        { id: 1, fullName: 'John Doe', initials: 'JD' },
        { id: 2, fullName: 'Jane Smith', initials: 'JS' },
      ])
      expect(commonUtils.getInitials).toHaveBeenCalledWith('John', 'Doe')
      expect(commonUtils.getInitials).toHaveBeenCalledWith('Jane', 'Smith')
    })

    it('should handle empty array', () => {
      const result = getFormattedExperts([])

      expect(result).toEqual([])
      expect(commonUtils.getInitials).not.toHaveBeenCalled()
    })
  })
})

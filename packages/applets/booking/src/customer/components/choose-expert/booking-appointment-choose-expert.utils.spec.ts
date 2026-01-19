import { getFormattedExperts } from './booking-appointment-choose-expert.utils'
import { getBookingServiceExpert } from '../../../__mocks__'
import * as commonUtils from '@pulse/common/utils'

vi.mock('@pulse/common/utils', () => ({
  getInitials: vi.fn(),
}))

describe('booking-appointment-choose-expert.utils', () => {
  describe('getFormattedExperts', () => {
    it('should format experts with initials', () => {
      const mockExperts = [
        getBookingServiceExpert({ contactId: 1, fullName: 'John Doe', email: 'john.doe@example.com' }),
        getBookingServiceExpert({ contactId: 2, fullName: 'Jane Smith', email: 'jane.smith@example.com' }),
      ]

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
        { contactId: 1, fullName: 'John Doe', initials: 'JD' },
        { contactId: 2, fullName: 'Jane Smith', initials: 'JS' },
      ])
      expect(commonUtils.getInitials).toHaveBeenCalledWith('John', 'Doe')
      expect(commonUtils.getInitials).toHaveBeenCalledWith('Jane', 'Smith')
    })

    it('should handle single name experts', () => {
      const singleNameExperts = [
        getBookingServiceExpert({ contactId: 1, fullName: 'John', email: 'john@example.com' }),
      ]

      vi.mocked(commonUtils.getInitials).mockReturnValue('J')

      const result = getFormattedExperts(singleNameExperts)

      expect(result).toEqual([
        { contactId: 1, fullName: 'John', initials: 'J' },
      ])
      expect(commonUtils.getInitials).toHaveBeenCalledWith('John', undefined)
    })

    it('should handle empty array', () => {
      const result = getFormattedExperts([])

      expect(result).toEqual([])
      expect(commonUtils.getInitials).not.toHaveBeenCalled()
    })

    it('should handle experts with multiple name parts', () => {
      const multiPartNameExperts = [
        getBookingServiceExpert({ contactId: 1, fullName: 'Jean Pierre Dubois', email: 'jean.pierre.dubois@example.com' }),
      ]

      vi.mocked(commonUtils.getInitials).mockReturnValue('JP')

      const result = getFormattedExperts(multiPartNameExperts)

      expect(result).toEqual([
        { contactId: 1, fullName: 'Jean Pierre Dubois', initials: 'JP' },
      ])
      expect(commonUtils.getInitials).toHaveBeenCalledWith('Jean', 'Pierre')
    })
  })
})

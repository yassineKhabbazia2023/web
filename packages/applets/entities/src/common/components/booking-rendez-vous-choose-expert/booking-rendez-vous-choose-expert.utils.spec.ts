import { describe, it, expect, vi } from 'vitest'
import { getFormattedExperts } from './booking-rendez-vous-choose-expert.utils'
import type { BookingServiceExpert } from '@pulse/common/types'
import * as commonUtils from '@pulse/common/utils'

const mockExperts: BookingServiceExpert[] = [
  {
    contactId: 1,
    fullName: 'John Doe',
    link: 'http://example.com/johndoe',
    email: 'john.doe@example.com',
  },
  {
    contactId: 2,
    fullName: 'Jane Smith',
    link: 'http://example.com/janesmith',
    email: 'jane.smith@example.com',
  },
]

vi.mock('@pulse/common/utils', () => ({
  getInitials: vi.fn(),
}))

describe('booking-rendez-vous-choose-expert.utils', () => {
  describe('getFormattedExperts', () => {
    it('should format experts with initials', () => {

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
      const singleNameExperts: BookingServiceExpert[] = [
        {
          contactId: 1,
          fullName: 'John',
          link: 'http://example.com/john',
          email: 'john@example.com',
        },
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
      const multiPartNameExperts: BookingServiceExpert[] = [
        {
          contactId: 1,
          fullName: 'Jean Pierre Dubois',
          link: 'http://example.com/jeanpierredubois',
          email: 'jean.pierre.dubois@example.com',
        },
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

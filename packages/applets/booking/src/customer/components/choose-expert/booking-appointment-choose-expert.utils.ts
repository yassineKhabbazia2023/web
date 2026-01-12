import { getInitials } from '@pulse/common/utils'
import type { BookingServiceExpert } from '../../../types/booking.types'

export function getFormattedExperts(experts: BookingServiceExpert[]) {
  return experts.map((expert) => {
    const { contactId, fullName } = expert

    const nameParts = fullName.split(' ')
    const [firstName, lastName] = nameParts

    return {
      contactId,
      fullName,
      initials: getInitials(firstName, lastName),
    }
  })
}

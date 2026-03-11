import { getInitials } from '@pulse/common/utils'
import type { BookingServiceExpert } from '../../../types/booking.types'

export function getFormattedExperts(experts: BookingServiceExpert[]) {
  return experts.map((expert) => {
    const { id, firstName, lastName } = expert
    const fullName = `${firstName} ${lastName}`

    return {
      id,
      fullName,
      initials: getInitials(firstName, lastName),
    }
  })
}

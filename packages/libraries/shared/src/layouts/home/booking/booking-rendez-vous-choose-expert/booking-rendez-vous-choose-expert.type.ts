import type { BookingServiceExpert } from '@pulse/common/types'

export interface BookingRendezVousChooseExpertProps {
  experts: BookingServiceExpert[]
  selectedExpertId?: number
}

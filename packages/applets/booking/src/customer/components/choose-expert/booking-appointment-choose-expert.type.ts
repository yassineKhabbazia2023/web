import type { BookingServiceExpert } from '@pulse/common/types'

export interface BookingAppointmentChooseExpertProps {
  experts: BookingServiceExpert[]
  selectedExpertId?: number
}

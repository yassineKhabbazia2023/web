import type { BookingServiceExpert } from '../../../types/booking.types'

export interface BookingAppointmentChooseExpertProps {
  experts: BookingServiceExpert[]
  selectedExpertId?: number
}

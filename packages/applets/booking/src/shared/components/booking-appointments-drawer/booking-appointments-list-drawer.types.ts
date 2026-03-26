import type { AppointmentResponse } from '@booking/types'

export interface BookingAppointmentsListDrawerProps {
  modelValue: boolean
  isCollaborator?: boolean
  upcomingAppointments?: AppointmentResponse[]
  pastAppointments?: AppointmentResponse[]
  isLoadingUpcoming?: boolean
  isLoadingPast?: boolean
}

import { BookingConfirmationStatus } from './booking-confirmation.enums'

export interface BookingConfirmationStatusProps {
  status: BookingConfirmationStatus
}

export interface BookingShareLinkProps {
  bookingUrl: string
}

export interface BookingConfirmationProps {
  isSubmitting: boolean
  bookingUrl: string
}

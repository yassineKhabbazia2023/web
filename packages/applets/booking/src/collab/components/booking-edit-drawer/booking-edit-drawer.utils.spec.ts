import type { BookingConfigurationDetails } from '@booking/types'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import {
  mapApiToAppointmentDetails,
  mapApiToTimeSlotsConfiguration,
  mapToUpdatePayload,
} from './booking-edit-drawer.utils'

describe('booking-edit-drawer.utils', () => {
  describe('mapApiToAppointmentDetails', () => {
    it('should map API response to appointment details', () => {
      const apiDetails: BookingConfigurationDetails = {
        displayName: 'Test Meeting',
        description: 'Test description',
        duration: 30,
        isOnline: true,
        availability: [],
      }

      const result = mapApiToAppointmentDetails(apiDetails)

      expect(result).toEqual({
        name: 'Test Meeting',
        description: 'Test description',
        location: '',
        isOnline: true,
        duration: 30,
      })
    })

    it('should set location to empty string', () => {
      const apiDetails: BookingConfigurationDetails = {
        displayName: 'Meeting',
        description: 'Desc',
        duration: 60,
        isOnline: false,
        availability: [],
      }

      const result = mapApiToAppointmentDetails(apiDetails)

      expect(result.location).toBe('')
    })
  })

  describe('mapApiToTimeSlotsConfiguration', () => {
    it('should map API response to time slots configuration', () => {
      const apiDetails: BookingConfigurationDetails = {
        displayName: 'Test',
        description: 'Desc',
        duration: 30,
        isOnline: true,
        availability: [
          {
            day: 'monday',
            timeSlots: [
              { start: '09:00', end: '12:00' },
              { start: '14:00', end: '17:00' },
            ],
          },
          {
            day: 'tuesday',
            timeSlots: [
              { start: '10:00', end: '16:00' },
            ],
          },
        ],
      }

      const result = mapApiToTimeSlotsConfiguration(apiDetails)

      expect(result.timeSlots).toHaveLength(3)
      expect(result.timeSlots[0]).toEqual({
        day: 'monday',
        start: '09:00',
        end: '12:00',
      })
      expect(result.timeSlots[1]).toEqual({
        day: 'monday',
        start: '14:00',
        end: '17:00',
      })
      expect(result.timeSlots[2]).toEqual({
        day: 'tuesday',
        start: '10:00',
        end: '16:00',
      })
    })

    it('should return empty array when no availability', () => {
      const apiDetails: BookingConfigurationDetails = {
        displayName: 'Test',
        description: 'Desc',
        duration: 30,
        isOnline: true,
        availability: [],
      }

      const result = mapApiToTimeSlotsConfiguration(apiDetails)

      expect(result.timeSlots).toHaveLength(0)
    })
  })

  describe('mapToUpdatePayload', () => {
    it('should map appointment details and time slots to update payload', () => {
      const appointmentDetails: AppointmentDetails = {
        name: 'Updated Meeting',
        description: 'Updated description',
        location: '',
        isOnline: false,
        duration: 60,
      }
      const timeSlotsConfiguration: TimeSlotsConfiguration = {
        timeSlots: [
          { day: 'wednesday', start: '08:00', end: '12:00' },
          { day: 'wednesday', start: '13:00', end: '17:00' },
          { day: 'friday', start: '09:00', end: '15:00' },
        ],
      }

      const result = mapToUpdatePayload(appointmentDetails, timeSlotsConfiguration)

      expect(result).toEqual({
        displayName: 'Updated Meeting',
        description: 'Updated description',
        isOnline: false,
        duration: 60,
        availability: [
          {
            day: 'wednesday',
            timeSlots: [
              { start: '08:00', end: '12:00' },
              { start: '13:00', end: '17:00' },
            ],
          },
          {
            day: 'friday',
            timeSlots: [
              { start: '09:00', end: '15:00' },
            ],
          },
        ],
      })
    })

    it('should group time slots by day', () => {
      const appointmentDetails: AppointmentDetails = {
        name: 'Meeting',
        description: 'Desc',
        location: '',
        isOnline: true,
        duration: 30,
      }
      const timeSlotsConfiguration: TimeSlotsConfiguration = {
        timeSlots: [
          { day: 'monday', start: '09:00', end: '10:00' },
          { day: 'tuesday', start: '09:00', end: '10:00' },
          { day: 'monday', start: '14:00', end: '15:00' },
        ],
      }

      const result = mapToUpdatePayload(appointmentDetails, timeSlotsConfiguration)

      const mondayAvailability = result.availability.find(a => a.day === 'monday')
      expect(mondayAvailability?.timeSlots).toHaveLength(2)
    })

    it('should return empty availability when no time slots', () => {
      const appointmentDetails: AppointmentDetails = {
        name: 'Meeting',
        description: 'Desc',
        location: '',
        isOnline: true,
        duration: 30,
      }
      const timeSlotsConfiguration: TimeSlotsConfiguration = {
        timeSlots: [],
      }

      const result = mapToUpdatePayload(appointmentDetails, timeSlotsConfiguration)

      expect(result.availability).toHaveLength(0)
    })
  })
})

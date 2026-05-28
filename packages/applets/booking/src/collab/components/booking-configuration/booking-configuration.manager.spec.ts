import { BookingConfigurationManager } from './booking-configuration.manager'
import type { TimeSlot, TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import type { DayOfWeek } from '../booking-time-slots-configuration/booking-time-slots-configuration.enums'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'

describe('BookingConfigurationManager', () => {
  describe('groupTimeSlotsByDay', () => {
    it('should return empty array when no slots provided', () => {
      const result = BookingConfigurationManager.groupTimeSlotsByDay([])

      expect(result).toEqual([])
    })

    it('should group a single slot correctly', () => {
      const slots: TimeSlot[] = [
        { day: 'monday' as DayOfWeek, start: '09:00', end: '12:00' },
      ]

      const result = BookingConfigurationManager.groupTimeSlotsByDay(slots)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        day: 'monday',
        timeSlots: [{ start: '09:00', end: '12:00' }],
      })
    })

    it('should group multiple slots for the same day', () => {
      const slots: TimeSlot[] = [
        { day: 'monday' as DayOfWeek, start: '09:00', end: '12:00' },
        { day: 'monday' as DayOfWeek, start: '14:00', end: '17:00' },
      ]

      const result = BookingConfigurationManager.groupTimeSlotsByDay(slots)

      expect(result).toHaveLength(1)
      expect(result[0].day).toBe('monday')
      expect(result[0].timeSlots).toHaveLength(2)
      expect(result[0].timeSlots).toEqual([
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' },
      ])
    })

    it('should group slots by different days', () => {
      const slots: TimeSlot[] = [
        { day: 'monday' as DayOfWeek, start: '09:00', end: '12:00' },
        { day: 'tuesday' as DayOfWeek, start: '10:00', end: '11:00' },
        { day: 'monday' as DayOfWeek, start: '14:00', end: '17:00' },
      ]

      const result = BookingConfigurationManager.groupTimeSlotsByDay(slots)

      expect(result).toHaveLength(2)

      const mondaySlots = result.find(r => r.day === 'monday')
      const tuesdaySlots = result.find(r => r.day === 'tuesday')

      expect(mondaySlots?.timeSlots).toHaveLength(2)
      expect(tuesdaySlots?.timeSlots).toHaveLength(1)
    })
  })

  describe('prepareMeetingTemplatePayload', () => {
    const baseAppointment: AppointmentDetails = {
      name: 'Test Meeting',
      description: 'Test description',
      location: 'Office',
      isOnline: true,
      duration: 30,
    }

    const baseTimeSlotsConfig: TimeSlotsConfiguration = {
      timeSlots: [],
    }

    it('should build payload with all fields', () => {
      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(baseAppointment, baseTimeSlotsConfig)

      expect(result).toEqual({
        displayName: 'Test Meeting',
        description: 'Test description',
        location: 'Office',
        isOnline: true,
        duration: 30,
        availability: [],
      })
    })

    it('should convert empty description to undefined', () => {
      const appointment: AppointmentDetails = {
        ...baseAppointment,
        description: '',
      }

      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(appointment, baseTimeSlotsConfig)

      expect(result.description).toBeUndefined()
    })

    it('should convert whitespace-only description to undefined', () => {
      const appointment: AppointmentDetails = {
        ...baseAppointment,
        description: '   ',
      }

      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(appointment, baseTimeSlotsConfig)

      expect(result.description).toBeUndefined()
    })

    it('should convert empty location to undefined', () => {
      const appointment: AppointmentDetails = {
        ...baseAppointment,
        location: '',
      }

      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(appointment, baseTimeSlotsConfig)

      expect(result.location).toBeUndefined()
    })

    it('should convert whitespace-only location to undefined', () => {
      const appointment: AppointmentDetails = {
        ...baseAppointment,
        location: '   ',
      }

      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(appointment, baseTimeSlotsConfig)

      expect(result.location).toBeUndefined()
    })

    it('should include time slots in availability', () => {
      const timeSlotsConfig: TimeSlotsConfiguration = {
        timeSlots: [
          { day: 'monday' as DayOfWeek, start: '09:00', end: '12:00' },
          { day: 'tuesday' as DayOfWeek, start: '14:00', end: '17:00' },
        ],
      }

      const result = BookingConfigurationManager.prepareMeetingTemplatePayload(baseAppointment, timeSlotsConfig)

      expect(result.availability).toHaveLength(2)
    })
  })
})

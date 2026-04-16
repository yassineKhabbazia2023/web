import { ref } from 'vue'
import type { TimeSlotsConfiguration } from './booking-time-slots-configuration.types'
import {
  getInitialTimeSlotsConfiguration,
  useBookingTimeSlotsConfiguration,
} from './booking-time-slots-configuration.composable'
import {
  DAYS_OF_WEEK,
  DEFAULT_MORNING_SLOT_START,
  DEFAULT_MORNING_SLOT_END,
  DEFAULT_AFTERNOON_SLOT_START,
  DEFAULT_AFTERNOON_SLOT_END,
} from './booking-time-slots-configuration.constants'

describe('booking-time-slots-configuration.composable', () => {
  describe('getInitialTimeSlotsConfiguration', () => {
    it('should return configuration with monday and tuesday slots', () => {
      const config = getInitialTimeSlotsConfiguration()

      expect(config.timeSlots).toHaveLength(4)

      const mondaySlots = config.timeSlots.filter(slot => slot.day === 'monday')
      const tuesdaySlots = config.timeSlots.filter(slot => slot.day === 'tuesday')

      expect(mondaySlots).toHaveLength(2)
      expect(tuesdaySlots).toHaveLength(2)
    })

    it('should create slots with default morning and afternoon times', () => {
      const config = getInitialTimeSlotsConfiguration()
      const mondaySlots = config.timeSlots.filter(slot => slot.day === 'monday')

      expect(mondaySlots[0].start).toBe(DEFAULT_MORNING_SLOT_START)
      expect(mondaySlots[0].end).toBe(DEFAULT_MORNING_SLOT_END)
      expect(mondaySlots[1].start).toBe(DEFAULT_AFTERNOON_SLOT_START)
      expect(mondaySlots[1].end).toBe(DEFAULT_AFTERNOON_SLOT_END)
    })

  })

  describe('useBookingTimeSlotsConfiguration', () => {
    const createFormData = (timeSlots: TimeSlotsConfiguration['timeSlots'] = []) => {
      return ref<TimeSlotsConfiguration>({ timeSlots })
    }

    describe('daysOfWeek', () => {
      it('should return DAYS_OF_WEEK constant', () => {
        const formData = createFormData()
        const { daysOfWeek } = useBookingTimeSlotsConfiguration(formData)

        expect(daysOfWeek).toEqual(DAYS_OF_WEEK)
      })
    })

    describe('timeOptions', () => {
      it('should generate time options with 15 minute intervals', () => {
        const formData = createFormData()
        const { timeOptions } = useBookingTimeSlotsConfiguration(formData)

        expect(timeOptions[0]).toEqual({ pValue: '00:00', pLabel: '00:00' })
        expect(timeOptions[1]).toEqual({ pValue: '00:15', pLabel: '00:15' })
        expect(timeOptions[2]).toEqual({ pValue: '00:30', pLabel: '00:30' })
        expect(timeOptions[3]).toEqual({ pValue: '00:45', pLabel: '00:45' })
        expect(timeOptions[4]).toEqual({ pValue: '01:00', pLabel: '01:00' })
      })

      it('should generate 96 time options for 24 hours', () => {
        const formData = createFormData()
        const { timeOptions } = useBookingTimeSlotsConfiguration(formData)

        expect(timeOptions).toHaveLength(96)
        expect(timeOptions[timeOptions.length - 1]).toEqual({ pValue: '23:45', pLabel: '23:45' })
      })
    })

    describe('getSlotsByDay', () => {
      it('should return slots for a specific day', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
          { day: 'tuesday', start: '09:00', end: '12:00' },
          { day: 'monday', start: '14:00', end: '18:00' },
        ])
        const { getSlotsByDay } = useBookingTimeSlotsConfiguration(formData)

        const mondaySlots = getSlotsByDay('monday')

        expect(mondaySlots).toHaveLength(2)
        expect(mondaySlots[0].start).toBe('09:00')
        expect(mondaySlots[1].start).toBe('14:00')
      })

      it('should return empty array when no slots for day', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
        ])
        const { getSlotsByDay } = useBookingTimeSlotsConfiguration(formData)

        const wednesdaySlots = getSlotsByDay('wednesday')

        expect(wednesdaySlots).toHaveLength(0)
      })
    })

    describe('getDaySlotsCount', () => {
      it('should return count of slots for a specific day', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
          { day: 'monday', start: '14:00', end: '18:00' },
          { day: 'tuesday', start: '09:00', end: '12:00' },
        ])
        const { getDaySlotsCount } = useBookingTimeSlotsConfiguration(formData)

        expect(getDaySlotsCount('monday')).toBe(2)
        expect(getDaySlotsCount('tuesday')).toBe(1)
        expect(getDaySlotsCount('wednesday')).toBe(0)
      })
    })

    describe('getSlotIndex', () => {
      it('should return index of slot by object reference', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
          { day: 'tuesday', start: '09:00', end: '12:00' },
          { day: 'monday', start: '14:00', end: '18:00' },
        ])
        const { getSlotIndex } = useBookingTimeSlotsConfiguration(formData)

        expect(getSlotIndex(formData.value.timeSlots[0])).toBe(0)
        expect(getSlotIndex(formData.value.timeSlots[1])).toBe(1)
        expect(getSlotIndex(formData.value.timeSlots[2])).toBe(2)
      })

      it('should return -1 when slot not found', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
        ])
        const { getSlotIndex } = useBookingTimeSlotsConfiguration(formData)

        const unknownSlot = { day: 'monday' as const, start: '09:00', end: '12:00' }
        expect(getSlotIndex(unknownSlot)).toBe(-1)
      })
    })

    describe('addSingleSlot', () => {
      it('should add a single slot with morning defaults', () => {
        const formData = createFormData()
        const { addSingleSlot } = useBookingTimeSlotsConfiguration(formData)

        addSingleSlot('wednesday')

        expect(formData.value.timeSlots).toHaveLength(1)
        expect(formData.value.timeSlots[0].day).toBe('wednesday')
        expect(formData.value.timeSlots[0].start).toBe(DEFAULT_MORNING_SLOT_START)
        expect(formData.value.timeSlots[0].end).toBe(DEFAULT_MORNING_SLOT_END)
      })

      it('should add multiple slots for the same day', () => {
        const formData = createFormData()
        const { addSingleSlot } = useBookingTimeSlotsConfiguration(formData)

        addSingleSlot('monday')
        addSingleSlot('monday')

        expect(formData.value.timeSlots).toHaveLength(2)
        expect(formData.value.timeSlots[0]).not.toBe(formData.value.timeSlots[1])
      })
    })

    describe('addDaySlots', () => {
      it('should add morning and afternoon slots for a day', () => {
        const formData = createFormData()
        const { addDaySlots } = useBookingTimeSlotsConfiguration(formData)

        addDaySlots('thursday')

        expect(formData.value.timeSlots).toHaveLength(2)
        expect(formData.value.timeSlots[0].day).toBe('thursday')
        expect(formData.value.timeSlots[0].start).toBe(DEFAULT_MORNING_SLOT_START)
        expect(formData.value.timeSlots[0].end).toBe(DEFAULT_MORNING_SLOT_END)
        expect(formData.value.timeSlots[1].day).toBe('thursday')
        expect(formData.value.timeSlots[1].start).toBe(DEFAULT_AFTERNOON_SLOT_START)
        expect(formData.value.timeSlots[1].end).toBe(DEFAULT_AFTERNOON_SLOT_END)
      })
    })

    describe('removeSlot', () => {
      it('should remove slot at given index', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
          { day: 'tuesday', start: '09:00', end: '12:00' },
          { day: 'wednesday', start: '09:00', end: '12:00' },
        ])
        const { removeSlot } = useBookingTimeSlotsConfiguration(formData)

        removeSlot(1)

        expect(formData.value.timeSlots).toHaveLength(2)
        expect(formData.value.timeSlots[0].day).toBe('monday')
        expect(formData.value.timeSlots[1].day).toBe('wednesday')
      })

      it('should not remove anything when index is -1', () => {
        const formData = createFormData([
          { day: 'monday', start: '09:00', end: '12:00' },
        ])
        const { removeSlot } = useBookingTimeSlotsConfiguration(formData)

        removeSlot(-1)

        expect(formData.value.timeSlots).toHaveLength(1)
      })
    })
  })
})

import { type Ref } from 'vue'
import type { DayOfWeek } from './booking-time-slots-configuration.enums'
import type { TimeSlot, TimeSlotsConfiguration } from './booking-time-slots-configuration.types'
import {
  DAYS_OF_WEEK,
  DEFAULT_MORNING_SLOT_START,
  DEFAULT_MORNING_SLOT_END,
  DEFAULT_AFTERNOON_SLOT_START,
  DEFAULT_AFTERNOON_SLOT_END,
  TIME_SLOT_INTERVAL_MINUTES,
} from './booking-time-slots-configuration.constants'

function createSingleSlot(day: DayOfWeek): TimeSlot {
  return {
    day,
    start: DEFAULT_MORNING_SLOT_START,
    end: DEFAULT_MORNING_SLOT_END,
  }
}

function createDefaultDaySlots(day: DayOfWeek): TimeSlot[] {
  return [
    {
      day,
      start: DEFAULT_MORNING_SLOT_START,
      end: DEFAULT_MORNING_SLOT_END,
    },
    {
      day,
      start: DEFAULT_AFTERNOON_SLOT_START,
      end: DEFAULT_AFTERNOON_SLOT_END,
    },
  ]
}

export function getInitialTimeSlotsConfiguration(): TimeSlotsConfiguration {
  return {
    timeSlots: [
      ...createDefaultDaySlots('monday'),
      ...createDefaultDaySlots('tuesday'),
    ],
  }
}

function generateTimeOptions(): { pValue: string; pLabel: string }[] {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL_MINUTES) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push({ pValue: timeString, pLabel: timeString })
    }
  }
  return options
}

/**
 * Time slots configuration composable
 */
export function useBookingTimeSlotsConfiguration(
  timeSlotsFormData: Ref<TimeSlotsConfiguration>,
) {
  const timeOptions = generateTimeOptions()

  function addSingleSlot(day: DayOfWeek): void {
    timeSlotsFormData.value.timeSlots.push(createSingleSlot(day))
  }

  function addDaySlots(day: DayOfWeek): void {
    timeSlotsFormData.value.timeSlots.push(...createDefaultDaySlots(day))
  }

  function removeSlot(index: number): void {
    if (index !== -1) {
      timeSlotsFormData.value.timeSlots.splice(index, 1)
    }
  }

  function getSlotsByDay(day: DayOfWeek): TimeSlot[] {
    return timeSlotsFormData.value.timeSlots.filter(timeSlot => timeSlot.day === day)
  }

  function getDaySlotsCount(day: DayOfWeek): number {
    return getSlotsByDay(day).length
  }

  function getSlotIndex(slot: TimeSlot): number {
    return timeSlotsFormData.value.timeSlots.indexOf(slot)
  }

  return {
    daysOfWeek: DAYS_OF_WEEK,
    timeOptions,
    getSlotsByDay,
    getDaySlotsCount,
    getSlotIndex,
    addSingleSlot,
    addDaySlots,
    removeSlot,
  }
}

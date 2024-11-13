import dayjs from 'dayjs'
import type { PDatePickerModelValue } from './PDatePickerTypes'

export function getCurrentDate<T extends PDatePickerModelValue>(modelValue?: T, panelDate?: T) {
  if (panelDate && !Array.isArray(panelDate)) {
    return new Date(panelDate)
  }
  if (modelValue && !Array.isArray(modelValue)) {
    return new Date(modelValue)
  }
  return new Date()
}

export function getWeekCount(currentDate: Date) {
  const firstDay = dayjs(currentDate).date(1)

  const firstWeekDay = firstDay.day()
  const daysInMonth = firstDay.daysInMonth()
  const daysBefore = firstWeekDay > 0 ? firstWeekDay - 1 : 6
  const daysCount = daysBefore + daysInMonth

  const weekCount = Math.ceil(daysCount / 7)

  return weekCount
}

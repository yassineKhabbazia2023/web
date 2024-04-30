import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { dateISOFormatter, daysInTheMonth } from '@/schedule/helpers/utils'

export function getDates(deadlineItems: DeadlinesByDate[]) {
  return deadlineItems.reduce<string[]>((dates: string[], deadlineItem) => {
    const { date } = deadlineItem
    if (!dates.includes(date)) {
      dates.push(date)
    }
    return dates
  }, [])
}

export function getMonthInterval(date: Date) {
  const lastDayOfMonth = daysInTheMonth(date.getFullYear(), date.getMonth() + 1)
  const startDate = new Date(date)
  const endDate = new Date(date)

  startDate.setDate(1)
  endDate.setDate(lastDayOfMonth)

  return {
    startDate: dateISOFormatter(startDate),
    endDate: dateISOFormatter(endDate),
  }
}

import dayjs from 'dayjs'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'

export function getDates(deadlineItems: DeadlinesByDate[]) {
  return deadlineItems.reduce<string[]>((dates: string[], deadlineItem) => {
    const { date } = deadlineItem
    if (!dates.includes(date)) {
      dates.push(date)
    }
    return dates
  }, [])
}

export function getMonthInterval(date: Date, extendsIntervalDays: number) {
  const startDate = dayjs(date)
    .startOf('month')
    .subtract(extendsIntervalDays, 'days')
    .format('YYYY-MM-DD')
  const endDate = dayjs(date)
    .endOf('month')
    .add(extendsIntervalDays, 'days')
    .format('YYYY-MM-DD')

  return {
    startDate,
    endDate,
  }
}

export function getAdvancedSearchParams(date: Date, searchTerm: string) {
  const startDate = dayjs(date)
    .subtract(1, 'year')
    .format('YYYY-MM-DD')
  const endDate = dayjs(date)
    .add(1, 'year')
    .format('YYYY-MM-DD')

  return {
    startDate,
    endDate,
    searchTerm,
  }
}

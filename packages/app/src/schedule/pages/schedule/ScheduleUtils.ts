import dayjs from 'dayjs'
import type { DeadlinesByDate } from '@app/schedule/models/Deadline'
import type { Filters } from '@app/schedule/components/FilterDrawer/FilterDrawerTypes'
import type { ScheduleApiQueryParams } from '@app/schedule/services/scheduleServiceTypes'

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

export function getAdvancedSearchParams(date: Date, searchTerm: string, filters: Filters) {
  const startDate = dayjs(date)
    .subtract(1, 'year')
    .format('YYYY-MM-DD')
  const endDate = dayjs(date)
    .add(1, 'year')
    .format('YYYY-MM-DD')
  const {
    targets,
    templates,
    status,
    mineOnly,
  } = filters

  return {
    startDate,
    endDate,
    searchTerm,
    targets,
    templates,
    status,
    mineOnly,
  }
}

export function getSearchParams(date: Date, filters: Filters) {
  const {
    startDate,
    endDate,
  } = getMonthInterval(date, 7)
  const {
    targets,
    templates,
    status,
    mineOnly,
  } = filters

  return {
    startDate,
    endDate,
    targets,
    templates,
    status,
    mineOnly,
  } as ScheduleApiQueryParams
}

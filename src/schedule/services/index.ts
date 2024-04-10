import { commonApi as api } from '@kpmg/common'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import type { Account } from '@/schedule/models/Account'
import type { KeyLabel } from '@/schedule/models/commonTypes'
import type { Schedule } from '@/schedule/components/CreateSchedule/Form/CreateScheduleFormModel'
import { CSV_DATA } from './scheduleCollection'
import type { ScheduleModelLabelType } from './scheduleServiceTypes'

export const getSchedulesCollection = async (
  { startDate, endDate }: {startDate: string, endDate: string}): Promise<DeadlinesByDate[]> => {
  const { data } = await api().schedule.get('/schedules', { params: { startDate, endDate } })
  return data
}

export const getAccountsCollection = async (): Promise<Account[]> => {
  const { data } = await api().schedule.get('/accounts')
  return data
}

export const postSchedule = async (schedule: Schedule) => {
  const { data } = await api().schedule.post('/schedules', {
    ...schedule,
  })
  return data
}

function getScheduleModelLabel(
  labelType: ScheduleModelLabelType,
  shortLabel: string,
  longLabel: string,
): string {
  if (labelType === 'short' || shortLabel === longLabel) {
    return shortLabel
  }
  if (labelType === 'long') {
    return longLabel
  }
  return `${shortLabel} (${longLabel})`
}

export function getScheduleModels(labelType: ScheduleModelLabelType): KeyLabel[] {
  return CSV_DATA
    .split('\n')
    .map((row) => {
      const [key, shortLabel, longLabel] = row.split(',')
      const label = getScheduleModelLabel(labelType, shortLabel, longLabel)

      return {
        key,
        label,
      }
    })
}

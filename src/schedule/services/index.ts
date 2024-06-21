import { commonApi as api } from '@kpmg/common'
import type { DeadlinesByDate, Occurrence, Status } from '@/schedule/models/Deadline'
import type { Account } from '@/schedule/models/Account'
import type { KeyLabel } from '@/schedule/models/commonTypes'
import type { Schedule } from '@/schedule/components/CreateSchedule/CreateScheduleForm/CreateScheduleFormModel'
import { CSV_DATA } from './scheduleCollection'
import type { ScheduleModelLabelType, ScheduleApiQueryParams } from './scheduleServiceTypes'

export function getSerializedParam(key: string, values: (string|number)[]) {
  return values
    .map((value) => `${key}=${value}`)
    .join('&')
}

export const getSchedulesCollection = async (params: ScheduleApiQueryParams) => {
  const { data } = await api().schedule.get<DeadlinesByDate[]>('/schedules', {
    params,
    paramsSerializer: {
      indexes: true,
    },
  })
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

function getCsvData(includesOther: boolean): string[] {
  const csvData = CSV_DATA.split('\n')
  return includesOther
    ? [
        ...csvData,
        'autre,Autre,Autre',
      ]
    : csvData
}

export function getScheduleModels(
  labelType: ScheduleModelLabelType,
  includesOther = false,
): KeyLabel[] {
  const csvData = getCsvData(includesOther)
  return csvData
    .map((row) => {
      const [key, shortLabel, longLabel] = row.split(',')
      const label = getScheduleModelLabel(labelType, shortLabel, longLabel)

      return {
        key,
        label,
      }
    })
}

export function getScheduleModelsByKey(labelType: ScheduleModelLabelType): Record<string, string> {
  const scheduleModels = getScheduleModels(labelType)

  return scheduleModels
    .reduce<Record<string, string>>((scheduleModelsByKey, scheduleModel) => {
      const { key, label } = scheduleModel
      scheduleModelsByKey[key] = label
      return scheduleModelsByKey
    }, {})
}

export const getFrequenciesCollection = () => {
  return Promise.resolve(['Monthly', 'Quarterly', 'Yearly', 'None'])
}

export async function getOccurrence(occurrenceId: number) {
  const url = `/occurrences/${occurrenceId}`
  const { data } = await api().schedule.get<Occurrence>(url)

  return data
}

export async function postDeadlineAccountStatus(
  occurrenceId: number,
  accountId: number,
  status: Status,
) {
  const url = `/occurrences/${occurrenceId}/accounts/${accountId}/deadline-status`
  const payload = {
    status,
  }
  const response = await api().schedule.post<Occurrence>(url, payload)

  return response.data
}

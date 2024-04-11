import { describe, it, expect, vi } from 'vitest'
import {
  getSchedulesCollection,
  getAccountsCollection,
  postSchedule,
  getScheduleModels,
  getScheduleModelsByKey,
} from '.'
import type { Account } from '@/schedule/models/Account'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { doneDeadlinesByDateMock, createScheduleMock } from '@/schedule/tests/mocks/Deadline'
import type { ScheduleModelLabelType } from './scheduleServiceTypes'

const getMockApiImplementation = (mockData: Account[] | DeadlinesByDate[]) => Promise.resolve({
  data: mockData,
})

const scheduleId = '1234-332-32121-212'

vi.mock('@kpmg/common', () => {
  return {
    commonApi: () => ({
      schedule: {
        get: vi.fn((url, _) => {
          if (/^\/schedules$/.test(url)) {
            return getMockApiImplementation(doneDeadlinesByDateMock)
          }
          if (/^\/accounts$/.test(url)) {
            return getMockApiImplementation(accountsCollection)
          }
        }),
        post: vi.fn((url, _) => {
          if (/^\/schedules$/.test(url)) {
            return Promise.resolve({ data: { id: scheduleId } })
          }
        }),
      },
    }),
  }
})

describe('getSchedulesCollection', () => {
  it('should return schedules list', async () => {
    const data = await getSchedulesCollection({ startDate: '2024-03-31', endDate: '2024-03-31' })
    expect(data).toStrictEqual(doneDeadlinesByDateMock)
  })
})

describe('getAccountsCollection', () => {
  it('should return accounts list', async () => {
    const data = await getAccountsCollection()
    expect(data).toStrictEqual(accountsCollection)
  })
})

describe('postSchedule', () => {
  it('should return an id of the new schedule', async () => {
    const data = await postSchedule(createScheduleMock)
    expect(data).toStrictEqual({ id: scheduleId })
  })
})

describe('getScheduleModels', () => {
  const labelTypes: ScheduleModelLabelType[] = [
    'short',
    'long',
    'both',
  ]
  it.each(labelTypes)('should return proper list when labelType = \'%i\'', (labelType) => {
    const data = getScheduleModels(labelType)
    expect(data).toMatchFileSnapshot(`__snap__/getScheduleModels/${labelType}.snap`)
  })
})

describe('getScheduleModelsByKey', () => {
  const labelTypes: ScheduleModelLabelType[] = [
    'short',
    'long',
    'both',
  ]
  it.each(labelTypes)('should return proper list when labelType = \'%i\'', (labelType) => {
    const data = getScheduleModelsByKey(labelType)
    expect(data).toMatchFileSnapshot(`__snap__/getScheduleModelsByKey/${labelType}.snap`)
  })
})

import { describe, it, expect, vi } from 'vitest'
import {
  getSchedulesCollection,
  getAccountsCollection,
  postSchedule,
  getScheduleModels,
  getScheduleModelsByKey,
  getFrequenciesCollection,
  getOccurrence,
  postDeadlineAccountStatus,
  getOccurrenceAttachment,
} from '.'
import { accountsCollection } from '@app/schedule/tests/mocks/Account'
import { getMockSchedule, frequenciesMock } from '@app/schedule/tests/mocks/Schedule'
import type { ScheduleModelLabelType } from './scheduleServiceTypes'
import { getMockedOccurrence } from '../tests/mocks/Occurrence'
import { getDoneDeadlinesByDateMock } from '../tests/mocks/Deadline'

const scheduleId = '1234-332-32121-212'
const mockedOccurrence = getMockedOccurrence()
const createScheduleMock = getMockSchedule()

const commonApiGetSpy = vi.fn()
const commonApiPostSpy = vi.fn()

vi.mock('@pulse/common', () => {
  return {
    commonApi: () => ({
      schedule: {
        get: commonApiGetSpy,
        post: commonApiPostSpy,
      },
    }),
    dataProvider: () => {
      return {
        fetchUserData: vi.fn(),
      }
    },
  }
})

describe('getSchedulesCollection', () => {
  it('should return mocked response with proper params', async () => {
    const mockedDeadlinesByDate = getDoneDeadlinesByDateMock()
    commonApiGetSpy.mockResolvedValueOnce({ data: mockedDeadlinesByDate })
    const params = {
      startDate: '2024-03-31',
      endDate: '2024-03-31',
      searchTerm: 'abc',
      template: ['TVA'],
    }
    const expectedUrl = '/schedules'
    const data = await getSchedulesCollection(params)
    const expectedParams = {
      params,
      paramsSerializer: {
        indexes: true,
      },
    }

    expect(commonApiGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGetSpy).toHaveBeenNthCalledWith(1, expectedUrl, expectedParams)
    expect(data).toStrictEqual(mockedDeadlinesByDate)
  })
})

describe('getAccountsCollection', () => {
  it('should return accounts list', async () => {
    commonApiGetSpy.mockResolvedValueOnce({ data: accountsCollection })

    const expectedUrl = '/accounts'
    const data = await getAccountsCollection()

    expect(commonApiGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGetSpy).toHaveBeenNthCalledWith(1, expectedUrl)
    expect(data).toStrictEqual(accountsCollection)
  })
})

describe('postSchedule', () => {
  it('should return an id of the new schedule', async () => {
    const mockedData = { id: scheduleId }
    commonApiPostSpy.mockResolvedValueOnce({ data: mockedData })

    const expectedUrl = '/schedules'
    const data = await postSchedule(createScheduleMock)

    expect(commonApiPostSpy).toHaveBeenCalledOnce()
    expect(commonApiPostSpy).toHaveBeenNthCalledWith(1, expectedUrl, createScheduleMock)
    expect(data).toStrictEqual(mockedData)
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
  it.each(labelTypes)('should return proper list when labelType = \'%i\' and includes autre', (labelType) => {
    const data = getScheduleModels(labelType, true)
    expect(data).toMatchFileSnapshot(`__snap__/getScheduleModels/${labelType}.withOthers.snap`)
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

describe('getFrequenciesCollection', () => {
  it('should return frequencies collection', async () => {
    const data = await getFrequenciesCollection()
    expect(data).toStrictEqual(frequenciesMock)
  })
})

describe('getOccurrence', () => {
  it('should return a specific occurrence', async () => {
    commonApiGetSpy.mockResolvedValueOnce({ data: mockedOccurrence })
    const occurrenceId = mockedOccurrence.id

    const expectedUrl = `/occurrences/${occurrenceId}`
    const data = await getOccurrence(occurrenceId)

    expect(commonApiGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGetSpy).toHaveBeenNthCalledWith(1, expectedUrl)
    expect(data).toStrictEqual(mockedOccurrence)
  })
})

describe('postDeadlineAccountStatus', () => {
  it('should call schedule.post with proper url and payloads', async () => {
    commonApiPostSpy.mockResolvedValueOnce({ data: mockedOccurrence })
    const occurrenceId = mockedOccurrence.id
    const accountId = 12
    const status = 'Done'

    const expectedUrl = `/occurrences/${occurrenceId}/accounts/${accountId}/deadline-status`
    const expectedPayload = {
      status,
    }
    const data = await postDeadlineAccountStatus(occurrenceId, accountId, status)

    expect(commonApiPostSpy).toHaveBeenCalledOnce()
    expect(commonApiPostSpy).toHaveBeenNthCalledWith(1, expectedUrl, expectedPayload)
    expect(data).toStrictEqual(mockedOccurrence)
  })
})

describe('getOccurrenceAttachment', () => {
  it('should return an attachment blob', async () => {
    const attachmentContent = 'schedule attachment blob'
    commonApiGetSpy.mockResolvedValueOnce({ data: new Blob([attachmentContent]) })
    const { data: attachment } = await getOccurrenceAttachment(123456)
    expect(attachment).toStrictEqual(new Blob([attachmentContent]))
  })
})

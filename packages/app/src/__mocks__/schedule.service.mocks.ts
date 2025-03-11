import { accountsCollection } from '@app/__mocks__/accounts.mocks'
import { getMockedDeadlines } from '@app/__mocks__/deadline.mocks'
import { tvaLabelMock } from '@app/__mocks__/schedule.mocks'

export const TEST_DATE = '2024-08-14'

export const getAccountsCollectionMock = vi.fn(() => accountsCollection)
export const getAdvancedSearchParamsMock = vi.fn()
export const getFrequenciesCollectionMock = vi.fn(() => [])
export const getOccurrenceMock = vi.fn()
export const getOccurrenceAttachmentMock = vi.fn()
export const postDeadlineAccountStatusMock = vi.fn()
export const getScheduleModelsMock = vi.fn((longLabels: boolean) => [{
  key: 'TVA',
  label: longLabels ? 'TVA au 21' : 'TVA',
}])
export const getScheduleModelsByKeyMock = vi.fn(() => ({
  TVA: tvaLabelMock,
}))
export const getSchedulesCollectionMock = vi.fn(() => ([{
  date: TEST_DATE,
  deadlines: getMockedDeadlines(),
}]))
export const postScheduleMock = vi.fn()

export const scheduleServicesMock = {
  getAccountsCollection: getAccountsCollectionMock,
  getAdvancedSearchParams: getAdvancedSearchParamsMock,
  getFrequenciesCollection: getFrequenciesCollectionMock,
  getOccurrence: getOccurrenceMock,
  getOccurrenceAttachment: getOccurrenceAttachmentMock,
  getScheduleModels: getScheduleModelsMock,
  getScheduleModelsByKey: getScheduleModelsByKeyMock,
  getSchedulesCollection: getSchedulesCollectionMock,
  postDeadlineAccountStatus: postDeadlineAccountStatusMock,
  postSchedule: postScheduleMock,
}
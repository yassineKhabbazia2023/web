import { getDeadlineCompletionSummary, getProgressText } from '@app/schedule/helpers/deadlineHelper'
import { expect, describe, it } from 'vitest'
import type { DeadlineAccount, Status } from '@app/schedule/models/Deadline'
import { getNotCompletelyDoneDeadlinesByDateMock } from '@app/schedule/tests/mocks/Deadline'

function getMockedAccount(id: number, status: Status): DeadlineAccount {
  return {
    id,
    name: `Account ${id}`,
    status,
  }
}

describe('deadline helpers', () => {
  describe('getDeadlineCompletionSummary', () => {
    it('should return completion object', () => {
      const mockDeadlines = getNotCompletelyDoneDeadlinesByDateMock()
      const accountList = mockDeadlines[0].deadlines[0].accountList

      const summary = getDeadlineCompletionSummary(accountList)
      expect(summary).toStrictEqual({
        accountsAmount: 2,
        accountsWithCompletedDeadline: 1,
      })
    })
  })

  describe('getProgressText', () => {
    const doneLabel = 'faits'
    const tests = [{
      accountList: [
        getMockedAccount(1, 'Todo'),
        getMockedAccount(2, 'Todo'),
      ],
      expectedProgressText: `0/2 ${doneLabel}`,
      reason: 'none of two is done',
    }, {
      accountList: [
        getMockedAccount(3, 'Done'),
        getMockedAccount(4, 'Todo'),
      ],
      expectedProgressText: `1/2 ${doneLabel}`,
      reason: 'one of two is done',
    }, {
      accountList: [
        getMockedAccount(5, 'Done'),
        getMockedAccount(6, 'Done'),
      ],
      expectedProgressText: `2/2 ${doneLabel}`,
      reason: 'two of two are done',
    }, {
      accountList: [
        getMockedAccount(7, 'Todo'),
      ],
      expectedProgressText: 'Account 7',
      reason: 'one of one is done',
    }, {
      accountList: [
        getMockedAccount(8, 'Done'),
      ],
      expectedProgressText: 'Account 8',
      reason: 'none of one is done',
    }]

    it.each(tests)('should return $expectedProgressText when $reason', ({ accountList, expectedProgressText }) => {
      const progressText = getProgressText(accountList, doneLabel)

      expect(progressText).toBe(expectedProgressText)
    })
  })
})

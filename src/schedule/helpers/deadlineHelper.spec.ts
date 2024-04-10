import { getDeadlineCompletionSummary } from '@/schedule/helpers/deadlineHelper'
import { expect, describe, it } from 'vitest'
import type { Deadline } from '@/schedule/models/Deadline'
import { notCompletelyDoneDeadlinesByDateMock } from '@/schedule/tests/mocks/Deadline'

const accountsList: Deadline['accountList'] =
  notCompletelyDoneDeadlinesByDateMock[0].deadlines[0].accountList

describe('deadline helpers', () => {
  it('should return completion object', () => {
    const summary = getDeadlineCompletionSummary(accountsList)
    expect(summary).toStrictEqual({
      accountsAmount: 2,
      accountsWithCompletedDeadline: 1,
    })
  })
})

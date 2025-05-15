import { expect, describe, it } from 'vitest'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { OperationStatus } from '@entities/common/types/OperationTypes'

import { getPendingOperations } from './operation.utils'

const mockedOperations = getMockedOperations()

describe('test ManageAccessDrawer', () => {
  describe('getPendingOperations', () => {
    it('should only return PENDING operations', () => {
      const pendingOperations = getPendingOperations(mockedOperations)

      const hasRejectedOperation = pendingOperations
        .some((({ status }) => status === OperationStatus.REJECTED))
      const hasApprovedOperation = pendingOperations
        .some((({ status }) => status === OperationStatus.APPROVED))

      expect(hasRejectedOperation).toBe(false)
      expect(hasApprovedOperation).toBe(false)
    })
  })
})

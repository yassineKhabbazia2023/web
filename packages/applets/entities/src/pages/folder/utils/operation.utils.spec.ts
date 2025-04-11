import { expect, describe, it } from 'vitest'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { OperationStatus } from '@entities/common/types/OperationTypes'

import { getPendingOperations } from './operation.utils'

const mockedOperations = getMockedOperations()

describe('test ManageAccessDrawer', () => {
  describe('getPendingOperations', () => {
    it('should NOT return any REJECTED operation', () => {
      const pendingOperations = getPendingOperations(mockedOperations)

      const hasRejectedOperation = pendingOperations
        .some((({ status }) => status === OperationStatus.REJECTED))

      expect(hasRejectedOperation).toBe(false)
    })
  })
})

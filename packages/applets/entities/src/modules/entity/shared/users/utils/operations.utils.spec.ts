import { expect, describe, it } from 'vitest'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { OperationStatus } from '@entities/enums'

import {
  getPendingOperations,
  getOperationsWithLegalName,
  getAccountOperationsList,
} from './operations.utils'

const mockedOperations = getMockedOperations()

describe('operations.utils', () => {
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

  describe('getOperationsWithLegalName', () => {
    const legalNameMock = 'legal Name'

    it('should return operations enriched with legalName when it`s missing', () => {
      const defaultLegalName = 'default legalName'
      const operationMock = mockedOperations[0]

      const operationWithLegalName = {
        ...operationMock,
        legalName: legalNameMock,
      }
      const operationWithoutLegalName = {
        ...operationMock,
        legalName: '',
      }
      const operationWithDefaultLegalName = {
        ...operationMock,
        legalName: defaultLegalName,
      }
      const operations = [
        operationWithLegalName,
        operationWithoutLegalName,
      ]
      const expectedOperationsWithLegalName = [
        operationWithLegalName,
        operationWithDefaultLegalName,
      ]
      const operationsWithLegalName = getOperationsWithLegalName(operations, defaultLegalName)

      expect(operationsWithLegalName).toStrictEqual(expectedOperationsWithLegalName)
    })
  })

  describe('getAccountOperationsList', () => {
    const accountNumber = mockedOperations[0].accountNumber
    const tests = [{
      operations: mockedOperations,
      expectedAccountOperationsList: [{
        operations: mockedOperations,
        accountNumber,
        accountName: '',
      }],
      reason: 'operations is NOT empty',
    }, {
      operations: [],
      expectedAccountOperationsList: [],
      reason: 'operations is empty',
    }]
    it.each(tests)('should proper accountOperationsList when $reason', ({
      operations,
      expectedAccountOperationsList,
    }) => {
      const accountOperationsList = getAccountOperationsList(operations)

      expect(accountOperationsList).toStrictEqual(expectedAccountOperationsList)
    })
  })
})

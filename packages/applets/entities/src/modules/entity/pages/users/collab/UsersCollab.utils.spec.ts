import { getOperationsWithLegalName, getAccountOperationsList } from './UsersCollab.utils'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'

const legalNameMock = 'legal Name'
const operationsMock = getMockedOperations()

describe('UsersCollab.utils', () => {
  describe('getOperationsWithLegalName', () => {
    it('should return operations enriched with legalName when it`s missing', () => {
      const defaultLegalName = 'default legalName'
      const operationMock = operationsMock[0]

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
    const accountNumber = operationsMock[0].accountNumber
    const tests = [{
      operations: operationsMock,
      expectedAccountOperationsList: [{
        operations: operationsMock,
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

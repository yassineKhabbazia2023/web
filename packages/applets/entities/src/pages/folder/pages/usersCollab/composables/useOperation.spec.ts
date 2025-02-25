import { expect, describe, it } from 'vitest'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { useOperation } from './useOperation'
import { type Operation, OperationStatus } from '@entities/common/types/OperationTypes'

const mockedOperations = getMockedOperations()
const nonRejectedOperations = mockedOperations.filter(
  (operation: Operation) => operation.status !== OperationStatus.REJECTED,
)

describe('useOperation – Composable for sharing and managing operations data between components', () => {
  it('should return the operations after they are set', () => {
    const { operations } = useOperation()
    operations.value = mockedOperations

    expect(operations.value).toStrictEqual(mockedOperations)
  })
  it('should return only the operations that are not rejected', () => {
    const { operations, availableOperations } = useOperation()
    operations.value = mockedOperations

    expect(availableOperations.value).toStrictEqual(nonRejectedOperations)
  })
})

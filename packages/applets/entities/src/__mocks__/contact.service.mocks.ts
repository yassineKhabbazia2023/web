import { getPaginationMock } from '@pulse/common/mocks'
import { getAccountOperationsListMock, getMockedOperations } from './operations.mocks'

export const fetchOperationsByAccountMock = vi.fn(() => {
  const accountOperationMock = getAccountOperationsListMock()

  return getPaginationMock({
    items: accountOperationMock,
    totalPages: 1,
    currentPage: 1,
    totalItems: accountOperationMock.length,
  })
})

const fetchOperationsForAccountMock = vi.fn(() => getMockedOperations())
export const contactServiceMock = {
  fetchOperationsForAccount: fetchOperationsForAccountMock,
  fetchAccountOperations: fetchOperationsByAccountMock,
}

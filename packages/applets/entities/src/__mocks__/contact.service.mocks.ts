import { getPaginationMock } from '@pulse/common/mocks'
import { getOperationsByAccountsMock, getMockedOperations } from './operations.mocks'

export const fetchOperationsByAccountMock = vi.fn(() => {
  const accountOperationMock = getOperationsByAccountsMock()

  return getPaginationMock({
    items: accountOperationMock,
    totalPages: 1,
    currentPage: 1,
    totalItems: accountOperationMock.length,
  })
})

export const contactServiceMock = {
  fetchAccountOperations: vi.fn(() => Promise.resolve(() => getMockedOperations())),
  fetchOperationsByAccount: fetchOperationsByAccountMock,
}

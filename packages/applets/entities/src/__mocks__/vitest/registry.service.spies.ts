import { getPaginationMock } from '@pulse/common/mocks'
import { fetchAccountOperations, fetchOperationsForAccount } from '@entities/services/registry'
import { getAccountOperationsListMock, getMockedOperations } from '../operations.mocks'

// The registry service is spy-wrapped project-wide (vitest.setup.ts): these
// legacy names alias the shared spies so specs keep their assertions. Consumer
// specs arm the legacy default behaviors per test with
// armRegistryServiceMocks() (the guards re-arm the real implementations before
// every test).
export const fetchAccountOperationsMock = vi.mocked(fetchAccountOperations)
export const fetchOperationsForAccountMock = vi.mocked(fetchOperationsForAccount)

export function armRegistryServiceMocks(): void {
  fetchAccountOperationsMock.mockImplementation(() => {
    const accountOperationMock = getAccountOperationsListMock()

    return Promise.resolve(getPaginationMock({
      items: accountOperationMock,
      totalPages: 1,
      currentPage: 1,
      totalItems: accountOperationMock.length,
    }))
  })
  fetchOperationsForAccountMock.mockImplementation(() => Promise.resolve(getMockedOperations()))
}

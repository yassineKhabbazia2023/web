import { getMockedOperations, getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { getPaginationMock } from '@pulse/common/mocks'
import { OperationStatus } from '@entities/enums'
import type { AccountOperations } from './registry.type'
import {
  fetchOperationsForAccount,
  fetchAccountOperations,
  patchOperationStatus,
} from '.'

const mockedAccountId = 125
const mockedOperations = getMockedOperations()

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
}))

vi.mock('@pulse/common/api', () => {
  return {
    api: ({
      gateway: {
        get: mocks.get,
        patch: mocks.patch,
      },
    }),
  }
})

describe('operation service', () => {
  describe('fetchOperationsForAccount', () => {
    it('should return the list of operations associated with an account', async () => {
      await fetchOperationsForAccount(mockedAccountId)

      expect(mocks.get).toHaveBeenCalledWith(
        'registry/api/operations',
        { params: { accountId: mockedAccountId } },
      )
    })
  })

  describe('fetchAccountOperations', () => {
    it('should return the list of operations', async () => {
      const page = 1
      const pageSize = 3
      const search = 'search terms'
      const expectedUrl = 'registry/api/currentuser/operations'
      const params = {
        page,
        pageSize,
        search,
      }
      const expectedArgument = { params }
      const mockedResponse = getPaginationMock<AccountOperations>({
        items: getAccountOperationsListMock(),
      })

      mocks.get.mockResolvedValueOnce({
        data: mockedResponse,
      })

      const operations = await fetchAccountOperations(page, pageSize, search)

      expect(mocks.get).toHaveBeenCalledWith(expectedUrl, expectedArgument)
      expect(operations).toStrictEqual(mockedResponse)
    })
  })

  describe('patchOperationStatus', () => {
    it('should call the correct endpoint with the right params/body to update the operation status', async () => {
      await patchOperationStatus(
        mockedOperations[0].operationId,
        OperationStatus.APPROVED,
      )

      expect(mocks.patch).toHaveBeenCalledWith(
        `registry/api/operations/${mockedOperations[0].operationId}/currentuser`,
        [{ op: 'replace', path: '/status', value: 'APPROVED' }],
      )
    })
  })
})

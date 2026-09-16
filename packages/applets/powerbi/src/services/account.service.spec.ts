import { apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { getMockedAccountResponse } from '@powerbi/__mocks__/bi-report.mocks'
import { fetchAccount } from './account.service'

const mockAccountId = 602

// '@pulse/common/api' is hubbed worker-wide (packages/@config/vitest.setup.hubs.ts):
// the service converges on the shared api-gateway spy armed below.

describe('fetchAccount()', () => {
  it('should fetch the account of the current user and return its data', async () => {
    const mockAccount = getMockedAccountResponse()
    apiGatewayGetMock.mockResolvedValueOnce({ data: mockAccount })

    const account = await fetchAccount(mockAccountId)

    expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.ACCOUNT}/accounts/${mockAccountId}/currentuser`)
    expect(account).toEqual(mockAccount)
  })
})

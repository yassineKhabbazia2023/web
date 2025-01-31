import { fetchUserEntityServices } from './Services'
import { describe, it, expect } from 'vitest'
import { commonApiGatewayGetSpy } from '@ged/../vitest.setup'

describe('fetchUserEntityServices', () => {
  it('should return folder object', async () => {
    const accountNumber = '1234'
    const accountId = 1234
    await fetchUserEntityServices(accountNumber, accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(
      `/ged/accounts/${accountNumber}/ged-services/currentuser`,
      {
        headers: { 'Account-Id': accountId },
      },
    )
  })
})

import { fetchUserEntityServices } from './Services'
import { describe, it, expect } from 'vitest'
import { commonApiGatewayGetSpy } from '@/../vitest.setup'

describe('fetchUserEntityServices', () => {
  it('should return folder object', async () => {
    const accountId = '1234'
    await fetchUserEntityServices(accountId)

    expect(commonApiGatewayGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(
      `/ged/accounts/${accountId}/ged-services/currentuser`,
    )
  })
})

import { fetchUserEntityServices } from './Services'
import { describe, it, expect } from 'vitest'
import { commonApiGatewayGetSpy } from '@/../vitest.setup'

describe('fetchUserEntityServices', () => {
  it('should return folder object', async () => {
    await fetchUserEntityServices('serviceId')

    expect(commonApiGatewayGetSpy).toHaveBeenCalledOnce()
    expect(commonApiGatewayGetSpy).toHaveBeenCalledWith(
      '/wallet/api/permissions/256/services',
    )
  })
})

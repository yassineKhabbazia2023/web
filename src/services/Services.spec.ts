import { fetchUserEntityServices } from './Services'
import { describe, it, expect } from 'vitest'
import { commonApiPortalGetSpy } from '@/../vitest.setup'

describe('fetchUserEntityServices', () => {
  it('should return folder object', async () => {
    const portal = 'test'
    commonApiPortalGetSpy.mockResolvedValueOnce({
      data: {
        value: portal,
      },
    })
    const folder = await fetchUserEntityServices('serviceId')

    expect(commonApiPortalGetSpy).toHaveBeenCalledOnce()
    expect(commonApiPortalGetSpy).toHaveBeenCalledWith('GetUserServicesByAccountId?accountId=serviceId')
    expect(folder).toBe(portal)
  })
})

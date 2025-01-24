
import { it, expect, describe } from 'vitest'
import { commonApiDsGetSpy } from '@ged/../vitest.setup'
import {
  fetchTrashDocuments,
} from './TrashDocuments'
import type { Service } from '@ged/models/Service'

describe('trash documents service', () => {
  it('should fetsh trash documents when fetchTrashDocuments is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A' }
    const trashedDocumentValue = 'trashed-document'

    commonApiDsGetSpy.mockResolvedValueOnce({
      data: trashedDocumentValue,
    })
    const accountId = 'my-account-id'

    const trashed = await fetchTrashDocuments(service.ServiceId, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledOnce()
    expect(commonApiDsGetSpy).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/mapped/currentuser',
      {
        params: {
          limit: 10,
          skip: 0,
          sort: '-deleted',
        },
      },
    )
    expect(trashed).toBe(trashedDocumentValue)
  })
})

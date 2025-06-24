import { it, expect, describe } from 'vitest'
import { commonApiDsGetSpy } from '@ged/__mocks__/common.import.mocks'
import { accountId, accountNumber } from '@ged/__mocks__/files.mocks'
import type { Service } from '@ged/models/Service'

import {
  fetchTrashDocuments,
} from './TrashDocuments'

describe('trash documents service', () => {
  it('should fetch trash documents when fetchTrashDocuments is called', async () => {
    const service: Service = { ServiceId: 'service-1', ServiceName: 'A', IsReadOnly: false }
    const trashedDocumentValue = 'trashed-document'

    commonApiDsGetSpy.mockResolvedValueOnce({
      data: trashedDocumentValue,
    })

    const trashed = await fetchTrashDocuments(service.ServiceId, accountNumber, accountId)

    expect(commonApiDsGetSpy).toHaveBeenCalledOnce()
    expect(commonApiDsGetSpy).toHaveBeenCalledWith(
      'service-1/my-account-id/trash/mapped/currentuser',
      {
        headers: { 'Account-Id': accountId },
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

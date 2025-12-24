import { http, HttpResponse } from 'msw'
import { mockedPennylaneDocumentsQueryResult } from '@pulse/common/mocks'

export const pennylaneHandlers = [
  http.get('*/pennylane/accounts/:accountId/documents/currentuser', () => {
    return HttpResponse.json(mockedPennylaneDocumentsQueryResult)
  }),

  http.get('*/pennylane/accounts/:accountId/documents/:documentId/content/currentuser', async () => {
    const response = await fetch('/assets/sample.pdf')
    const buffer = await response.arrayBuffer()
    return new HttpResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }),
]

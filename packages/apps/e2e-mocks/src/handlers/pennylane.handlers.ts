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

  http.post('*/pennylane/accounts/:accountId/documents/archive/currentuser', () => {
    const blob = new Blob(['mock archive content'], { type: 'application/zip' })
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=documents-rydge-conseil_17-09-2026.zip; '
          + 'filename*=UTF-8\'\'documents-rydge-conseil_17-09-2026.zip',
      },
    })
  }),
]

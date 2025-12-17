import { http, HttpResponse } from 'msw'
import {
  servicesDataMock,
  mailToGedServicesLines,
  foldersData,
  getMockedFolder,
  documentsResponsePayload,
  binDocumentsMock,
} from '@pulse/ged/mocks'

// Mock SignalR connection ID
const MOCK_CONNECTION_ID = 'mock-signalr-connection-id'

function getFoldersByServiceId(serviceId: string) {
  if (serviceId === 'service-id-compta') {
    return foldersData[0]
  }
  if (serviceId === 'service-id-gs') {
    return foldersData[1]
  }
  return []
}

export const gedHandlers = [
  // Services (gateway API)
  http.get('*/ged/accounts/:entityId/ged-services/currentuser', () => {
    return HttpResponse.json(servicesDataMock)
  }),

  http.get('*/ged/api/:serviceId/:entityId/mail2ged/informations', () => {
    return HttpResponse.json(mailToGedServicesLines)
  }),

  // Folders (ds API)
  http.get('*/:serviceId/:entityId/folders/currentuser', ({ params }) => {
    const { serviceId } = params
    const folders = getFoldersByServiceId(serviceId as string)
    return HttpResponse.json(folders)
  }),

  http.post('*/:serviceId/:entityId/folders/currentuser', async ({ request }) => {
    const body = await request.json() as { parentId: number, name: string }
    const newFolder = getMockedFolder(body.parentId, Math.floor(Math.random() * 10000), body.name)
    return HttpResponse.json(newFolder)
  }),

  http.patch('*/:serviceId/:entityId/folders/:folderId/currentuser', () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete('*/:serviceId/:entityId/folders/currentuser/:folderId', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/:serviceId/:entityId/folders/:folderId/archive', () => {
    const blob = new Blob(['mock archive content'], { type: 'application/zip' })
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="archive.zip"',
      },
    })
  }),

  // Documents (ds API)
  http.get('*/:serviceId/:entityId/documents/folder/:folderId/currentuser', () => {
    return HttpResponse.json(documentsResponsePayload)
  }),

  http.get('*/:serviceId/:accountNumber/documents/:documentId/content', () => {
    const blob = new Blob(['mock document content'], { type: 'application/pdf' })
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    })
  }),

  http.post('*/:serviceId/:accountNumber/archive', () => {
    const blob = new Blob(['mock archive content'], { type: 'application/zip' })
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="documents.zip"',
      },
    })
  }),

  http.patch('*/:serviceId/:entityId/documents/:documentId', () => {
    return HttpResponse.json({ success: true })
  }),

  http.delete('*/:serviceId/:entityId/documents', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('*/:serviceId/:entityId/folders/:folderId/currentuser/documents', () => {
    return HttpResponse.json({
      id: `doc-${Date.now()}`,
      name: 'uploaded-document.pdf',
      success: true,
    })
  }),

  http.post('*/:serviceId/:entityId/documents/move', () => {
    return HttpResponse.json({ success: true })
  }),

  http.post('*/:serviceId/:entityId/documents/pia-speedup-transfer', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('*/:serviceId/:entityId/documents/:documentId/preview', () => {
    const mockPdfContent = new ArrayBuffer(1024)
    return new HttpResponse(mockPdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }),

  // Bin/Trash (ds API)
  http.get('*/:serviceId/:entityId/trash/mapped/currentuser', () => {
    return HttpResponse.json(binDocumentsMock)
  }),

  http.post('*/:serviceId/:entityId/trash/restore', async ({ request }) => {
    const body = await request.json() as { ids: string[] }
    const restoredDocuments = body.ids.map((id) => ({
      id,
      folderId: 100,
    }))
    return HttpResponse.json(restoredDocuments)
  }),

  // SignalR negotiation handler
  http.post('*/accounting-hub/negotiate', () => {
    return HttpResponse.json({
      connectionId: MOCK_CONNECTION_ID,
      connectionToken: MOCK_CONNECTION_ID,
      negotiateVersion: 1,
      availableTransports: [
        {
          transport: 'WebSockets',
          transferFormats: ['Text', 'Binary'],
        },
        {
          transport: 'ServerSentEvents',
          transferFormats: ['Text'],
        },
        {
          transport: 'LongPolling',
          transferFormats: ['Text', 'Binary'],
        },
      ],
    })
  }),
]

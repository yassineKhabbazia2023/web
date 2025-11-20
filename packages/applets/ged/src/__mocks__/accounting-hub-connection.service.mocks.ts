import type { Mock } from 'vitest'

export const getConnectionMock: Mock = vi.fn(() => ({ on: vi.fn() }))
export const onConnectedAsyncMock: Mock = vi.fn()
export const onDisconnectedAsyncMock: Mock = vi.fn()

export const documentPiaStatusChangedResponseMock = {
  folderId: 45454,
  documentId: 'myID',
  newStatus: {
    technicalName: 'Duplicate',
    labelFr: 'Transmis',
    labelEn: 'Transmitted',
    date: null,
  },
  permissions: ['CAN_MOVE_DOCUMENT'],
}

export const getConnectionDocumentPiaStatusChangedMock: Mock = vi.fn(() => ({
  on: vi.fn()
    .mockImplementation(
      (eventName: string, newMethod: (_res: string) => void) => {
        if (eventName === 'DocumentPiaStatusChanged') {
          newMethod(
            JSON.stringify(documentPiaStatusChangedResponseMock),
          )
        }
      },
    ),
}))

export const initializedAccountingDataStreamInstanceMock = Promise.resolve({
  getConnection: getConnectionMock,
  OnConnectedAsync: onConnectedAsyncMock,
  OnDisconnectedAsync: onDisconnectedAsyncMock,
})

export const accountingHubConnectionServiceMock = {
  initializedAccountingDataStreamInstance: initializedAccountingDataStreamInstanceMock,
}

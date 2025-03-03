export const getConnectionMock = vi.fn(() => ({ on: vi.fn() }))
export const onConnectedAsyncMock = vi.fn()
export const onDisconnectedAsyncMock = vi.fn()

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

export const getConnectionDocumentPiaStatusChangedMock = vi.fn(() => ({
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

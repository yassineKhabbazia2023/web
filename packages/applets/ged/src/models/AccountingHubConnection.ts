import { logger } from '@pulse/core'
import { DataStreamHubConnection } from '@pulse/common'
import { VITE_ACCOUNTING_HUB_URL } from 'env-vars'

export const DOCUMENT_PIA_STATUS_CHANGED = 'DocumentPiaStatusChanged'

class AccountingHubConnection extends DataStreamHubConnection {
  // Constructor is the exact same, no need to specify it

  public OnConnectedAsync(folderId: number) {
    this.getConnection()
      .invoke('OnConnectedAsync', String(folderId))
      .catch((err) => logger.error('Invoke OnConnectedAsync failed:', err))
  }

  public OnDisconnectedAsync(folderId: number) {
    this.getConnection()
      .invoke('OnDisconnectedAsync', String(folderId))
      .catch((err) => logger.error('Invoke OnDisconnectedAsync failed:', err))
  }
}

const AccountingDataStreamInstance = new AccountingHubConnection(
  VITE_ACCOUNTING_HUB_URL,
)

const initializedAccountingDataStreamInstance = AccountingDataStreamInstance.startConnection()
  .then(() => AccountingDataStreamInstance)

export { initializedAccountingDataStreamInstance }

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { downloadFile, openDocumentInNewTab } from '@pulse/common/helpers'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { SeresInvoicesService } from './seres-invoices.service'
import { INVOICE_FILE_EXTENSION } from './seres-invoices.consts'
import { SeresInvoiceAction } from './seres-invoices.enums'
import type { SeresInvoiceItem } from './seres-invoices.types'

export function useSeresInvoicesDownload() {
  const { t } = useI18n()
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  // Each invoice is locked on its own action: an ongoing view or download must not freeze the other rows.
  const processingInvoiceActions = ref(new Map<number, SeresInvoiceAction>())

  // The invoice is busy, whatever the running action: every button of that row must be disabled.
  const isInvoiceLocked = (invoice: SeresInvoiceItem): boolean => processingInvoiceActions.value.has(invoice.id)

  // That very action is running: only the clicked button shows a spinner.
  const isActionProcessing = (invoice: SeresInvoiceItem, action: SeresInvoiceAction): boolean =>
    processingInvoiceActions.value.get(invoice.id) === action

  // Nothing is awaited before `runAction`, so an action opening a tab stays within the click activation.
  const runInvoiceAction = async (
    invoice: SeresInvoiceItem,
    action: SeresInvoiceAction,
    runAction: (accountNumber: string) => Promise<void>,
    logMessage: string,
    errorMessageKey: string,
  ): Promise<void> => {
    if (currentEntity.value === undefined || isInvoiceLocked(invoice)) {
      return
    }
    const { accountNumber } = currentEntity.value
    processingInvoiceActions.value.set(invoice.id, action)

    try {
      await runAction(accountNumber)
    } catch (error) {
      logger.error(logMessage, error)
      displayNotification('error', t(errorMessageKey))
    } finally {
      processingInvoiceActions.value.delete(invoice.id)
    }
  }

  const viewInvoice = (invoice: SeresInvoiceItem): Promise<void> => runInvoiceAction(
    invoice,
    SeresInvoiceAction.VIEW,
    async (accountNumber) => {
      const isTabOpened = await openDocumentInNewTab(
        () => SeresInvoicesService.fetchInvoiceContent(invoice.name, accountNumber),
      )
      if (isTabOpened === false) {
        displayNotification('error', t('entities.seresInvoices.popupBlockedError'))
      }
    },
    'Error opening Seres invoice',
    'entities.seresInvoices.viewError',
  )

  const downloadInvoice = (invoice: SeresInvoiceItem): Promise<void> => runInvoiceAction(
    invoice,
    SeresInvoiceAction.DOWNLOAD,
    async (accountNumber) => {
      const content = await SeresInvoicesService.fetchInvoiceContent(invoice.name, accountNumber)
      // The invoice name is a bare number: without the extension the browser saves an unknown file.
      downloadFile(content, `${invoice.name}${INVOICE_FILE_EXTENSION}`)
    },
    'Error downloading Seres invoice',
    'entities.seresInvoices.downloadError',
  )

  return {
    isInvoiceLocked,
    isActionProcessing,
    viewInvoice,
    downloadInvoice,
  }
}

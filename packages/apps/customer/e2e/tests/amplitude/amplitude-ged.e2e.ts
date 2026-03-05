import { test } from '@playwright/test'
import {
  setupAmplitudePage,
  clearAmplitudeEvents,
  expectAmplitudeEvent,
} from './amplitude.config'
import {
  navigateToGed,
  selectFolder,
  doubleClickDocument,
  openDocumentContextMenu,
  clickToolboxAction,
  confirmPopup,
  searchDocuments,
} from '../ged/ged.config'

test.describe('Amplitude GED Tracking - Document Actions', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')
    await clearAmplitudeEvents(page)
  })

  test('should track "Document Consulted" on document double-click', async ({ page }) => {
    await doubleClickDocument(page, 0)
    await expectAmplitudeEvent(page, 'Document Consulted')
  })

  test('should track "Document Searched" on search', async ({ page }) => {
    await searchDocuments(page, 'test')
    await expectAmplitudeEvent(page, 'Document Searched', { document_search: 'test' })
  })

  test('should track "Document Deleted" after confirming delete', async ({ page }) => {
    await openDocumentContextMenu(page, 0)
    await clickToolboxAction(page, 'Supprimer')
    await confirmPopup(page)
    await expectAmplitudeEvent(page, 'Document Deleted', { document_delete: 'succeeded' })
  })

})

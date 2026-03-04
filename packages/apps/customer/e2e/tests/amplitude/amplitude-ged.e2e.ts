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
  clickBreadcrumbItem,
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

  test('should track "Document Delete Started" on delete from context menu', async ({ page }) => {
    await openDocumentContextMenu(page, 0)
    await clickToolboxAction(page, 'Supprimer')
    await expectAmplitudeEvent(page, 'Document Delete Started', { document_delete_start: 'Context menu' })
  })

  test('should track "Document Deleted" after confirming delete', async ({ page }) => {
    await openDocumentContextMenu(page, 0)
    await clickToolboxAction(page, 'Supprimer')
    await confirmPopup(page)
    await expectAmplitudeEvent(page, 'Document Deleted', { document_delete: 'succeeded' })
  })

  test('should track "Document Download Started" on download from context menu', async ({ page }) => {
    await openDocumentContextMenu(page, 0)
    await clickToolboxAction(page, 'Télécharger')
    await expectAmplitudeEvent(page, 'Document Download Started', { document_download_start: 'Context menu' })
  })
})

test.describe('Amplitude GED Tracking - Breadcrumb', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')
    await selectFolder(page, 'A classer')
    await clearAmplitudeEvents(page)
  })

  test('should track "Breadcrumb clicked" on breadcrumb navigation', async ({ page }) => {
    await clickBreadcrumbItem(page, 'Dépôt')
    await expectAmplitudeEvent(page, 'Breadcrumb clicked')
  })
})

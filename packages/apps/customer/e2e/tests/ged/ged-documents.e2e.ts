import { test, expect } from '@playwright/test'
import {
  setupGedPage,
  navigateToGed,
  selectFolder,
  doubleClickDocument,
  waitForPreviewDrawer,
  openSearchInput,
  searchDocuments,
  clearSearch,
  getDocumentRows,
  getDocumentRowByIndex,
  selectAllDocuments,
  openDocumentContextMenu,
  clickToolboxAction,
  waitForSuccessNotification,
  confirmPopup,
  applyFilters,
  sortByColumn,
  getPagination,
} from './ged.config'

test.describe('GED - Document Preview', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should open document preview drawer on double-click', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await doubleClickDocument(page, 0)

    await waitForPreviewDrawer(page)

    const drawer = page.locator('.p-document-viewer.el-drawer')
    await expect(drawer).toBeVisible()
  })

  test('should display document title in preview drawer', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await doubleClickDocument(page, 0)

    await waitForPreviewDrawer(page)

    const drawer = page.locator('.p-document-viewer.el-drawer')
    const drawerHeader = drawer.locator('.el-drawer__header, [class*="header"]').first()
    await expect(drawerHeader).toBeVisible()
  })
})

test.describe('GED - Document Search', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should expand search input on click', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await openSearchInput(page)

    const searchInput = page.locator('.p-expandable-search').getByRole('searchbox')
    await expect(searchInput).toBeVisible()
  })

  test('should search documents by keyword', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await searchDocuments(page, 'test')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()
  })

  test('should clear search and return to folder view', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const initialCount = await getDocumentRows(page).count()

    await searchDocuments(page, 'test')
    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await clearSearch(page)

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()
    const finalCount = await getDocumentRows(page).count()
    expect(finalCount).toBe(initialCount)
  })
})

test.describe('GED - Document Selection', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should select a single document by clicking its checkbox', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const documentRow = getDocumentRowByIndex(page, 0)
    await expect(documentRow).toBeVisible({ timeout: 5000 })

    const checkbox = documentRow.locator('.el-checkbox')
    await expect(checkbox).not.toHaveClass(/is-checked/)

    await checkbox.click()

    await expect(checkbox).toHaveClass(/is-checked/)
  })

  test('should select all documents using header checkbox', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const documentRows = getDocumentRows(page)
    const count = await documentRows.count()

    await selectAllDocuments(page)

    for (let i = 0; i < count; i++) {
      const checkbox = getDocumentRowByIndex(page, i).locator('.el-checkbox')
      await expect(checkbox).toHaveClass(/is-checked/)
    }
  })
})

test.describe('GED - Document Actions', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should delete a single document via context menu', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await openDocumentContextMenu(page, 0)

    await clickToolboxAction(page, 'Supprimer')

    const deleteDialog = page.getByRole('dialog', { name: 'Supprimer ce document ?' })
    await expect(deleteDialog).toBeVisible({ timeout: 10000 })

    await confirmPopup(page)

    await waitForSuccessNotification(page)
  })

  test('should download a single document via context menu', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 })

    await openDocumentContextMenu(page, 0)

    await clickToolboxAction(page, 'Télécharger')

    const download = await downloadPromise

    expect(download).toBeTruthy()
  })
})

test.describe('GED - Document Filter & Sort', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should open filters drawer', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const filterButton = page.locator('.p-action-bar').getByRole('button', { name: 'Filtrer' })
    await filterButton.click()

    const filtersDrawer = page.locator('.el-drawer').filter({ hasText: 'Filtres' })
    await expect(filtersDrawer).toBeVisible({ timeout: 5000 })
  })

  test('should apply period filter', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const filterButton = page.locator('.p-action-bar').getByRole('button', { name: 'Filtrer' })
    await filterButton.click()

    const filtersDrawer = page.locator('.el-drawer').filter({ hasText: 'Filtres' })
    await expect(filtersDrawer).toBeVisible({ timeout: 5000 })

    const periodDropdown = filtersDrawer.locator('.el-select, .el-dropdown').first()
    await periodDropdown.click()

    const todayOption = page.getByRole('option', { name: 'Les dernières 24h' })
    await todayOption.click()

    await applyFilters(page)

    await expect(filtersDrawer).toBeHidden({ timeout: 5000 })

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()
  })

  test('should sort documents by name', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await sortByColumn(page, 'Nom du document')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()
  })

  test('should display pagination component when documents exist', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    const pagination = getPagination(page)
    await expect(pagination).toBeVisible()
  })
})

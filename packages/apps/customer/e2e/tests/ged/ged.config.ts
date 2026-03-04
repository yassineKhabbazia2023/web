import { Page, expect, Locator } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

export const GED_URL = `/dossier/${MockEntityId.LEGACY_GED}/ged`

export async function setupGedPage(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
}

export async function navigateToGed(page: Page) {
  await page.goto(GED_URL)
  await expect(page.getByTestId('ged-treeview')).toBeVisible({ timeout: 15000 })
  await expect(page.getByTestId('ged-documents-list')).toBeVisible({ timeout: 15000 })
}

export async function waitForSuccessNotification(page: Page) {
  await expect(page.locator('.el-notification.success')).toBeVisible({ timeout: 5000 })
}

export async function selectFolder(page: Page, folderName: string) {
  const folderLabel = page.locator('[data-testid="ged-tree-node-label"]').filter({ hasText: folderName })
  await folderLabel.click()
}

export async function expandFolder(page: Page, folderName: string) {
  const folderLabel = page.locator('[data-testid="ged-tree-node-label"]').filter({ hasText: folderName })
  await folderLabel.click()
}

export async function clickToolboxAction(page: Page, actionLabel: string) {
  const dropdownItem = page.getByRole('menuitem', { name: actionLabel }).first()
  await expect(dropdownItem).toBeVisible({ timeout: 5000 })
  await dropdownItem.click()
}

export async function confirmPopup(page: Page) {
  await page.getByTestId('ged-popup-confirm-button').click()
}

export function getDocumentRows(page: Page): Locator {
  return page.locator('.document-row')
}

export function getDocumentRowByIndex(page: Page, index: number): Locator {
  return page.locator('.document-row').nth(index)
}

export async function selectAllDocuments(page: Page) {
  const selectAllCheckbox = page.locator('.el-table__header-wrapper .el-checkbox')
  await selectAllCheckbox.click()
}

export async function openDocumentContextMenu(page: Page, rowIndex: number) {
  const documentRow = getDocumentRowByIndex(page, rowIndex)
  await documentRow.click({ button: 'right' })
}

export async function doubleClickDocument(page: Page, rowIndex: number) {
  const documentRow = getDocumentRowByIndex(page, rowIndex)
  await documentRow.dblclick()
}

export async function waitForPreviewDrawer(page: Page) {
  await expect(page.locator('.p-document-viewer.el-drawer')).toBeVisible({ timeout: 5000 })
}

export async function openSearchInput(page: Page) {
  const search = page.getByTestId('expandable-search')
  await search.locator('button').first().click()
  await expect(search.getByRole('searchbox')).toBeVisible({ timeout: 1000 })
}

export async function searchDocuments(page: Page, searchTerm: string) {
  const searchInput = page.getByTestId('expandable-search').getByRole('searchbox')
  const isVisible = await searchInput.isVisible().catch(() => false)
  if (isVisible === false) {
    await openSearchInput(page)
  }
  await searchInput.fill(searchTerm)
}

export async function clearSearch(page: Page) {
  const searchInput = page.getByTestId('expandable-search').getByRole('searchbox')
  await searchInput.clear()
}

export async function applyFilters(page: Page) {
  const applyButton = page.locator('.el-drawer').getByRole('button', { name: 'Appliquer' })
  await applyButton.click()
}

export function getPagination(page: Page): Locator {
  return page.locator('.el-pagination')
}

export async function sortByColumn(page: Page, columnName: string) {
  const columnHeader = page.locator('.el-table__header-wrapper').locator(`th:has-text("${columnName}")`)
  await columnHeader.click()
}

export async function clickBreadcrumbItem(page: Page, itemText: string) {
  const breadcrumbItem = page.getByTestId('breadcrumb-item').filter({ hasText: itemText })
  await breadcrumbItem.click()
}

export async function navigateToBin(page: Page) {
  const treeview = page.locator('[data-testid="ged-treeview"]')
  const corbeilleNode = treeview.locator('[data-testid="ged-tree-node-label"]').filter({ hasText: 'Corbeille' })
  await corbeilleNode.click()

  const corbeilleTreeItem = treeview.getByRole('treeitem', { name: 'Corbeille', expanded: true })
  await expect(corbeilleTreeItem).toBeVisible({ timeout: 5000 })

  const serviceBinItem = corbeilleTreeItem.getByRole('treeitem').first()
  await expect(serviceBinItem).toBeVisible({ timeout: 5000 })
  await serviceBinItem.click()

  await expect(page.locator('.bin-documents-table')).toBeVisible({ timeout: 10000 })
}

export async function waitForBinDocuments(page: Page) {
  await expect(page.locator('.bin-documents-table')).toBeVisible({ timeout: 10000 })
}

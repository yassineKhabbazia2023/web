import { test, expect } from '@playwright/test'
import {
  setupGedPage,
  navigateToGed,
  selectFolder,
  expandFolder,
  clickBreadcrumbItem,
  waitForSuccessNotification,
} from './ged.config'

test.describe('GED - Breadcrumb Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should display breadcrumb with current path', async ({ page }) => {
    await navigateToGed(page)
    await selectFolder(page, 'Dépôt')

    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' })
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByText('Documents')).toBeVisible()
  })

  test('should navigate to parent folder via breadcrumb', async ({ page }) => {
    await navigateToGed(page)

    await expandFolder(page, 'Dépôt')
    await selectFolder(page, 'A classer')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()

    await clickBreadcrumbItem(page, 'Dépôt')

    await expect(page.getByTestId('ged-documents-list')).toBeVisible()
  })
})

test.describe('GED - Folder Actions', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should create a new folder using the header button', async ({ page }) => {
    await navigateToGed(page)

    await selectFolder(page, 'Dépôt')

    await page.getByTestId('treeview__new-folder').click()

    const createDialog = page.getByRole('dialog', { name: 'Nouveau dossier' })
    await expect(createDialog).toBeVisible({ timeout: 10000 })

    const newFolderName = `Test Folder ${Date.now()}`
    const input = createDialog.getByRole('textbox')
    await input.fill(newFolderName)
    await createDialog.getByRole('button', { name: 'Créer' }).click()

    await waitForSuccessNotification(page)

    await expect(createDialog).toBeHidden({ timeout: 5000 })
  })

  test('should rename a folder via context menu', async ({ page }) => {
    await navigateToGed(page)

    await expandFolder(page, 'Dépôt')
    await expandFolder(page, 'A classer')

    const movableFolder = page.locator('[data-testid="ged-tree-node-label"]').filter({ hasText: 'MOVABLE' })
    await expect(movableFolder).toBeVisible()
    await movableFolder.click({ button: 'right' })

    const renameOption = page.getByRole('menuitem', { name: 'Renommer dossier' }).first()
    await expect(renameOption).toBeVisible({ timeout: 5000 })
    await renameOption.click()

    const renameDialog = page.getByRole('dialog', { name: 'Renommer' })
    await expect(renameDialog).toBeVisible({ timeout: 10000 })

    const newFolderName = `Renamed Folder ${Date.now()}`
    const input = renameDialog.getByRole('textbox')
    await input.clear()
    await input.fill(newFolderName)
    await renameDialog.getByRole('button', { name: 'Modifier' }).click()

    await waitForSuccessNotification(page)

    await expect(renameDialog).toBeHidden({ timeout: 5000 })
  })

  test('should delete a folder via context menu', async ({ page }) => {
    await navigateToGed(page)

    await expandFolder(page, 'Dépôt')
    await expandFolder(page, 'A classer')

    const movableFolder = page.locator('[data-testid="ged-tree-node-label"]').filter({ hasText: 'MOVABLE' })
    await expect(movableFolder).toBeVisible()
    await movableFolder.click({ button: 'right' })

    const deleteOption = page.getByRole('menuitem', { name: 'Supprimer' }).first()
    await expect(deleteOption).toBeVisible({ timeout: 5000 })
    await deleteOption.click()

    const deleteDialog = page.getByRole('dialog', { name: 'Supprimer ce dossier ?' })
    await expect(deleteDialog).toBeVisible({ timeout: 10000 })

    await deleteDialog.getByRole('button', { name: 'Confirmer' }).click()

    await waitForSuccessNotification(page)

    await expect(deleteDialog).toBeHidden({ timeout: 5000 })
  })
})

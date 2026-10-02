import { test, expect, type Page } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'

const FOLDERS_URL = 'portefeuille/dossiers'

async function navigateToFolders(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  await page.goto(FOLDERS_URL)
  await expect(page.getByTestId('folders-table')).toBeVisible({ timeout: 15000 })
}

async function clickManageWalletAction(page: Page, actionText: string) {
  await page.getByTestId('manage-wallet-button').click()
  await page.getByTestId('manage-wallet-menu').locator('button.p-toolbox-item').filter({ hasText: actionText }).click()
}

async function clickToolboxAction(page: Page, actionText: string) {
  await page.getByTestId('wallet-actions-toolbox').first().click()
  await page.locator('button.p-toolbox-item').filter({ hasText: actionText }).first().click()
}

test.describe('Folder page - Drawers', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToFolders(page)
  })

  test('should open the Account Filters drawer', async ({ page }) => {
    await page.getByTestId('p-list-toolbar__filter-button').click()
    await expect(page.getByTestId('account-filters-drawer__apply-button')).toBeVisible()
  })

  test('should open the Delegation drawer', async ({ page }) => {
    await clickManageWalletAction(page, 'Déléguer mon portefeuille')
    await expect(page.locator('[role="dialog"]').filter({ hasText: 'Mes délégations' })).toBeVisible()
  })

  test('should open the Entity Creator drawer', async ({ page }) => {
    await clickManageWalletAction(page, 'Créer un compte de test')
    await expect(page.getByTestId('entity-creator-user-card')).toBeVisible()
  })

  test('should open the Manage Access drawer', async ({ page }) => {
    await page.getByTestId('manage-access-button').click()
    await expect(page.locator('[role="dialog"]').filter({ hasText: "Valider l'accès utilisateur" })).toBeVisible()
  })

  test('should open the Offers drawer via deploy action', async ({ page }) => {
    await clickToolboxAction(page, 'Déployer ce dossier')
    await expect(page.getByTestId('offers')).toBeVisible()
  })

  test('should open the Declare Customer Relation drawer', async ({ page }) => {
    await clickToolboxAction(page, 'Me déclarer en relation client')
    await expect(page.getByTestId('bulk-customer-relation-drawer')).toBeVisible()
  })

  test('should open the Resend Activation Email drawer', async ({ page }) => {
    await clickToolboxAction(page, "Relancer le mail d'activation")
    await expect(page.getByTestId('account-rights-company-card')).toBeVisible()
  })
})

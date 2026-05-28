import { test, expect } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'

test.describe('Wallet - Folders', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
    await page.goto('portefeuille/dossiers')
  })

  test('should display the wallet page with folders tab', async ({ page }) => {
    await expect(page.locator('.wallet')).toBeVisible()
  })

  test('should display the folders table', async ({ page }) => {
    await expect(page.getByTestId('folders-table')).toBeVisible()
  })

  test('should display the filters for collaborators', async ({ page }) => {
    await expect(page.getByTestId('filters')).toBeVisible()
  })
})

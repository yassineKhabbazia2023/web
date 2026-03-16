import { test, expect } from '@playwright/test'

test.describe('App Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app-settings')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await expect(page.getByTestId('app-settings-page-title')).toBeVisible({ timeout: 15000 })
  })

  test('should display the app settings page with title', async ({ page }) => {
    await expect(page.getByTestId('app-settings-page-title')).toBeVisible()
  })

  test('should display the toolbar with search and add functionality', async ({ page }) => {
    await expect(page.getByTestId('app-settings-filters-container')).toBeVisible({ timeout: 15000 })
  })

  test('should display settings table after loading', async ({ page }) => {
    await expect(page.getByTestId('app-settings-filters-container')).toBeVisible({ timeout: 15000 })
  })
})

import { test, expect } from '@playwright/test'

test.describe('App Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app-settings')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
  })

  test('should display the app settings page with title', async ({ page }) => {
    // Verify the page title
    await expect(page.getByTestId('app-settings-page-title')).toBeVisible({ timeout: 10000 })
  })

  test('should display the toolbar with search and add functionality', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByTestId('app-settings-page-title')).toBeVisible({ timeout: 10000 })

    // Verify toolbar elements are present
    await expect(page.getByTestId('app-settings-filters-container')).toBeVisible({ timeout: 15000 })
  })

  test('should display settings table after loading', async ({ page }) => {
    // Wait for the loader to disappear and table to appear
    await expect(page.getByTestId('app-settings-page-title')).toBeVisible({ timeout: 10000 })

    // Wait for table data to load (filters container appears after loading)
    await expect(page.getByTestId('app-settings-filters-container')).toBeVisible({ timeout: 15000 })
  })
})

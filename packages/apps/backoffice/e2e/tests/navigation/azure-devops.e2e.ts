import { test, expect } from '@playwright/test'

test.describe('Azure DevOps Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/azure-devops')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
  })

  test('should display the Azure DevOps page with title', async ({ page }) => {
    // Verify the page title
    await expect(page.getByTestId('azure-devops-page-title')).toBeVisible({ timeout: 10000 })
  })

  test('should display the PAT input field', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByTestId('azure-devops-page-title')).toBeVisible({ timeout: 10000 })

    // Verify PAT input is present
    await expect(page.getByTestId('azure-devops-pat-input')).toBeVisible()
  })

  test('should display the test button for PAT validation', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByTestId('azure-devops-page-title')).toBeVisible({ timeout: 10000 })

    // Verify test button is present
    await expect(page.getByTestId('test-pat-button')).toBeVisible()
  })

  test('should allow typing in PAT input field', async ({ page }) => {
    // Wait for the page to load
    await expect(page.getByTestId('azure-devops-page-title')).toBeVisible({ timeout: 10000 })

    // Type in the PAT input using test-id and finding the native input element
    const patInput = page.getByTestId('azure-devops-pat-input').locator('input')
    await patInput.fill('test-pat-value')
    await expect(patInput).toHaveValue('test-pat-value')
  })
})

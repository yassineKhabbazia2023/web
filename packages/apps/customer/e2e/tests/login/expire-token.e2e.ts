import { test, expect } from '@playwright/test'

const PAGE_URL = '/expireToken'

test.describe('Expire Token Page', () => {
  test('should display expire token page with all elements', async ({ page }) => {
    await page.goto(PAGE_URL)
    await expect(page.getByTestId('expire-token-message')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('expire-token-help-message')).toBeVisible()
    await expect(page.getByTestId('expire-token-resend-button')).toBeVisible()
  })
})

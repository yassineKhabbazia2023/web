import { test, expect } from '@playwright/test'

const PAGE_URL = '/resetPasswordFailed'

test.describe('Reset Password Failed Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
  })

  test('should display reset password failed page with all elements', async ({ page }) => {
    await expect(page.getByTestId('password-change-denied-para')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('password-change-limit-exceeded-para')).toBeVisible()
    await expect(page.getByTestId('back-to-login-button')).toBeVisible()
  })

  test('should navigate back to login when clicking back button', async ({ page }) => {
    const backButton = page.getByTestId('back-to-login-button')
    await backButton.click()

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

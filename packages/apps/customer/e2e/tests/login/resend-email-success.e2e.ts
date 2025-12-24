import { test, expect } from '@playwright/test'

const PAGE_URL = '/resendEmailSuccess'

test.describe('Resend Email Success Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
  })

  test('should display resend email success page with all elements', async ({ page }) => {
    await expect(page.getByTestId('resend-email-success-title')).toBeVisible()
    await expect(page.getByTestId('resend-email-success-message')).toBeVisible()
    await expect(page.getByTestId('back-to-login-button')).toBeVisible()
  })

  test('should navigate back to login when clicking back button', async ({ page }) => {
    const backButton = page.getByTestId('back-to-login-button')
    await backButton.click()

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

import { test, expect } from '@playwright/test'

const PAGE_URL = '/resetPassword'

test.describe('Reset Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
  })

  test('should display reset password page with form elements', async ({ page }) => {
    await expect(page.getByTestId('reset-password-input-email')).toBeVisible()
    await expect(page.getByTestId('reset-password-submit-button')).toBeVisible()
    await expect(page.getByTestId('reset-password-back-to-login-button')).toBeVisible()
  })

  test('should allow typing in email field', async ({ page }) => {
    const emailInput = page.getByTestId('reset-password-input-email')
    await emailInput.fill('test@example.com')

    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('should navigate back to login when clicking back button', async ({ page }) => {
    const backButton = page.getByTestId('reset-password-back-to-login-button')
    await backButton.click()

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })

  test('should show error when email is empty', async ({ page }) => {
    const emailInput = page.getByTestId('reset-password-input-email')
    await emailInput.focus()
    await emailInput.blur()

    // Check that the form item has error state
    const emailFormItem = page.locator('.el-form-item').filter({ has: emailInput })
    await expect(emailFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show error when email format is invalid', async ({ page }) => {
    const emailInput = page.getByTestId('reset-password-input-email')
    await emailInput.fill('invalid-email')
    await emailInput.blur()

    // Check that the form item has error state
    const emailFormItem = page.locator('.el-form-item').filter({ has: emailInput })
    await expect(emailFormItem.locator('.el-form-item__error')).toBeVisible()
  })
})

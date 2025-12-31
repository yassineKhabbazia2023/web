import { test, expect } from '@playwright/test'

const PAGE_URL = '/resetPasswordForm?token=test-token&contactEmail=test@example.com'

test.describe('Reset Password Form Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
  })

  test('should display reset password form page with form elements', async ({ page }) => {
    await expect(page.getByTestId('reset-password-form-first-password')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('reset-password-form-second-password')).toBeVisible()
    await expect(page.getByTestId('reset-password-form-submit-button')).toBeVisible()
  })

  test('should allow typing in password fields', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('reset-password-form-first-password')
    const secondPasswordInput = page.getByTestId('reset-password-form-second-password')

    await firstPasswordInput.fill('NewStrongPassword123!')
    await secondPasswordInput.fill('NewStrongPassword123!')

    await expect(firstPasswordInput).toHaveValue('NewStrongPassword123!')
    await expect(secondPasswordInput).toHaveValue('NewStrongPassword123!')
  })

  test('should show weak password strength indicator', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('reset-password-form-first-password')
    await firstPasswordInput.fill('weak')

    // Check that the weak password indicator (error color) is visible
    await expect(page.locator('.bg--stroke-error').first()).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('reset-password-form-first-password')
    const secondPasswordInput = page.getByTestId('reset-password-form-second-password')

    await firstPasswordInput.fill('StrongPassword123!')
    await secondPasswordInput.fill('DifferentPassword456!')
    await secondPasswordInput.blur()

    // Check that the form item has error state
    const confirmPasswordFormItem = page.locator('.el-form-item').filter({ has: secondPasswordInput })
    await expect(confirmPasswordFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show strong password strength indicator', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('reset-password-form-first-password')

    await firstPasswordInput.fill('StrongPassword123!')

    // Check that the strong password indicator (success color) is visible
    await expect(page.locator('.bg--stroke-success').first()).toBeVisible()
  })
})

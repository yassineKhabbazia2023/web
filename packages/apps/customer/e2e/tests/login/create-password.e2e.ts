import { test, expect } from '@playwright/test'

const PAGE_URL = '/createPassword?token=test-token&email=test@example.com'

test.describe('Create Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
  })

  test('should display create password page with form elements', async ({ page }) => {
    await expect(page.getByTestId('password-fields-new-password')).toBeVisible()
    await expect(page.getByTestId('password-fields-confirm-password')).toBeVisible()
    await expect(page.getByTestId('create-password-terms-checkbox')).toBeVisible()
    await expect(page.getByTestId('create-password-submit-button')).toBeVisible()
  })

  test('should allow typing in password fields', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('password-fields-new-password')
    const secondPasswordInput = page.getByTestId('password-fields-confirm-password')

    await firstPasswordInput.fill('StrongPassword123!')
    await secondPasswordInput.fill('StrongPassword123!')

    await expect(firstPasswordInput).toHaveValue('StrongPassword123!')
    await expect(secondPasswordInput).toHaveValue('StrongPassword123!')
  })

  test('should show error when password is too weak', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('password-fields-new-password')
    await firstPasswordInput.fill('weak')
    await firstPasswordInput.blur()

    // Check that the form item has error state
    const passwordFormItem = page.locator('.el-form-item').filter({ has: firstPasswordInput })
    await expect(passwordFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show error when passwords do not match', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('password-fields-new-password')
    const secondPasswordInput = page.getByTestId('password-fields-confirm-password')

    await firstPasswordInput.fill('StrongPassword123!')
    await secondPasswordInput.fill('DifferentPassword456!')
    await secondPasswordInput.blur()

    // Check that the confirm password field has error state
    const confirmPasswordFormItem = page.locator('.el-form-item').filter({ has: secondPasswordInput })
    await expect(confirmPasswordFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should keep submit button disabled when terms are not accepted', async ({ page }) => {
    const firstPasswordInput = page.getByTestId('password-fields-new-password')
    const secondPasswordInput = page.getByTestId('password-fields-confirm-password')
    const submitButton = page.getByTestId('create-password-submit-button')

    await firstPasswordInput.fill('StrongPassword123!')
    await secondPasswordInput.fill('StrongPassword123!')

    // Submit button should be disabled because terms are not accepted
    await expect(submitButton).toBeDisabled()
  })
})

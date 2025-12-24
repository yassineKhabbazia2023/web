import { test, expect } from '@playwright/test'

const PAGE_URL = '/login'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
  })

  test('should display login page with form elements', async ({ page }) => {
    await expect(page.getByTestId('login-input-email')).toBeVisible()
    await expect(page.getByTestId('login-input-password')).toBeVisible()
    await expect(page.getByTestId('login-submit-button')).toBeVisible()
  })

  test('should allow typing in email and password fields', async ({ page }) => {
    const emailInput = page.getByTestId('login-input-email')
    const passwordInput = page.getByTestId('login-input-password')

    await emailInput.fill('test@example.com')
    await passwordInput.fill('password123')

    await expect(emailInput).toHaveValue('test@example.com')
    await expect(passwordInput).toHaveValue('password123')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    const submitButtonWrapper = page.getByTestId('login-submit-button')
    const submitButton = submitButtonWrapper.locator('button')

    await page.getByTestId('login-input-email').fill('test@example.com')
    await page.getByTestId('login-input-password').fill('password123')

    // Wait for the actual button to be enabled
    await expect(submitButton).toBeEnabled()

    // Click and wait for navigation away from login page
    await submitButton.click()
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('should show error when email is empty', async ({ page }) => {
    const emailInput = page.getByTestId('login-input-email')
    await emailInput.focus()
    await emailInput.blur()

    // Check that the form item has error state
    const emailFormItem = page.locator('.el-form-item').filter({ has: emailInput })
    await expect(emailFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show error when email format is invalid', async ({ page }) => {
    const emailInput = page.getByTestId('login-input-email')
    await emailInput.fill('invalid-email')
    await emailInput.blur()

    // Check that the form item has error state
    const emailFormItem = page.locator('.el-form-item').filter({ has: emailInput })
    await expect(emailFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show error when password is empty', async ({ page }) => {
    const passwordInput = page.getByTestId('login-input-password')
    await passwordInput.focus()
    await passwordInput.blur()

    // Check that the form item has error state
    const passwordFormItem = page.locator('.el-form-item').filter({ has: passwordInput })
    await expect(passwordFormItem.locator('.el-form-item__error')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Override the login handler to return an error
    await page.evaluate(() => {
      const worker = (globalThis as any).__MSW_WORKER__
      if (worker) {
        const { http, HttpResponse } = (globalThis as any).__MSW__
        worker.use(
          http.post('*/authentication/api/login', () => {
            return HttpResponse.json(
              { errorCode: 'CNT114', message: 'Invalid credentials' },
              { status: 401 },
            )
          }),
        )
      }
    })

    const emailInput = page.getByTestId('login-input-email')
    const passwordInput = page.getByTestId('login-input-password')
    const submitButtonWrapper = page.getByTestId('login-submit-button')
    const submitButton = submitButtonWrapper.locator('button')

    await emailInput.fill('wrong@example.com')
    await passwordInput.fill('wrongpassword')
    await submitButton.click()

    // Check that an error message is displayed (on password field for credentials error)
    const passwordFormItem = page.locator('.el-form-item').filter({ has: passwordInput })
    await expect(passwordFormItem.locator('.el-form-item__error')).toBeVisible()
  })
})

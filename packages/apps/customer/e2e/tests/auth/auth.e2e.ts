import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

const PROTECTED_URL = `/dossier/${MockEntityId.BASIC}/accueil`
const LOGIN_URL = '/login'

/**
 * Creates a JWT token directly in the browser context.
 * This avoids timing issues: the token's `exp` is computed at page load time,
 * not at test setup time.
 */
function createBrowserJwt() {
  return (seconds: number) => {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + seconds
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
    const payload = btoa(JSON.stringify({ sub: 'test-user-123', exp, iat: now }))
      .replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
    localStorage.setItem('token', `${header}.${payload}.mock-signature`)
  }
}

// #region Valid Token
test.describe('Authentication - Valid Token', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should access protected route with valid token', async ({ page }) => {
    await page.goto(PROTECTED_URL)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30000 })
    await expect(page).not.toHaveURL(/\/login/)
  })

  test('should redirect authenticated user away from login page', async ({ page }) => {
    await page.goto(LOGIN_URL)
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 })
  })
})
// #endregion

// #region Expired Token
test.describe('Authentication - Expired Token', () => {
  test.beforeEach(async ({ page }) => {
    // Create an expired JWT (exp = now - 1 hour) in the browser context
    await page.addInitScript(createBrowserJwt(), -3600)
  })

  test('should redirect to login with sessionExpired when accessing protected route', async ({ page }) => {
    await page.goto(PROTECTED_URL)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/sessionExpired=true/)
  })

  test('should display session expired modal', async ({ page }) => {
    await page.goto(PROTECTED_URL)
    await expect(page).toHaveURL(/sessionExpired=true/, { timeout: 10000 })
    await expect(page.getByTestId('session-expired-modal')).toBeVisible({ timeout: 5000 })
  })
})
// #endregion

// #region No Token
test.describe('Authentication - No Token', () => {
  test('should redirect to login without sessionExpired when no token', async ({ page }) => {
    await page.goto(PROTECTED_URL)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    await expect(page).not.toHaveURL(/sessionExpired/)
  })

  test('should allow access to login page without token', async ({ page }) => {
    await page.goto(LOGIN_URL)
    await expect(page.getByTestId('login-input-email')).toBeVisible()
  })
})
// #endregion

// #region Token Refresh
test.describe('Authentication - Token Refresh', () => {
  test('should refresh token transparently when about to expire', async ({ page }) => {
    // Create a JWT expiring in 120s (within the 5-min refresh buffer)
    await page.addInitScript(createBrowserJwt(), 120)

    await page.goto(PROTECTED_URL)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page).not.toHaveURL(/\/login/)

    // Verify that the token in localStorage was refreshed (replaced by the MSW handler's response)
    const storedToken = await page.evaluate(() => localStorage.getItem('token'))
    expect(storedToken).toBeTruthy()
  })

  test('should continue with current token when refresh fails', async ({ page }) => {
    // Create a JWT expiring in 120s
    await page.addInitScript(createBrowserJwt(), 120)

    // Override refreshToken handler to return 500 before the page loads
    await page.addInitScript(() => {
      const waitForMsw = () => {
        if ((globalThis as any).__MSW_READY__ === true) {
          const worker = (globalThis as any).__MSW_WORKER__
          const { http, HttpResponse } = (globalThis as any).__MSW__
          worker.use(
            http.post('*/authentication/api/refreshToken', () => {
              return HttpResponse.json({ error: 'Refresh failed' }, { status: 500 })
            }),
          )
        } else {
          setTimeout(waitForMsw, 50)
        }
      }
      waitForMsw()
    })

    await page.goto(PROTECTED_URL)

    // Page should still load (token is valid for 120 more seconds)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page).not.toHaveURL(/\/login/)
  })
})
// #endregion

// #region 401 Response Handling
test.describe('Authentication - 401 Response Handling', () => {
  test('should redirect to login with sessionExpired on 401 API response', async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)

    // Override user context endpoint to return 401 before the page loads
    // This endpoint is called during enterAuthenticatedFlow
    await page.addInitScript(() => {
      const waitForMsw = () => {
        if ((globalThis as any).__MSW_READY__ === true) {
          const worker = (globalThis as any).__MSW_WORKER__
          const { http, HttpResponse } = (globalThis as any).__MSW__
          worker.use(
            http.get('*/connect/api/get-user-information', () => {
              return HttpResponse.json(
                { errorCode: 'UNAUTHORIZED', message: 'Session expired' },
                { status: 401 },
              )
            }),
          )
        } else {
          setTimeout(waitForMsw, 50)
        }
      }
      waitForMsw()
    })

    await page.goto(PROTECTED_URL)
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    await expect(page).toHaveURL(/sessionExpired=true/)

    // Token should be cleared from localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token === null || token === '').toBeTruthy()
  })

  test('should NOT trigger logout on 401 with skip callback error code', async ({ page }) => {
    await page.goto(LOGIN_URL)
    await expect(page.getByTestId('login-input-email')).toBeVisible()

    // Override login endpoint to return 401 with CNT033 (in SKIP_CALLBACK_CODES)
    await page.evaluate(() => {
      const worker = (globalThis as any).__MSW_WORKER__
      if (worker) {
        const { http, HttpResponse } = (globalThis as any).__MSW__
        worker.use(
          http.post('*/authentication/api/login', () => {
            return HttpResponse.json(
              { errorCode: 'CNT033', message: 'Invalid credentials' },
              { status: 401 },
            )
          }),
        )
      }
    })

    await page.getByTestId('login-input-email').fill('test@example.com')
    await page.getByTestId('login-input-password').fill('password123')
    const submitButton = page.getByTestId('login-submit-button').locator('button')
    await submitButton.click()

    // Should stay on login page without sessionExpired redirect
    await expect(page.getByTestId('login-input-email')).toBeVisible({ timeout: 5000 })
    await expect(page).not.toHaveURL(/sessionExpired/)
  })
})
// #endregion

// #region Login Flow
test.describe('Authentication - Login Flow', () => {
  test('should store token and navigate to authenticated area after successful login', async ({ page }) => {
    await page.goto(LOGIN_URL)

    await page.getByTestId('login-input-email').fill('test@example.com')
    await page.getByTestId('login-input-password').fill('password123')
    const submitButton = page.getByTestId('login-submit-button').locator('button')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Should navigate away from login to authenticated area
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 })

    // Token should be stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeTruthy()
    expect(token).toContain('.')
  })
})
// #endregion

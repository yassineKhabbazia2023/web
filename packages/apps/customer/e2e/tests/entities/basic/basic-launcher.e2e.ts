import { test, expect } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
import { MockEntityId } from '@pulse/e2e-mocks/constants'

test.describe('Basic Entity - Launcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should not have access to /launcher', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/launcher`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/launcher/)
  })
})

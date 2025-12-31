import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Basic Entity - PowerBI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should not have access to /rapports-bi', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/rapports-bi`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/rapports-bi/)
  })
})

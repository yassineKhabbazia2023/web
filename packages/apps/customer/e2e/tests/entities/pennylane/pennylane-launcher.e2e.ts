import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Pennylane Entity - Launcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /launcher with MEG and Pennylane', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/launcher`)
    await expect(page.getByTestId('launcher-home-title')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('launch-card-MEG')).toBeVisible()
    await expect(page.getByTestId('launch-card-PENNYLANE')).toBeVisible()
  })
})

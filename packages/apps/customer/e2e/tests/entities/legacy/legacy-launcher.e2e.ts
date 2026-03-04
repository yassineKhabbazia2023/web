import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Legacy Entity - Launcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /launcher with MEG only', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/launcher`)
    await expect(page.getByTestId('launcher-home-title')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('launch-card-MEG')).toBeVisible()
    await expect(page.getByTestId('launch-card-PENNYLANE')).not.toBeVisible()
  })
})

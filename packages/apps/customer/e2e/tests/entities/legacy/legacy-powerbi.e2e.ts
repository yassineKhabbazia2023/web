import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Legacy Entity - PowerBI', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /rapports-bi', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/rapports-bi`)
    await expect(page).toHaveURL(/\/rapports-bi/)
  })
})

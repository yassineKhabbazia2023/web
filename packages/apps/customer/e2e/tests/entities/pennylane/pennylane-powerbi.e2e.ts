import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Pennylane Entity - PowerBI', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /rapports-bi', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/rapports-bi`)
    await expect(page).toHaveURL(/\/rapports-bi/)
  })
})

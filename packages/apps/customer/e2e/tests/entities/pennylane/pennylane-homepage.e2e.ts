import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Pennylane Entity - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should display pennylane entity homepage with news and pennylane widgets', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('entity-header-name')).toContainText('Global Services Inc')
    await expect(page.getByTestId('widget-rss-news')).toBeVisible()
    await expect(page.getByTestId('widget-pennylane-intro')).toBeVisible()
  })
})

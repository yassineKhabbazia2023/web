import { test, expect } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
import { MockEntityId } from '@pulse/e2e-mocks/constants'

test.describe('Pennylane Entity - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should display pennylane entity homepage with news and pennylane widgets', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('entity-header-name')).toContainText('Global Services Inc')
    await expect(page.getByTestId('widget-rss-news')).toBeVisible()
    await expect(page.getByTestId('widget-pennylane-intro')).toBeVisible()
  })
})

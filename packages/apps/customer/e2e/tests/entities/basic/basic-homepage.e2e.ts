import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Basic Entity - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should display basic entity homepage with news but not pennylane widget', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('entity-header-name')).toContainText('Acme Corp')
    await expect(page.getByTestId('widget-rss-news')).toBeVisible()
    await expect(page.getByTestId('widget-pennylane-intro')).not.toBeVisible()
  })
})

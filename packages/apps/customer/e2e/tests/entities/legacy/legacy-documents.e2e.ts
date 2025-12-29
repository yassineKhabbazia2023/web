import { test, expect } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
import { MockEntityId } from '@pulse/e2e-mocks/constants'

test.describe('Legacy Entity - Documents', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => (globalThis as any).__MSW_READY__ === true, { timeout: 5000 })
    await page.evaluate((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /ged', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/ged`)
    await expect(page.getByTestId('ged-documents-list')).toBeVisible({ timeout: 15000 })
  })

  test('should not have access to /comptabilite', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/comptabilite`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/comptabilite/)
  })

  test('should not have access to /gestion-sociale', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/gestion-sociale`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/gestion-sociale/)
  })
})

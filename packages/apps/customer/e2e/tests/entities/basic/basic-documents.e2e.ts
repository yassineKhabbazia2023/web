import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Basic Entity - Documents', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should not have access to /ged', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/ged`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/ged/)
  })

  test('should not have access to /comptabilite', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/comptabilite`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/comptabilite/)
  })

  test('should not have access to /gestion-sociale', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/gestion-sociale`)
    await page.waitForLoadState('networkidle', { timeout: 15000 })
    await expect(page).not.toHaveURL(/\/gestion-sociale/)
  })
})

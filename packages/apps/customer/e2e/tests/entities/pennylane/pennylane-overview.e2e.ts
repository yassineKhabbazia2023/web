import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

test.describe('Pennylane Entity - Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should have access to /gestion-utilisateurs', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/gestion-utilisateurs`)
    await expect(page).toHaveURL(/\/gestion-utilisateurs/)
  })

  test('should have access to /offres', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/offres`)
    await expect(page).toHaveURL(/\/offres/)
  })

  test('should have access to /informations', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/informations`)
    await expect(page).toHaveURL(/\/informations/)
  })
})

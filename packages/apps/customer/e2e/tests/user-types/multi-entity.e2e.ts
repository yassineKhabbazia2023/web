import { test, expect } from '@playwright/test'
import { tokenMock, MockEntityId } from '@pulse/common/mocks'

/**
 * Multi-entity user tests
 */
test.describe('Multi Entity User - Navigation & Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should display sidebar for multi entity user', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity')).toBeVisible()
  })

  test('should display entity menu for multi entity user', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity-menu')).toBeVisible()
  })

  test('should display wallet item in sidebar', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity')).toBeVisible()
    await expect(page.getByTestId('wallet-item')).toBeVisible()
  })

  test('should display favorite entities in sidebar', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity')).toBeVisible()
    await expect(page.getByTestId('favorite-entities')).toBeVisible()
  })

  test('should allow navigation to wallet page', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })

    // Click on wallet item in sidebar
    await page.getByTestId('wallet-item').click()

    // Should navigate to wallet page
    await expect(page).toHaveURL(/\/mes-entites/, { timeout: 15000 })
  })

  test('should display selected entity in sidebar', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity')).toBeVisible()
    await expect(page.getByTestId('selected-entity')).toBeVisible()
  })
})

test.describe('Multi Entity User - Login Redirect', () => {
  test('should redirect to wallet after login', async ({ page }) => {
    await page.goto('/login')

    // Now perform login
    await page.getByTestId('login-input-email').fill('test@example.com')
    await page.getByTestId('login-input-password').fill('password123')

    const submitButton = page.getByTestId('login-submit-button').locator('button')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Should redirect to wallet (mes-entites), not entity homepage
    await expect(page).toHaveURL(/\/mes-entites/, { timeout: 15000 })
  })
})

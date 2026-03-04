import { test, expect, Page } from '@playwright/test'
import { tokenMock, getAllMockAccountRows, MockEntityId } from '@pulse/common/mocks'

/**
 * Build the mono-entity response using existing mock data
 */
function getMonoEntityResponse() {
  const allEntities = getAllMockAccountRows()
  return {
    items: [allEntities[0]],
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
  }
}

/**
 * Add init script that will override MSW handler after MSW initializes on any page
 * This ensures the override persists across page navigations
 */
async function addMonoEntityInitScript(page: Page) {
  const response = getMonoEntityResponse()
  await page.addInitScript((monoResponse) => {
    // Wait for MSW to be ready and then add our override
    const waitForMsw = () => {
      if ((globalThis as any).__MSW_READY__ === true) {
        const worker = (globalThis as any).__MSW_WORKER__
        if (worker) {
          const { http, HttpResponse } = (globalThis as any).__MSW__
          worker.use(
            http.get('*/account/api/accounts/currentuser', () => {
              return HttpResponse.json(monoResponse)
            }),
          )
        }
      } else {
        // Check again in 50ms
        setTimeout(waitForMsw, 50)
      }
    }
    waitForMsw()
  }, response)
}

test.describe('Mono Entity User - Navigation & Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await addMonoEntityInitScript(page)
    await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  })

  test('should not display sidebar for single entity user', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity')).not.toBeVisible()
  })

  test('should display entity menu for single entity user', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('sidenav-entity-menu')).toBeVisible()
  })

  test('should display entity header', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('entity-header-name')).toContainText('Acme Corp')
  })

  test('should have access to entity pages', async ({ page }) => {
    await page.goto(`/dossier/${MockEntityId.BASIC}/gestion-utilisateurs`)
    await expect(page).toHaveURL(/\/gestion-utilisateurs/, { timeout: 15000 })
  })
})

test.describe('Mono Entity User - Login Redirect', () => {
  test('should redirect to entity homepage after login', async ({ page }) => {
    await addMonoEntityInitScript(page)
    await page.goto('/login')

    // Perform login
    await page.getByTestId('login-input-email').fill('test@example.com')
    await page.getByTestId('login-input-password').fill('password123')

    const submitButton = page.getByTestId('login-submit-button').locator('button')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Should redirect to entity homepage, not wallet
    await expect(page).toHaveURL(/\/dossier\/\d+\/accueil/, { timeout: 15000 })
  })
})

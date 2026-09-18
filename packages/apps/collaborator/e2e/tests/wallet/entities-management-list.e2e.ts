import { test, expect, type Page, type Locator } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
import { getAmplitudeEvents, clearAmplitudeEvents, expectFeatureConsulted } from '@pulse/e2e-mocks/helpers/amplitude'

// ─── URLs ────────────────────────────────────────────────────────────────────
const ACCOUNT_MANAGEMENT_URL = 'portefeuille/administration-dossiers'
const TABLE_TESTID = 'accounts-table'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function setupPage(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  await page.goto(ACCOUNT_MANAGEMENT_URL, { waitUntil: 'domcontentloaded' })
}

async function waitForAccountsTable(page: Page) {
  await expect(page.getByTestId(TABLE_TESTID)).toBeVisible({ timeout: 25000 })
}

function getTableRows(page: Page): Locator {
  return page.getByTestId(TABLE_TESTID).locator('tbody tr')
}

function getFirstRow(page: Page): Locator {
  return getTableRows(page).first()
}

async function clickFirstRowToolbox(page: Page) {
  await getFirstRow(page).getByTestId('wallet-actions-toolbox').click()
}

function getVisibleMenuItem(page: Page, actionText: string): Locator {
  return page.locator('button.p-toolbox-item').filter({ hasText: actionText, visible: true })
}

async function clickToolboxAction(page: Page, actionText: string) {
  await clickFirstRowToolbox(page)
  await getVisibleMenuItem(page, actionText).first().click()
}

// ─── Rendering ───────────────────────────────────────────────────────────────

test.describe('EntitiesManagementList - rendering', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForAccountsTable(page)
  })

  test('should display the accounts table', async ({ page }) => {
    await expect(page.getByTestId(TABLE_TESTID)).toBeVisible()
  })

  test('should display rows matching the mock data', async ({ page }) => {
    await expect(getTableRows(page).getByTestId('account-access-link')).toHaveCount(4)
  })

  test('should NOT display the favorite star column', async ({ page }) => {
    await expect(getTableRows(page).locator('[data-testid="wallet-add-favorite"]')).toHaveCount(0)
    await expect(getTableRows(page).locator('[data-testid="wallet-remove-favorite"]')).toHaveCount(0)
  })

  test('should NOT display selection checkboxes', async ({ page }) => {
    const checkboxes = getTableRows(page).locator('.el-checkbox')
    await expect(checkboxes).toHaveCount(0)
  })

  test('should display the toolbox actions column', async ({ page }) => {
    await expect(getFirstRow(page).getByTestId('wallet-actions-toolbox')).toBeVisible()
  })
})

// ─── Toolbox menu ────────────────────────────────────────────────────────────

test.describe('EntitiesManagementList - toolbox menu', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForAccountsTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should display "Gérer les droits du dossier" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Gérer les droits du dossier').first()).toBeVisible()
  })

  test('should display "Relancer le mail d\'activation" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, "Relancer le mail d'activation").first()).toBeVisible()
  })

  test('should NOT display "Accéder au dossier" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Accéder au dossier')).toHaveCount(0)
  })

  test('should NOT display "Déployer ce dossier" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Déployer ce dossier')).toHaveCount(0)
  })

  test('should NOT display "Me déclarer en relation client" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Me déclarer en relation client')).toHaveCount(0)
  })

  test('should open the account rights drawer on "Gérer les droits du dossier" click', async ({ page }) => {
    await clickToolboxAction(page, 'Gérer les droits du dossier')
    await expect(page.getByTestId('account-rights-company-card')).toBeVisible()
  })

  test('should open the resend activation email drawer', async ({ page }) => {
    await clickToolboxAction(page, "Relancer le mail d'activation")
    await expect(page.getByTestId('account-rights-company-card')).toBeVisible()
  })
})

// ─── Direct folder access ────────────────────────────────────────────────────

test.describe('EntitiesManagementList - direct folder access', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForAccountsTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should navigate away when clicking company name link', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click()
    await expect(page).not.toHaveURL(new RegExp(ACCOUNT_MANAGEMENT_URL))
  })

  test('should open a new tab and keep the account management tab on ctrl+click', async ({ page, context }) => {
    const newTabPromise = context.waitForEvent('page')

    await getFirstRow(page).getByTestId('account-access-link').click({ modifiers: ['ControlOrMeta'] })

    const newTab = await newTabPromise
    await expect(newTab).toHaveURL(/\/dossier\/\d+\/accueil/)
    await expect(page).toHaveURL(new RegExp(ACCOUNT_MANAGEMENT_URL))
  })

  test('should track Feature Consulted on click', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click()

    await expectFeatureConsulted(page, 'homepage')
  })

  // The link opens in a new tab, the tracking is expected in the tab where the link was clicked
  test('should track Feature Consulted on ctrl+click', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click({ modifiers: ['ControlOrMeta'] })

    await expectFeatureConsulted(page, 'homepage')
  })

  test('should track Feature Consulted on middle click', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click({ button: 'middle' })

    await expectFeatureConsulted(page, 'homepage')
  })
})

// ─── No search tracking ──────────────────────────────────────────────────────

test.describe('EntitiesManagementList - no search tracking', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForAccountsTable(page)
  })

  test('should not track search on row click (searchValue is not passed)', async ({ page }) => {
    await clearAmplitudeEvents(page)

    await getFirstRow(page).click()

    // Give a short delay to ensure any async tracking would have fired
    await page.waitForTimeout(500)

    const events = await getAmplitudeEvents(page)
    const searchEvent = events.find((e) => e.event_type === 'Wallet Action Search Researched')
    expect(searchEvent).toBeUndefined()
  })
})

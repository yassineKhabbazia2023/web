import { test, expect, type Page, type Locator } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
// Side-effect import: activates the globalThis.__AMPLITUDE_EVENTS__ type augmentation
import '@pulse/e2e-mocks/shims/amplitude'

import type { AmplitudeEvent } from '@pulse/e2e-mocks/shims/amplitude'

// ─── URLs ────────────────────────────────────────────────────────────────────
const FOLDERS_URL = 'portefeuille/dossiers'
const TABLE_TESTID = 'folders-table'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function setupPage(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
  await page.goto(FOLDERS_URL, { waitUntil: 'domcontentloaded' })
}

async function waitForFoldersTable(page: Page) {
  await expect(page.getByTestId(TABLE_TESTID)).toBeVisible({ timeout: 25000 })
}

function getTableRows(page: Page): Locator {
  return page.getByTestId(TABLE_TESTID).locator('tbody tr')
}

function getFirstRow(page: Page): Locator {
  return getTableRows(page).first()
}

async function getAmplitudeEvents(page: Page): Promise<AmplitudeEvent[]> {
  return page.evaluate(() => globalThis.__AMPLITUDE_EVENTS__ ?? [])
}

async function clearAmplitudeEvents(page: Page) {
  await page.evaluate(() => {
    globalThis.__AMPLITUDE_EVENTS__ = []
  })
}

function matchesEventProperties(
  event: AmplitudeEvent,
  expectedProperties: Record<string, unknown>,
): boolean {
  return Object.entries(expectedProperties).every(([key, value]) => {
    const actual = (event.event_properties as Record<string, unknown>)?.[key]
    if (Array.isArray(value)) {
      return Array.isArray(actual)
        && value.every((v) => actual.includes(v))
    }
    return actual === value
  })
}

async function expectAmplitudeEvent(
  page: Page,
  eventType: string,
  expectedProperties?: Record<string, unknown>,
) {
  await expect(async () => {
    const events = await getAmplitudeEvents(page)
    const match = events.find((e) => {
      if (e.event_type !== eventType) {
        return false
      }
      if (expectedProperties === undefined) {
        return true
      }
      return matchesEventProperties(e, expectedProperties)
    })
    expect(match).toBeDefined()
  }).toPass({ timeout: 10000 })
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

test.describe('RegularEntityList - rendering', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
  })

  test('should display rows matching the mock data', async ({ page }) => {
    await expect(getTableRows(page).getByTestId('account-access-link')).toHaveCount(4)
  })

  test('should display company name links', async ({ page }) => {
    const firstLink = getFirstRow(page).getByTestId('account-access-link')
    await expect(firstLink).toBeVisible()
    await expect(firstLink).toHaveText('Acme Corp')
  })

  test('should display the favorite star column', async ({ page }) => {
    const favoritedStars = getTableRows(page).locator('[data-testid="wallet-add-favorite"]')
    const unfavoritedStars = getTableRows(page).locator('[data-testid="wallet-remove-favorite"]')
    await expect(favoritedStars).toHaveCount(2)
    await expect(unfavoritedStars).toHaveCount(2)
  })

  test('should display the deployment status tags', async ({ page }) => {
    const tags = getTableRows(page).locator('.el-tag__content')
    await expect(tags.first()).toBeVisible()
  })

  test('should display the toolbox actions column', async ({ page }) => {
    await expect(getFirstRow(page).getByTestId('wallet-actions-toolbox')).toBeVisible()
  })

  test('should display checkboxes for folder selection', async ({ page }) => {
    const checkboxes = getTableRows(page).locator('.el-checkbox')
    await expect(checkboxes).toHaveCount(4)
  })
})

// ─── Favorite interactions ───────────────────────────────────────────────────

test.describe('RegularEntityList - favorites', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should track favorite activation when adding a favorite', async ({ page }) => {
    // BASIC is not a favorite — clicking its star should activate
    await getTableRows(page).locator('[data-testid="wallet-remove-favorite"]').first().click()

    await expectAmplitudeEvent(page, 'Wallet Action Favorite Request', {
      wallet_action_favorite_activation: 'activate',
    })
  })

  test('should track favorite deactivation when removing a favorite', async ({ page }) => {
    // LEGACY_GED is a favorite — clicking its star should deactivate
    await getTableRows(page).locator('[data-testid="wallet-add-favorite"]').first().click()

    await expectAmplitudeEvent(page, 'Wallet Action Favorite Request', {
      wallet_action_favorite_activation: 'deactivate',
    })
  })
})

// ─── Direct folder access ────────────────────────────────────────────────────

test.describe('RegularEntityList - direct folder access', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should track Feature Consulted when clicking company name link', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click()

    await expectAmplitudeEvent(page, 'Feature Consulted', {
      feature_name: 'homepage',
      feature_localisation_consultation: 'portefeuille',
    })
  })

  test('should navigate away when clicking company name link', async ({ page }) => {
    await getFirstRow(page).getByTestId('account-access-link').click()
    await expect(page).not.toHaveURL(new RegExp(FOLDERS_URL))
  })
})

// ─── Toolbox menu ────────────────────────────────────────────────────────────

test.describe('RegularEntityList - toolbox menu', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should track menu opening on toolbox click', async ({ page }) => {
    await clickFirstRowToolbox(page)

    await expectAmplitudeEvent(page, 'Wallet Action Folder Menu Requested', {
      wallet_action_menu_value: 'Ouverture menu',
    })
  })

  test('should display "Déployer ce dossier" menu item for "A déployer" status', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Déployer ce dossier').first()).toBeVisible()
  })

  test('should display "Accéder au dossier" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Accéder au dossier').first()).toBeVisible()
  })

  test('should display "Relancer le mail d\'activation" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, "Relancer le mail d'activation").first()).toBeVisible()
  })

  test('should display "Se déclarer en relation client" menu item', async ({ page }) => {
    await clickFirstRowToolbox(page)
    await expect(getVisibleMenuItem(page, 'Se déclarer en relation client').first()).toBeVisible()
  })

  test('should track "Accéder au dossier" menu action', async ({ page }) => {
    await clickToolboxAction(page, 'Accéder au dossier')

    await expectAmplitudeEvent(page, 'Wallet Action Folder Menu Requested', {
      wallet_action_menu_value: 'Accéder au dossier',
    })
  })

  test('should navigate away on "Accéder au dossier" click', async ({ page }) => {
    await clickToolboxAction(page, 'Accéder au dossier')
    await expect(page).not.toHaveURL(new RegExp(FOLDERS_URL))
  })

  test('should track "Relancer le mail d\'activation" menu action', async ({ page }) => {
    await clickToolboxAction(page, "Relancer le mail d'activation")

    await expectAmplitudeEvent(page, 'Wallet Action Folder Menu Requested', {
      wallet_action_menu_value: "Relancer le mail d'activation",
    })
  })

  test('should open the resend activation email drawer', async ({ page }) => {
    await clickToolboxAction(page, "Relancer le mail d'activation")
    await expect(page.getByTestId('account-rights-company-card')).toBeVisible()
  })

  test('should track "Se déclarer en relation client" menu action', async ({ page }) => {
    await clickToolboxAction(page, 'Se déclarer en relation client')

    await expectAmplitudeEvent(page, 'Wallet Action Folder Menu Requested', {
      wallet_action_menu_value: 'Se déclarer en relation client',
    })
  })

  test('should open the declare customer relation drawer', async ({ page }) => {
    await clickToolboxAction(page, 'Se déclarer en relation client')
    await expect(page.getByTestId('declare-customer-relation-entity-card')).toBeVisible()
  })

  test('should open the offers drawer on "Déployer ce dossier" click', async ({ page }) => {
    await clickToolboxAction(page, 'Déployer ce dossier')
    await expect(page.getByTestId('offers')).toBeVisible()
  })
})

// ─── Column sorting ──────────────────────────────────────────────────────────

test.describe('RegularEntityList - column sorting', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
    await clearAmplitudeEvents(page)
  })

  test('should track sort by "Raison sociale" column', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'Raison sociale' })
    await header.click()

    await expectAmplitudeEvent(page, 'Wallet Action Column Sort Requested', {
      wallet_action_sort_column: 'Raison sociale',
    })
  })

  test('should track sort by "Code client" column', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'Code client' })
    await header.click()

    await expectAmplitudeEvent(page, 'Wallet Action Column Sort Requested', {
      wallet_action_sort_column: 'Code client',
    })
  })

  test('should track sort by "Dirigeant" column', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'Dirigeant' })
    await header.click()

    await expectAmplitudeEvent(page, 'Wallet Action Column Sort Requested', {
      wallet_action_sort_column: 'Dirigeant',
    })
  })

  test('should track sort by "E-mail" column', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'E-mail' })
    await header.click()

    await expectAmplitudeEvent(page, 'Wallet Action Column Sort Requested', {
      wallet_action_sort_column: 'Mail',
    })
  })

  test('should track sort by "Ville" column', async ({ page }) => {
    const header = page.getByRole('columnheader', { name: 'Ville' })
    await header.click()

    await expectAmplitudeEvent(page, 'Wallet Action Column Sort Requested', {
      wallet_action_sort_column: 'Ville',
    })
  })
})

// ─── Search tracking ─────────────────────────────────────────────────────────

test.describe('RegularEntityList - search tracking', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page)
    await waitForFoldersTable(page)
  })

  test('should track search by company name when clicking a row after searching', async ({ page }) => {
    // Type a search term that matches a company name
    const searchInput = page.locator('input[placeholder*="Rechercher"]').first()
    await searchInput.fill('Acme')
    await searchInput.press('Enter')

    // Wait for table to reload with search results
    await waitForFoldersTable(page)
    await clearAmplitudeEvents(page)

    // Click on a non-interactive cell (city column) to trigger row-click without navigating
    const cityCell = getFirstRow(page).getByText('Paris')
    await cityCell.click()

    // "Acme" matches both "Acme Corp" (raison sociale) and "john.doe@acme.com" (email)
    await expectAmplitudeEvent(page, 'Wallet Action Search Researched', {
      wallet_action_search_term: 'Acme',
      wallet_action_search_type: ['raison sociale', 'email'],
    })
  })

  test('should not track search when no search value is set', async ({ page }) => {
    await clearAmplitudeEvents(page)

    // Click on a non-interactive cell to trigger row-click
    const cityCell = getFirstRow(page).getByText('Paris')
    await cityCell.click()

    const events = await getAmplitudeEvents(page)
    const searchEvent = events.find((e) => e.event_type === 'Wallet Action Search Researched')
    expect(searchEvent).toBeUndefined()
  })
})

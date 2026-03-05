import { test, expect } from '@playwright/test'
import { MockEntityId } from '@pulse/common/mocks'
import {
  setupAmplitudePage,
  clearAmplitudeEvents,
  expectFeatureConsulted,
  clickSidebarItem,
  clickOverviewTab,
} from './amplitude.config'

test.describe('Amplitude Navigation Tracking - Basic Entity', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
  })

  test('should track "homepage" when clicking on an entity from wallet', async ({ page }) => {
    await page.goto('/portefeuille/mes-entites')
    await expect(page.getByTestId('folders-table')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)

    await page.getByTestId('account-access-link').first().click()
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expectFeatureConsulted(page, 'homepage')
  })
})

test.describe('Amplitude Navigation Tracking - Legacy GED Entity', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.LEGACY_GED}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)
  })

  test('should track sidebar navigation to Documents', async ({ page }) => {
    await clickSidebarItem(page, 'Documents')
    await expectFeatureConsulted(page, 'documents')
  })

  test('should track sidebar navigation to Apps', async ({ page }) => {
    await clickSidebarItem(page, 'Applications')
    await expectFeatureConsulted(page, 'applications')
  })
})

test.describe('Amplitude Navigation Tracking - Pennylane Entity', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)
  })

  test('should track sidebar navigation to Pennylane Accounting', async ({ page }) => {
    await clickSidebarItem(page, 'Comptabilité')
    await expectFeatureConsulted(page, 'documents comptables')
  })

  test('should track sidebar navigation to Social Management', async ({ page }) => {
    await clickSidebarItem(page, 'Gestion sociale')
    await expectFeatureConsulted(page, 'documents gestion sociale')
  })
})

test.describe('Amplitude Navigation Tracking - Entity Overview Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.BASIC}/gestion-utilisateurs`)
    await expect(page.getByTestId('folder-tabs-wrapper')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)
  })

  test('should track tab click to Offres', async ({ page }) => {
    await clickOverviewTab(page, 'Offres')
    await expectFeatureConsulted(page, 'offres')
  })

  test('should track tab click to Informations', async ({ page }) => {
    await clickOverviewTab(page, 'Informations')
    await expectFeatureConsulted(page, 'informations')
  })

  test('should track tab click to Utilisateurs', async ({ page }) => {
    // Navigate away first: "Utilisateurs" is the active tab (from the beforeEach URL)
    await clickOverviewTab(page, 'Offres')
    await clearAmplitudeEvents(page)

    await clickOverviewTab(page, 'Utilisateurs')
    await expectFeatureConsulted(page, 'utilisateurs')
  })
})

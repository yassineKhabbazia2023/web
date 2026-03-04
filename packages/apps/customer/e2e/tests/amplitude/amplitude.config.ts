import { Page, expect } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'
// Side-effect import: activates the globalThis.__AMPLITUDE_EVENTS__ type augmentation
import '@pulse/e2e-mocks/shims/amplitude'
export type { AmplitudeEvent } from '@pulse/e2e-mocks/shims/amplitude'

/**
 * Setup a page for Amplitude E2E tests:
 * Inject auth token via addInitScript so it is available before the app starts
 */
export async function setupAmplitudePage(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
}

/**
 * Get all recorded Amplitude events from the shim.
 */
export async function getAmplitudeEvents(page: Page) {
  return page.evaluate(() => globalThis.__AMPLITUDE_EVENTS__ ?? [])
}

/**
 * Clear all recorded Amplitude events
 */
export async function clearAmplitudeEvents(page: Page) {
  await page.evaluate(() => {
    globalThis.__AMPLITUDE_EVENTS__ = []
  })
}

/**
 * Assert that an Amplitude event was tracked with the given type and optional properties
 */
export async function expectAmplitudeEvent(
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
      return Object.entries(expectedProperties).every(
        ([key, value]) => (e.event_properties as Record<string, unknown>)?.[key] === value,
      )
    })
    expect(match).toBeDefined()
  }).toPass({ timeout: 10000 })
}

/**
 * Assert that a "Feature Consulted" event was tracked with the given feature_name
 */
export async function expectFeatureConsulted(page: Page, featureName: string) {
  await expectAmplitudeEvent(page, 'Feature Consulted', { feature_name: featureName })
}

/**
 * Expand the sidebar by hovering over it, then click a menu item by its visible text
 */
export async function clickSidebarItem(page: Page, itemText: string) {
  const sidebar = page.getByTestId('sidenav-entity-menu')
  await sidebar.hover()
  const menuItem = sidebar.getByTestId('menu-item').filter({ hasText: itemText })
  await menuItem.click()
}

/**
 * Click an entity overview tab by its visible label text
 */
export async function clickOverviewTab(page: Page, tabLabel: string) {
  const tabsWrapper = page.getByTestId('folder-tabs-wrapper')
  await tabsWrapper.getByRole('tab', { name: tabLabel }).click()
}

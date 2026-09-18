import type { Page } from '@playwright/test'
import { tokenMock } from '@pulse/common/mocks'

export {
  getAmplitudeEvents,
  clearAmplitudeEvents,
  expectAmplitudeEvent,
  expectFeatureConsulted,
} from '@pulse/e2e-mocks/helpers/amplitude'
export type { AmplitudeEvent } from '@pulse/e2e-mocks/helpers/amplitude'

/**
 * Setup a page for Amplitude E2E tests:
 * Inject auth token via addInitScript so it is available before the app starts
 */
export async function setupAmplitudePage(page: Page) {
  await page.addInitScript((token) => localStorage.setItem('token', token), tokenMock)
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

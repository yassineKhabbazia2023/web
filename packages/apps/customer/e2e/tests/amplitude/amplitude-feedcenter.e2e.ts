import { test, expect } from '@playwright/test'
import { MockEntityId } from '@pulse/common/mocks'
import {
  setupAmplitudePage,
  clearAmplitudeEvents,
  expectAmplitudeEvent,
} from './amplitude.config'

test.describe('Amplitude Feed Center Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)
  })

  test('should track "Feedcenter opened" when clicking the bell icon', async ({ page }) => {
    const feedCenterButton = page.getByTestId('feed-center-button')
    await feedCenterButton.click()

    await expectAmplitudeEvent(page, 'Feedcenter opened')
  })

  test('should track "Feedcenter tabs selected" when switching to Unread tab', async ({ page }) => {
    const feedCenterButton = page.getByTestId('feed-center-button')
    await feedCenterButton.click()

    const drawer = page.getByTestId('feed-center-drawer')
    await expect(drawer).toBeVisible({ timeout: 5000 })

    await clearAmplitudeEvents(page)

    await drawer.getByRole('tab', { name: 'Non lu' }).click()

    await expectAmplitudeEvent(page, 'Feedcenter tabs selected', {
      feedcenter_tabs_consultation: 'Unread',
    })
  })

  test('should track "Feedcenter tabs selected" when switching back to All tab', async ({ page }) => {
    const feedCenterButton = page.getByTestId('feed-center-button')
    await feedCenterButton.click()

    const drawer = page.getByTestId('feed-center-drawer')
    await expect(drawer).toBeVisible({ timeout: 5000 })

    await drawer.getByRole('tab', { name: 'Non lu' }).click()

    await clearAmplitudeEvents(page)

    await drawer.getByRole('tab', { name: 'Tout' }).click()

    await expectAmplitudeEvent(page, 'Feedcenter tabs selected', {
      feedcenter_tabs_consultation: 'All',
    })
  })
})

import { test, expect } from '@playwright/test'
import { MockEntityId } from '@pulse/common/mocks'
import {
  setupAmplitudePage,
  clearAmplitudeEvents,
  expectAmplitudeEvent,
} from './amplitude.config'

test.describe('Amplitude Header Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await clearAmplitudeEvents(page)
  })

  test('should track "Brand logo clicked" when clicking the header logo', async ({ page }) => {
    const logo = page.getByTestId('header-logo')
    await logo.click()

    await expectAmplitudeEvent(page, 'Brand logo clicked')
  })
})

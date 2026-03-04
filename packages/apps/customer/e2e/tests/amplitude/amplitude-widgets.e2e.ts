import { test, expect } from '@playwright/test'
import { MockEntityId } from '@pulse/common/mocks'
import {
  setupAmplitudePage,
  clearAmplitudeEvents,
  expectAmplitudeEvent,
} from './amplitude.config'

test.describe('Amplitude Widget Tracking - Basic Entity Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.BASIC}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('widget-rss-news')).toBeVisible({ timeout: 10000 })
    await clearAmplitudeEvents(page)
  })

  test('should track "Widget Interacted With" on RSS news "See More" click', async ({ page }) => {
    const rssWidget = page.getByTestId('widget-rss-news')
    const seeMoreLink = rssWidget.locator('a').first()

    const popupPromise = page.waitForEvent('popup')
    await seeMoreLink.click()
    await popupPromise

    await expectAmplitudeEvent(page, 'Widget Interacted With', {
      widget_name: 'RssNews',
      feature_name: 'homepage',
    })
  })
})

test.describe('Amplitude Widget Tracking - Pennylane Entity Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await setupAmplitudePage(page)
    await page.goto(`/dossier/${MockEntityId.PENNYLANE}/accueil`)
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('widget-pennylane-intro')).toBeVisible({ timeout: 10000 })
    await clearAmplitudeEvents(page)
  })

  test('should track "Widget Interacted With" on Pennylane widget link click', async ({ page }) => {
    const pennylaneWidget = page.getByTestId('widget-pennylane-intro')
    const link = pennylaneWidget.locator('a').first()

    const popupPromise = page.waitForEvent('popup')
    await link.click()
    await popupPromise

    await expectAmplitudeEvent(page, 'Widget Interacted With', {
      widget_name: 'PennylaneIntro',
      feature_name: 'homepage',
    })
  })
})

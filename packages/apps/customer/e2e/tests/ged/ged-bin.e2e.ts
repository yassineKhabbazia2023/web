import { test } from '@playwright/test'
import {
  setupGedPage,
  navigateToGed,
  navigateToBin,
  waitForBinDocuments,
} from './ged.config'

test.describe('GED - Bin/Trash', () => {
  test.beforeEach(async ({ page }) => {
    await setupGedPage(page)
  })

  test('should navigate to bin section', async ({ page }) => {
    await navigateToGed(page)

    await navigateToBin(page)

    await waitForBinDocuments(page)
  })
})

import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
// Side-effect import: activates the globalThis.__AMPLITUDE_EVENTS__ type augmentation
import '../shims/amplitude-shim'
import type { AmplitudeEvent } from '../shims/amplitude-shim'

export type { AmplitudeEvent }

// The shim records events asynchronously, assertions retry until the event shows up
const AMPLITUDE_EVENT_TIMEOUT = 10000

/**
 * Get all recorded Amplitude events from the shim
 */
export async function getAmplitudeEvents(page: Page): Promise<AmplitudeEvent[]> {
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

// Array properties match when every expected item is present, other properties must be strictly equal
function matchesEventProperties(
  event: AmplitudeEvent,
  expectedProperties: Record<string, unknown>,
): boolean {
  return Object.entries(expectedProperties).every(([key, value]) => {
    const actual = (event.event_properties as Record<string, unknown>)?.[key]
    if (Array.isArray(value)) {
      return Array.isArray(actual)
        && value.every((expectedItem) => actual.includes(expectedItem))
    }
    return actual === value
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
    const match = events.find((event) => {
      if (event.event_type !== eventType) {
        return false
      }
      if (expectedProperties === undefined) {
        return true
      }
      return matchesEventProperties(event, expectedProperties)
    })
    expect(match).toBeDefined()
  }).toPass({ timeout: AMPLITUDE_EVENT_TIMEOUT })
}

/**
 * Assert that a "Feature Consulted" event was tracked with the given feature_name
 */
export async function expectFeatureConsulted(page: Page, featureName: string) {
  await expectAmplitudeEvent(page, 'Feature Consulted', { feature_name: featureName })
}

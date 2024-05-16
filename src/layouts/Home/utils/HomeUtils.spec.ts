import { expect, describe, it, vi } from 'vitest'
import { getBrowserName } from '.'

describe('homeUtils', () => {
  describe('getBrowserName', () => {
    it.each([
      {
        mockedValue: 'Opera',
        expectedValue: 'Opera',
      },
      {
        mockedValue: 'Firefox',
        expectedValue: 'Firefox',
      },
      {
        mockedValue: 'Edge',
        expectedValue: 'Edge',
      },
      {
        mockedValue: 'Chrome',
        expectedValue: 'Chrome',
      },
      {
        mockedValue: 'Safari',
        expectedValue: 'Safari',
      },
      {
        mockedValue: 'MSIE',
        expectedValue: 'IE',
      },
      {
        mockedValue: 'Brave',
        expectedValue: 'unknown',
      },
    ])(
      'should return the correct browser name',
      ({ mockedValue, expectedValue }) => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(mockedValue)
        const browserName = getBrowserName()
        expect(browserName).toBe(expectedValue)
      },
    )
  })
})

import { expect, describe, it, vi } from 'vitest'
import { getBrowserName } from '.'

describe('helper', () => {
  describe('getBrowserName', () => {
    it.each([
      {
        mockedNavigatorUserAgent: 'OPR',
        expectedBrowserName: 'Opera',
      },
      {
        mockedNavigatorUserAgent: 'Firefox',
        expectedBrowserName: 'Firefox',
      },
      {
        mockedNavigatorUserAgent: 'Edg',
        expectedBrowserName: 'Microsoft Edge',
      },
      {
        mockedNavigatorUserAgent: 'Chrome',
        expectedBrowserName: 'Chrome',
      },
      {
        mockedNavigatorUserAgent: 'Safari',
        expectedBrowserName: 'Safari',
      },
      {
        mockedNavigatorUserAgent: 'MSIE',
        expectedBrowserName: 'Microsoft Internet Explorer',
      },
      {
        mockedNavigatorUserAgent: 'Brave',
        expectedBrowserName: 'Unknown',
      },
    ])(
      'should return %s as the browser name for the user agent %s',
      ({ mockedNavigatorUserAgent, expectedBrowserName }) => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
          mockedNavigatorUserAgent,
        )
        const browserName = getBrowserName()
        expect(browserName).toBe(expectedBrowserName)
      },
    )
  })
})

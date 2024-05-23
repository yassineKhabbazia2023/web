import { expect, describe, it, vi } from 'vitest'
import { getBrowserName, getDuplicates } from '.'

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

  describe('getDuplicates', () => {
    it('should return duplicates', () => {
      const list = [
        null,
        undefined,
        undefined,
        'a',
        1,
        2,
        1,
        'b',
        'B',
        'a',
        1,
      ]
      const duplicates = getDuplicates<number|string|null|undefined>(list)
      const expectedDuplicated = [
        undefined,
        'a',
        1,
      ]
      expect(duplicates).toStrictEqual(expectedDuplicated)
    })
  })
})

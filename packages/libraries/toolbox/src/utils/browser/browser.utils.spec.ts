import { copyToClipboard, getBrowserName, isMobileDevice } from './browser.utils.js'
import { logger } from '../../logger/logger'

describe('browser.utils', () => {
  describe('copyToClipboard', () => {
    const writeTextMock = vi.fn()

    beforeAll(() => {
      // jsdom has no clipboard API: the property is added for this file only
      // and removed afterwards (isolate-safe doctrine: shared-dom).
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: writeTextMock },
      })
    })

    afterAll(() => {
      delete (navigator as { clipboard?: unknown }).clipboard
    })

    beforeEach(() => {
      writeTextMock.mockReset()
    })

    it('returns true and calls writeText when the copy succeeds', async () => {
      writeTextMock.mockResolvedValueOnce(undefined)

      const result = await copyToClipboard('hello')

      expect(result).toBe(true)
      expect(writeTextMock).toHaveBeenCalledWith('hello')
    })

    it('returns false and logs when writeText throws', async () => {
      const error = new Error('nope')
      writeTextMock.mockRejectedValueOnce(error)
      const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => undefined)

      const result = await copyToClipboard('hello')

      expect(result).toBe(false)
      // Wait for the log to land while the spy is still armed: under a shared
      // worker a late microtask would otherwise hit the next file's tests.
      await vi.waitFor(() => expect(loggerSpy).toHaveBeenCalledWith('Failed to copy to clipboard', error))
    })
  })


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
      'should return $expectedBrowserName as the browser name for the user agent $mockedNavigatorUserAgent',
      ({ mockedNavigatorUserAgent, expectedBrowserName }) => {
        vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
          mockedNavigatorUserAgent,
        )
        const browserName = getBrowserName()
        expect(browserName).toBe(expectedBrowserName)
      },
    )
  })

  describe('isMobileDevice', () => {
    it.each([
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)',
      'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
      'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 Opera Mini',
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; IEMobile/10.0)',
      'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900)',
      'Mozilla/5.0 (webOS/1.0; U; en-US)',
    ])('should return true for mobile user agent: %s', (userAgent) => {
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
      expect(isMobileDevice()).toBe(true)
    })

    it.each([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64) Firefox/89.0',
    ])('should return false for desktop user agent: %s', (userAgent) => {
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
      expect(isMobileDevice()).toBe(false)
    })
  })
})

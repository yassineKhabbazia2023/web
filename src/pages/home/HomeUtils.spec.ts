
import { describe, expect, it, vi, beforeEach, type SpyInstance } from 'vitest'
import { openSilaeUrl, handleClickAction } from './HomeUtils'
import { LAUNCHER_KEY } from './HomeTypes'
import * as launcherServices from '@/services/launcherServices'

const mockedSilaeUrl = 'https://mocked.silae.url'

vi.mock('@/services/launcherServices', () => ({
  getSsoSilaeUrl: vi.fn(() => mockedSilaeUrl),
}))

describe('test HomeUtils', () => {
  let consoleErrorSpy: SpyInstance
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error')
  })

  describe('handleClickAction', () => {
    it('should call window.open when key is silae', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: '',
        },
      })
      await handleClickAction(LAUNCHER_KEY.silae)
      const expectedHRef = `mypulse-launch://${mockedSilaeUrl}`

      expect(window.location.href).toBe(expectedHRef)
    })

    it('should do nothing when key is meg', async () => {
      await handleClickAction(LAUNCHER_KEY.meg)

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should call console.error when api throws an error', async () => {
      const thrownError = 'thrown-error'
      vi
        .spyOn(launcherServices, 'getSsoSilaeUrl')
        .mockRejectedValueOnce(thrownError)
      await handleClickAction(LAUNCHER_KEY.silae)

      expect(consoleErrorSpy).toHaveBeenCalledOnce()
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, thrownError)
    })
  })

  describe('openSilaeUrl', () => {
    it('should throw error when silaeUrl is empty', async () => {
      const expectedError = 'ssoSilaeUrl is empty'
      vi
        .spyOn(launcherServices, 'getSsoSilaeUrl')
        .mockResolvedValueOnce('')

      await expect(async () => await openSilaeUrl()).rejects.toThrow(expectedError)
    })
  })
})

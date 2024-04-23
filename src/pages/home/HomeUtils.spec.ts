
import { describe, expect, it, vi, beforeEach, type SpyInstance } from 'vitest'
import { openSilaeUrl, handleClickAction } from './HomeUtils'
import { LAUNCHER_KEY } from './HomeTypes'
import * as launcherServices from '@/services/launcherServices'

const mockedSilaeUrl = 'https://mocked.silae.url'
vi.mock('@/services/launcherServices', () => ({
  getSsoSilaeUrl: vi.fn(() => mockedSilaeUrl),
}))

describe('test HomeUtils', () => {
  describe('handleClickAction', () => {
    let windowOpenSpy: SpyInstance

    beforeEach(() => {
      windowOpenSpy = vi.spyOn(window, 'open')
    })

    it('should call window.open when key is silae', async () => {
      await handleClickAction(LAUNCHER_KEY.silae)

      expect(windowOpenSpy).toHaveBeenCalledOnce()
      expect(windowOpenSpy).toHaveBeenNthCalledWith(1, mockedSilaeUrl)
    })

    it('should do nothing when key is meg', async () => {
      await handleClickAction(LAUNCHER_KEY.meg)

      expect(windowOpenSpy).not.toHaveBeenCalledOnce()
    })

    it('should call console.error when api throws an error', async () => {
      const thrownError = 'thrown-error'
      vi
        .spyOn(launcherServices, 'getSsoSilaeUrl')
        .mockRejectedValueOnce(thrownError)
      const consoleErrorSpy = vi.spyOn(console, 'error')
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

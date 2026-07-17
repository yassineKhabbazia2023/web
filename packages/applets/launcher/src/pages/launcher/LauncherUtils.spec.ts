import type { MockInstance } from 'vitest'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { mockedSilaeUrl } from '@launcher/__mocks__/launcher.service.mocks'
import { LauncherKey } from './LauncherTypes'
import * as launcherServices from '@launcher/services/launcherServices'
import type { AxiosResponse } from 'axios'

import {
  getSilaeDownloadLabel,
  getLaunchCards,
  openSilaeUrl,
  handleClickAction,
  handleDownload,
} from './LauncherUtils'

function getMockedResponse(disposition = '') {
  return {
    data: 'application',
    headers: {
      'content-disposition': disposition,
    },
  } as unknown as AxiosResponse
}

describe('test LauncherUtils', () => {
  describe('getSilaeDownloadLabel', () => {
    const tests = [{
      silaeDownloadPercent: undefined,
      expectedLabel: 'Télécharger',
    }, {
      silaeDownloadPercent: 23,
      expectedLabel: 'Téléchargement (23 %)',
    }, {
      silaeDownloadPercent: 100,
      expectedLabel: 'Téléchargement terminé',
    }]

    it.each(tests)('expect label to be `$expectedLabel` when silaeDownloadPercent is $silaeDownloadPercent', ({
      silaeDownloadPercent,
      expectedLabel,
    }) => {
      const downloadLabel = getSilaeDownloadLabel(silaeDownloadPercent)

      expect(downloadLabel).toBe(expectedLabel)
    })
  })

  describe('getLaunchCards', () => {
    it('should return proper launchCards', async () => {
      const downloadSilaeLabel = 'Télécharger'
      const authorizedKeys: LauncherKey[] = [
        LauncherKey.MEG,
        LauncherKey.SILAE,
        LauncherKey.PENNYLANE,
      ]
      const launchCards = getLaunchCards(downloadSilaeLabel, authorizedKeys)

      await expect(launchCards).toMatchFileSnapshot('__snaps__/LauncherUtils/getLaunchCards/launchCards.snap')
    })

    it('should return filtered launchCards', () => {
      const downloadSilaeLabel = 'Télécharger'
      const authorizedKeys: LauncherKey[] = [
        LauncherKey.MEG,
        LauncherKey.PENNYLANE,
      ]
      const launchCards = getLaunchCards(downloadSilaeLabel, authorizedKeys)
      const launchCardKeys = launchCards.map(({ key }) => key)

      expect(launchCardKeys).toStrictEqual(authorizedKeys)
    })
  })

  beforeEach(() => {

  })

  describe('handleClickAction', () => {
    beforeEach(() => {
      // launcherServices is spy-wrapped (real by default): re-arm the canned
      // SSO url its legacy module mock used to provide (doctrine: shared-hubs).
      vi.mocked(launcherServices.getSsoSilaeUrl).mockResolvedValue(mockedSilaeUrl)
    })

    it('should call window.open when key is silae', async () => {
      vi.stubGlobal('location', { href: '' })
      await handleClickAction(LauncherKey.SILAE)
      const expectedHRef = `mypulse-launch://${mockedSilaeUrl}`

      expect(window.location.href).toBe(expectedHRef)
    })

    it('should do nothing when key is meg', async () => {
      await handleClickAction(LauncherKey.MEG)

      expect(loggerErrorSpy).not.toHaveBeenCalled()
    })

    it('should call logger.error when api throws an error', async () => {
      const thrownError = 'thrown-error'
      vi.mocked(launcherServices.getSsoSilaeUrl).mockRejectedValueOnce(thrownError)
      await handleClickAction(LauncherKey.SILAE)

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, thrownError)
    })
  })

  describe('handleDownload', () => {
    const mockedPercent = 78
    const mockedResponse = getMockedResponse()
    let downloadApplicationSpy: MockInstance
    let saveApplicationSpy: MockInstance
    const onSilaeDownloadProgress = vi.fn()

    beforeEach(() => {
      // launcherServices is spy-wrapped (real by default): stub the shared
      // spies per test via vi.mocked (doctrine: shared-hubs).
      downloadApplicationSpy = vi.mocked(launcherServices.downloadApplication)
        .mockImplementation((progressPercentCallback: (_: number) => void) => {
          progressPercentCallback(mockedPercent)

          return Promise.resolve(mockedResponse)
        })

      saveApplicationSpy = vi.mocked(launcherServices.saveApplication)
        .mockImplementation(() => undefined)
    })

    it('should call downloadApplicationSpy and saveApplicationSpy when key is silae', async () => {
      await handleDownload(LauncherKey.SILAE, onSilaeDownloadProgress)

      expect(downloadApplicationSpy).toHaveBeenCalledOnce()
      expect(saveApplicationSpy).toHaveBeenCalledOnce()
    })

    it('should call onSilaeDownloadProgress callback function when key is silae', async () => {
      await handleDownload(LauncherKey.SILAE, onSilaeDownloadProgress)

      expect(onSilaeDownloadProgress).toHaveBeenCalledOnce()
      expect(onSilaeDownloadProgress).toHaveBeenNthCalledWith(1, mockedPercent)
    })

    it('should do nothing when key is meg', async () => {
      await handleDownload(LauncherKey.MEG, onSilaeDownloadProgress)

      expect(downloadApplicationSpy).not.toHaveBeenCalled()
      expect(saveApplicationSpy).not.toHaveBeenCalled()
    })

    it('should call logger.error when api throws an error', async () => {
      const thrownError = 'thrown-error'
      vi.mocked(launcherServices.downloadApplication).mockRejectedValueOnce(thrownError)

      await handleDownload(LauncherKey.SILAE, onSilaeDownloadProgress)

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, thrownError)
    })
  })

  describe('openSilaeUrl', () => {
    it('should throw error when silaeUrl is empty', async () => {
      const expectedError = 'ssoSilaeUrl is empty'
      vi.mocked(launcherServices.getSsoSilaeUrl).mockResolvedValueOnce('')

      await expect(openSilaeUrl()).rejects.toThrow(expectedError)
    })
  })
})

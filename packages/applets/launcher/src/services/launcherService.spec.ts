import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { AxiosResponse } from 'axios'
import { commonApiSilaeClientGetSpy, commonApiSilaePostSpy } from '@/../vitest.setup'
import { DEFAULT_APPLICATION_FILENAME, API_ROUTES } from './launcherServiceConsts'
import * as FileSaver from 'file-saver'
import { downloadApplication, getFileName, saveApplication, getSsoSilaeUrl }
  from './launcherServices'
import { flushPromises } from '@vue/test-utils'

vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

function getMockedResponse(disposition = '') {
  return {
    data: 'application',
    headers: {
      'content-disposition': disposition,
    },
  } as unknown as AxiosResponse
}

describe('launcherServices', () => {
  describe('downloadApplication', () => {
    const progressPercentCallback = vi.fn()

    it('should return expected response', async () => {
      const mockedResponse = getMockedResponse()
      commonApiSilaeClientGetSpy.mockResolvedValueOnce(mockedResponse)

      const response = await downloadApplication(progressPercentCallback)

      expect(response).toStrictEqual(mockedResponse)
    })

    it('should call callback', async () => {
      const expectedCompletePercent = 100
      const progress = 0.27
      const progressPercent = Math.round(progress * 100)

      commonApiSilaeClientGetSpy.mockImplementation((_, { onDownloadProgress }) => {
        onDownloadProgress({ progress })

        return Promise.resolve({})
      })

      await downloadApplication(progressPercentCallback)

      expect(progressPercentCallback).toHaveBeenCalledTimes(2)
      expect(progressPercentCallback).toHaveBeenNthCalledWith(1, progressPercent)
      expect(progressPercentCallback).toHaveBeenNthCalledWith(2, expectedCompletePercent)
    })

    it('should call callback with 0 percent when progress is undefined', async () => {
      const expectedProgressPercent = 0

      commonApiSilaeClientGetSpy.mockImplementation((_, { onDownloadProgress }) => {
        onDownloadProgress({})

        return Promise.resolve({})
      })

      await downloadApplication(progressPercentCallback)

      expect(progressPercentCallback).toHaveBeenNthCalledWith(1, expectedProgressPercent)
    })
  })

  describe('getFileName', () => {
    const fileName = 'myPulse.DesktopClient-x64.exe'
    const tests = [{
      disposition: '',
      expected: DEFAULT_APPLICATION_FILENAME,
      reason: 'no disposition',
    }, {
      disposition: `fileNae ${fileName}`,
      expected: DEFAULT_APPLICATION_FILENAME,
      reason: 'disposition does not match regexp',
    }, {
      disposition: `attachment; filename=${fileName}`,
      expected: fileName,
      reason: 'disposition contains filename',
    }, {
      disposition: `attachment; filename="${fileName}"`,
      expected: fileName,
      reason: 'disposition contains filename with double-quotes',
    }, {
      disposition: `attachment; filename='${fileName}'`,
      expected: fileName,
      reason: 'disposition contains filename with single-quotes',
    }, {
      disposition: `attachment; filename='${fileName}' foo`,
      expected: fileName,
      reason: 'disposition contains filename and other things',
    }]
    it.each(tests)('expect return $expected when $reason', ({
      disposition,
      expected,
    }) => {
      const fileName = getFileName(disposition)
      expect(fileName).toBe(expected)
    })
  })

  describe('saveApplication', () => {
    it('sdf', () => {
      const mockedSaveAs = vi.spyOn(FileSaver, 'saveAs')
      const mockedResponse = getMockedResponse()
      saveApplication(mockedResponse)

      expect(mockedSaveAs).toHaveBeenCalledOnce()
      expect(mockedSaveAs).toHaveBeenNthCalledWith(1, expect.any(Blob), DEFAULT_APPLICATION_FILENAME)
    })
  })

  describe('getSsoSilaeUrl', () => {
    const redirectUrl = 'https://redirect-url'
    beforeEach(() => {
      commonApiSilaePostSpy.mockResolvedValue({
        data: { redirectUrl },
      })
    })

    it('should call commonApiSilaePostSpy', () => {
      getSsoSilaeUrl()

      expect(commonApiSilaePostSpy).toHaveBeenCalledOnce()
      expect(commonApiSilaePostSpy).toHaveBeenNthCalledWith(1, API_ROUTES.silaeSso, { wrapRedirect: true })
    })

    it('should return encoded redirectUrl', async () => {
      const ssoSilaeUrl = await getSsoSilaeUrl()
      await flushPromises()
      const expectedEncodedUrl = encodeURIComponent(redirectUrl)

      expect(ssoSilaeUrl).toBe(expectedEncodedUrl)
    })

    it('should throw error when redirectUrl given', async () => {
      const expectedError = 'no redirectUrl given'
      commonApiSilaePostSpy.mockResolvedValue({
        data: {},
      })

      await expect(async () => await getSsoSilaeUrl()).rejects.toThrow(expectedError)
    })
  })
})

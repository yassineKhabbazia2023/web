import * as fs from 'fs'
import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

import { clearFolder, getSvgoConfig } from './utils'

vi.mock('fs', () => ({
  mkdirSync: vi.fn(),
  existsSync: vi.fn().mockReturnValue(true),
  rmSync: vi.fn(),
}))

describe('scripts/common/utils', () => {
  describe('clearFolder', () => {
    let mockedRmSync: MockInstance
    const folderPath = 'my-folder'

    beforeEach(() => {
      mockedRmSync = vi.spyOn(fs, 'rmSync')
    })
    it('should call rmSync once', () => {
      clearFolder(folderPath)
      expect(mockedRmSync).toHaveBeenCalledTimes(1)
    })
    it('should call rmSync with proper arguments', () => {
      clearFolder(folderPath)
      const options = {
        force: true,
        recursive: true,
      }
      expect(mockedRmSync).toHaveBeenNthCalledWith(1, folderPath, options)
    })
    it('should not call rmSync when folder does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false)
      clearFolder(folderPath)
      expect(mockedRmSync).not.toHaveBeenCalled()
    })
  })

  describe('getSvgoConfig', () => {
    it('should return proper object when hasRemoveXmlnsPlugin is true', () => {
      const svgoConfig = getSvgoConfig(true)
      expect(svgoConfig.plugins).toHaveLength(3)
      expect(svgoConfig.plugins?.includes('removeXMLNS')).toBeTruthy()
    })
    it('should return proper object when hasRemoveXmlnsPlugin is false', () => {
      const svgoConfig = getSvgoConfig(false)
      expect(svgoConfig.plugins).toHaveLength(2)
      expect(svgoConfig.plugins?.includes('removeXMLNS')).toBeFalsy()
    })
  })
})

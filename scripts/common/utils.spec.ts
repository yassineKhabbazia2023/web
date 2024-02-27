import * as fs from 'fs'
import { beforeEach, describe, expect, it, vi, type SpyInstance } from 'vitest'

import { clearFolder } from './utils'

vi.mock('fs', () => ({
  mkdirSync: vi.fn(),
  existsSync: vi.fn().mockReturnValue(true),
  rmSync: vi.fn()
}))

describe('pulseIconGenLib', () => {
  describe('clearFolder', () => {
    let mockedRmSync: SpyInstance
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
        recursive: true
      }
      expect(mockedRmSync).toHaveBeenNthCalledWith(1, folderPath, options)
    })
    it('should not call rmSync when folder does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false)
      clearFolder(folderPath)
      expect(mockedRmSync).not.toHaveBeenCalled()
    })
  })
})

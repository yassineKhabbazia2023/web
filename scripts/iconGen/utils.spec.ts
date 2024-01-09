import { beforeEach, describe, expect, it, vi, type SpyInstance } from 'vitest'
import * as pulseIconGenLib from './lib'

import { generateComponents, generateIcons } from './utils'
import { MOCKED_ICON_1, MOCKED_ICON_2 } from './mocks'

vi.mock('./pulseIconGenLib', () => {
  return {
    getIcons: vi.fn(),
    generateComponent: vi.fn(),
    writeComponentIndex: vi.fn(),
    writeComponentConstants: vi.fn(),
    clearFolder: vi.fn()
  }
})

describe('pulseIconGenUtils', () => {
  const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
  const outputPath = 'output-folder'
  const validTargetFilePath = 'a/b/c.vue'
  const expectedTargetFilePaths = [validTargetFilePath]
  let mockedGenerateComponent: SpyInstance
  let targetFilePaths: string[]

  beforeEach(() => {
    mockedGenerateComponent = vi
      .spyOn(pulseIconGenLib, 'generateComponent')
      .mockReturnValueOnce(validTargetFilePath)
      .mockReturnValueOnce('')
  })

  describe('generateComponents', () => {
    beforeEach(() => {
      targetFilePaths = generateComponents(icons, outputPath)
    })
    it('should call generateComponent N times', () => {
      expect(mockedGenerateComponent).toHaveBeenCalledTimes(icons.length)
    })
    it('should call generateComponent with proper arguments', () => {
      const componentName = icons.at(0)?.componentName
      const filePath = icons.at(0)?.filePath
      expect(mockedGenerateComponent).toHaveBeenNthCalledWith(1, componentName, filePath, outputPath)
    })
    it('should return not empty targetFilePaths', () => {
      expect(targetFilePaths).toStrictEqual(expectedTargetFilePaths)
    })
  })

  describe('generateIcons', () => {
    const icons = [MOCKED_ICON_1, MOCKED_ICON_1]
    const iconsFolderPath = 'icon-folder'
    const outputPath = 'output-folder'
    let mockedGetIcons: SpyInstance
    let mockedClearFolder: SpyInstance
    let mockedWriteComponentIndex: SpyInstance
    let mockedWriteComponentConstants: SpyInstance

    beforeEach(() => {
      mockedGetIcons = vi
        .spyOn(pulseIconGenLib, 'getIcons')
        .mockReturnValue(icons)
      mockedClearFolder = vi
        .spyOn(pulseIconGenLib, 'clearFolder')
        .mockReturnValue()
      mockedWriteComponentIndex = vi
        .spyOn(pulseIconGenLib, 'writeComponentIndex')
        .mockReturnValue()
      mockedWriteComponentConstants = vi
        .spyOn(pulseIconGenLib, 'writeComponentConstants')
        .mockReturnValue()

      generateIcons(iconsFolderPath, outputPath)
    })

    it('should call mockedGetIcons with proper arguments', () => {
      expect(mockedGetIcons).toHaveBeenCalledWith(iconsFolderPath, '')
    })

    it('should call mockedClearFolder with proper arguments', () => {
      expect(mockedClearFolder).toHaveBeenCalledWith(outputPath, expectedTargetFilePaths)
    })

    it('should call mockedWriteComponentIndex with proper arguments', () => {
      expect(mockedWriteComponentIndex).toHaveBeenCalledWith(outputPath, icons)
    })

    it('should call mockedWriteComponentConstants with proper arguments', () => {
      expect(mockedWriteComponentConstants).toHaveBeenCalledWith(outputPath, icons)
    })
  })
})

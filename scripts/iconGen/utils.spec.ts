import { beforeEach, describe, expect, it, vi, type SpyInstance } from 'vitest'
import * as pulseIconGenLib from './lib'
import * as commonUtils from '../common/utils'

import { generateComponents, generateIcons } from './utils'
import { MOCKED_ICON_1, MOCKED_ICON_2 } from './mocks'

vi.mock('./lib', () => {
  return {
    getIcons: vi.fn(),
    generateComponent: vi.fn(),
    writeComponentIndex: vi.fn(),
    writeComponentConstants: vi.fn(),
    clearFolder: vi.fn()
  }
})

vi.mock('../common/utils', () => {
  return {
    clearFolder: vi.fn()
  }
})

describe('pulseIconGenUtils', () => {
  const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
  const outputPath = 'output-folder'
  let mockedGenerateComponent: SpyInstance

  beforeEach(() => {
    mockedGenerateComponent = vi
      .spyOn(pulseIconGenLib, 'generateComponent')
  })

  describe('generateComponents', () => {
    beforeEach(() => {
      generateComponents(icons, outputPath)
    })
    it('should call generateComponent N times', () => {
      expect(mockedGenerateComponent).toHaveBeenCalledTimes(icons.length)
    })
    it('should call generateComponent with proper arguments', () => {
      const componentName = icons.at(0)?.componentName
      const filePath = icons.at(0)?.filePath
      expect(mockedGenerateComponent).toHaveBeenNthCalledWith(1, componentName, filePath, outputPath)
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
        .spyOn(commonUtils, 'clearFolder')
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
      expect(mockedClearFolder).toHaveBeenCalledWith(outputPath)
    })

    it('should call mockedWriteComponentIndex with proper arguments', () => {
      expect(mockedWriteComponentIndex).toHaveBeenCalledWith(outputPath, icons)
    })

    it('should call mockedWriteComponentConstants with proper arguments', () => {
      expect(mockedWriteComponentConstants).toHaveBeenCalledWith(outputPath, icons)
    })
  })
})

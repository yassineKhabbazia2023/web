import { type MockInstance } from 'vitest'
import * as pulseIconGenLib from './lib'
import * as commonUtils from '../common/utils'

import { generateComponents, generateIcons } from './utils'
import { MOCKED_ICON_1, MOCKED_ICON_2, MOCKED_SVGO_CONFIG } from './mocks'

// eslint-disable-next-line no-restricted-syntax -- doctrine: shared-hubs (node build-script spec: hubbing these fs-writing script mocks in vitest.setup.ts would leak them into the jsdom component worker)
vi.mock('./lib', () => {
  return {
    getIcons: vi.fn(),
    generateComponent: vi.fn(),
    writeComponentIndex: vi.fn(),
    writeComponentConstants: vi.fn(),
    generateTypes: vi.fn(),
  }
})

// eslint-disable-next-line no-restricted-syntax -- doctrine: shared-hubs (node build-script spec: hubbing these fs-writing script mocks in vitest.setup.ts would leak them into the jsdom component worker)
vi.mock('../common/utils', () => {
  return {
    clearFolder: vi.fn(),
    getSvgoConfig: vi.fn(),
  }
})

describe('pulseIconGenUtils', () => {
  const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
  const outputPath = 'output-folder'
  let mockedGenerateComponent: MockInstance

  beforeEach(() => {
    mockedGenerateComponent = vi
      .spyOn(pulseIconGenLib, 'generateComponent')
  })

  describe('scripts/iconGen/utils', () => {
    it('should call generateComponent with proper arguments', async () => {
      const svgoConfig = MOCKED_SVGO_CONFIG
      await generateComponents(icons, outputPath, svgoConfig)
      const componentName = icons.at(0)?.componentName
      const filePath = icons.at(0)?.filePath

      expect(mockedGenerateComponent).toHaveBeenCalledTimes(icons.length)
      expect(mockedGenerateComponent).toHaveBeenNthCalledWith(1, componentName, filePath, outputPath, svgoConfig)
    })
  })

  describe('generateIcons', () => {
    const icons = [MOCKED_ICON_1, MOCKED_ICON_1]
    const iconsFolderPath = 'icon-folder'
    const outputPath = 'output-folder'
    let mockedGetIcons: MockInstance
    let mockedClearFolder: MockInstance
    let mockedWriteComponentIndex: MockInstance
    let mockedWriteComponentConstants: MockInstance

    beforeEach(async () => {
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

      await generateIcons(iconsFolderPath, outputPath, 'svg')
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

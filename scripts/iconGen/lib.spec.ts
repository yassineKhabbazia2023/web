import * as fs from 'fs'
import { beforeEach, describe, expect, it, vi, type SpyInstance } from 'vitest'
import { MOCKED_ICON_1, MOCKED_ICON_2, MOCKED_SVG_CODE } from './mocks'

import {
  capitalizeFirstLetter, getComponentInfo, getIcons, generateComponent,
  getComponentConstantsContent, writeComponentConstants, getComponentIndexContent, writeComponentIndex
} from './lib'

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  readdirSync: vi.fn(),
  mkdirSync: vi.fn(),
  existsSync: vi.fn().mockReturnValue(true),
  rmSync: vi.fn(),
  statSync: (filePath: string) => ({
    isDirectory: () => !filePath.includes('.'),
    isFile: () => filePath.includes('.')
  })
}))

vi.mock('path', () => ({
  default: {
    basename: (name) => {
      const fileName = name.match(/\/([^/]*)$/)?.at(1) ?? name
      const match = fileName.match(/(.*)\./)
      return match.at(1) ?? ''
    },
    extname: (name) => {
      const match = name.match(/\.([^.]*)$/)
      return match.at(0) ?? ''
    },
    join: (...args: string[]) => args.join('/')
  }
}))

vi.mock('@/utils/logger')

describe('pulseIconGenLib', () => {
  describe('capitalizeFirstLetter', () => {
    const words = [{
      word: '',
      expected: ''
    }, {
      word: 'a',
      expected: 'A'
    }, {
      word: 'ab-c',
      expected: 'AbC'
    }, {
      word: 'a b',
      expected: 'A b'
    }]
    it.each(words)(
      'should return \'$expected\' when \'$word\'', ({
        word,
        expected
      }) => {
        const capitalized = capitalizeFirstLetter(word)
        expect(capitalized).toBe(expected)
      }
    )
  })

  describe('getIcons', () => {
    let mockedReaddirSync: SpyInstance
    beforeEach(() => {
      mockedReaddirSync = vi.spyOn(fs, 'readdirSync')
    })
    it('should return proper list of icons when no sub-folder', () => {
      mockedReaddirSync.mockReturnValueOnce(['b.svg', 'c.svg', 'd.txt'])

      const icons = getIcons('my-folder', 'my-category')
      expect(icons).toMatchFileSnapshot('__snapshots__/getIcons/without-subFolders.snap')
    })
    it('should return proper list of icons when folder contains sub-folders', () => {
      mockedReaddirSync
        .mockReturnValueOnce(['a.svg', 'sub-folder'])
        .mockReturnValueOnce(['b.svg', 'c.svg', 'd.txt'])

      const icons = getIcons('my-folder', 'my-category')
      expect(icons).toMatchFileSnapshot('__snapshots__/getIcons/with-subFolders.snap')
    })
  })

  describe('getComponentInfo', () => {
    const iconPath = 'a/b/icon-name.svg'
    const {
      iconName,
      viewBox,
      pathData,
      componentName,
      componentCode
    } = getComponentInfo(iconPath, MOCKED_SVG_CODE)

    it('should return proper iconName', () => {
      const expected = 'icon-name'
      expect(iconName).toBe(expected)
    })
    it('should return proper viewBox', () => {
      expect(viewBox).toMatchFileSnapshot('__snapshots__/getComponentInfo/viewBox.snap')
    })
    it('should return proper pathData', () => {
      expect(pathData).toMatchFileSnapshot('__snapshots__/getComponentInfo/pathData.snap')
    })
    it('should return proper componentName', () => {
      const expected = 'PIIconName'
      expect(componentName).toBe(expected)
    })
    it('should return proper componentCode', () => {
      expect(componentCode).toMatchFileSnapshot('__snapshots__/getComponentInfo/componentCode.snap')
    })
  })

  describe('generateComponent', () => {
    let mockedWriteFileSync: SpyInstance
    let mockedReadFileSync: SpyInstance

    const componentName = 'PIMyFile'
    const fileName = 'my-file.svg'
    const filePath = `my-folder/${fileName}`
    const outputPath = 'output-folder'

    beforeEach(() => {
      mockedWriteFileSync = vi.spyOn(fs, 'writeFileSync')
      mockedReadFileSync = vi.spyOn(fs, 'readFileSync')
    })
    describe('when viewBox and pathData are given', () => {
      beforeEach(() => {
        mockedReadFileSync.mockReturnValueOnce(MOCKED_SVG_CODE)

        generateComponent(componentName, filePath, outputPath)
      })
      it('should call writeFileSync()', () => {
        expect(mockedWriteFileSync).toHaveBeenCalledOnce()
      })
    })
    describe('when viewBox and pathData are empty', () => {
      beforeEach(() => {
        mockedReadFileSync.mockReturnValueOnce('')

        generateComponent(componentName, filePath, outputPath)
      })
      it('should NOT call writeFileSync()', () => {
        expect(mockedWriteFileSync).not.toHaveBeenCalled()
      })
    })
    describe('when folder does not exist', () => {
      let mockedMdirSync: SpyInstance
      beforeEach(() => {
        mockedReadFileSync.mockReturnValueOnce(MOCKED_SVG_CODE)

        vi.spyOn(fs, 'existsSync').mockReturnValue(false)
        mockedMdirSync = vi.spyOn(fs, 'mkdirSync')
      })
      it('should call mkdirSync() with proper arguments', () => {
        generateComponent(componentName, filePath, outputPath)
        expect(mockedMdirSync).toHaveBeenCalledWith(outputPath)
      })
    })
  })

  describe('getComponentConstantsContent', () => {
    it('should return proper containts', () => {
      const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
      const contents = getComponentConstantsContent(icons)

      expect(contents).toMatchFileSnapshot('__snapshots__/getComponentConstantsContent/content.snap')
    })
  })

  describe('writeComponentConstants', () => {
    let mockedWriteFileSync: SpyInstance
    beforeEach(() => {
      mockedWriteFileSync = vi.spyOn(fs, 'writeFileSync')
    })

    it('should call writeFileSync', () => {
      const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
      const outputFolder = 'a/b'
      const outputPath = [outputFolder, 'constants.ts'].join('/')

      writeComponentConstants(outputFolder, icons)
      expect(mockedWriteFileSync).toHaveBeenCalledWith(outputPath, expect.anything())
    })
  })

  describe('getComponentIndexContent', () => {
    it('should return proper containts', () => {
      const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
      const contents = getComponentIndexContent(icons)

      expect(contents).toMatchFileSnapshot('__snapshots__/getComponentIndexContent/content.snap')
    })
  })

  describe('writeComponentIndex', () => {
    let mockedWriteFileSync: SpyInstance
    beforeEach(() => {
      mockedWriteFileSync = vi.spyOn(fs, 'writeFileSync')
    })

    it('should call writeFileSync', () => {
      const icons = [MOCKED_ICON_1, MOCKED_ICON_2]
      const outputFolder = 'a/b'
      const outputPath = [outputFolder, 'index.ts'].join('/')

      writeComponentIndex(outputFolder, icons)
      expect(mockedWriteFileSync).toHaveBeenCalledWith(outputPath, expect.anything())
    })
  })
})

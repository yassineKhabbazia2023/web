import * as fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import { MOCKED_OPTIMIZED_SVG_CODE, MOCKED_SVGO_CONFIG } from '../iconGen/mocks'

import { getFolderImages, getFolder, getFolders, writeCompressedImage } from './lib'

const imageNames = ['a', 'b']

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  readdirSync: vi.fn().mockReturnValue(['a.svg', 'b.svg', 'c.png', 'd']),
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

vi.mock('svgo', () => ({
  loadConfig: vi.fn().mockReturnValue(MOCKED_SVGO_CONFIG),
  optimize: vi.fn().mockResolvedValue({ data: MOCKED_OPTIMIZED_SVG_CODE })
}))

const folderPath = 'folder-path'
const originPath = 'origin-path'
const svgoConfig = {}

describe('imageGen/lib', () => {
  describe('getFolderImages', () => {
    it('should return folderImages', () => {
      const expected = imageNames
      const folderImages = getFolderImages(folderPath)
      expect(folderImages).toStrictEqual(expected)
    })
  })

  describe('getFolder', () => {
    it('should return proper folder when folder is directory', () => {
      const name = 'folder'
      const folder = getFolder(originPath, name)
      const expected = {
        name,
        images: imageNames
      }
      expect(folder).toMatchObject(expected)
    })
    it('should return proper folder when folder is not directory', () => {
      const name = 'file.ext'
      const folder = getFolder(originPath, name)
      const expected = {
        name,
        images: []
      }
      expect(folder).toMatchObject(expected)
    })
  })

  describe('getFolders', () => {
    it('should return folders', () => {
      const folders = getFolders(originPath)
      const expected = [{
        images: ['a', 'b'],
        name: 'd'
      }]
      expect(folders).toMatchObject(expected)
    })
  })

  describe('writeCompressedImage', () => {
    it('should call writeFileSync with proper arguments', async () => {
      const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync')
      const originFolderPath = 'origin-folder-path'
      const targetFolderPath = 'target-folder-path'
      const imageName = 'image-name'
      await writeCompressedImage(
        svgoConfig,
        originFolderPath,
        targetFolderPath,
        imageName
      )
      const targetFilePath = `${targetFolderPath}/${imageName}.svg`
      const optimizedSvg = MOCKED_OPTIMIZED_SVG_CODE
      expect(writeFileSyncSpy).toHaveBeenNthCalledWith(1, targetFilePath, optimizedSvg, 'utf-8')
    })
  })
})

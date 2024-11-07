import { describe, expect, it, vi } from 'vitest'
import * as fs from 'fs'
import { type Folder } from './lib'
import * as imageGenLib from './lib'
import { writeCompressedImages, compressImages } from './utils'
import { type Config } from 'svgo'

const mockedFolders: Folder[] = [{
  name: 'folder-1',
  images: ['a', 'b', 'c'],
}] as const

const mockedSvgoConfig: Config = { path: 'foo' }

vi.mock('fs', () => ({
  mkdirSync: vi.fn(),
  existsSync: vi.fn().mockReturnValue(true),
}))

vi.mock('./lib', () => ({
  getFolders: vi.fn().mockImplementation(() => mockedFolders),
  writeCompressedImage: vi.fn(),
}))

vi.mock('../common/utils', () => ({
  getSvgoConfig: vi.fn().mockImplementation(() => mockedSvgoConfig),
}))

vi.mock('path', () => ({
  default: {
    join: (...args: string[]) => args.join('/'),
  },
}))

const originPath = 'origin-path'
const targetPath = 'target-path'
const svgoConfig = mockedSvgoConfig

describe('imageGen/utils', () => {
  describe('writeCompressedImages', () => {
    it('should call writeCompressedImage with proper params', async () => {
      const writeCompressedImageSpy = vi.spyOn(imageGenLib, 'writeCompressedImage')
      await writeCompressedImages(
        svgoConfig,
        mockedFolders,
        originPath,
        targetPath,
      )
      const folderName = mockedFolders[0].name
      const originFolderPath = `${originPath}/${folderName}`
      const targetFolderPath = `${targetPath}/${folderName}`
      const images = mockedFolders[0].images
      const image = images[0]
      expect(writeCompressedImageSpy).toHaveBeenCalledTimes(images.length)
      expect(writeCompressedImageSpy)
        .toHaveBeenNthCalledWith(1, svgoConfig, originFolderPath, targetFolderPath, image)
    })

    it('should call mkdirSync when folder does not exist', async () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false)
      const mkdirSyncSpy = vi.spyOn(fs, 'mkdirSync')
      await writeCompressedImages(
        svgoConfig,
        mockedFolders,
        originPath,
        targetPath,
      )
      const folderName = mockedFolders[0].name
      const targetFolderPath = `${targetPath}/${folderName}`
      expect(mkdirSyncSpy).toHaveBeenCalledOnce()
      expect(mkdirSyncSpy).toHaveBeenNthCalledWith(1, targetFolderPath)
    })
  })
  describe('compressImages', () => {
    it('should return folders', async () => {
      const folders = await compressImages(originPath, targetPath)
      expect(folders).toMatchObject(mockedFolders)
    })
  })
})

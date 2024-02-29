import { mkdirSync, existsSync } from 'fs'
import path from 'path'
import { type Config } from 'svgo'
import { getFolders, writeCompressedImage, type Folder } from './lib'
import { getSvgoConfig } from '../common/utils'

export async function writeCompressedImages(
  svgoConfig: Config,
  folders: Folder[],
  originPath: string,
  targetPath: string
) {
  const promises = folders.flatMap(folder => {
    const originFolderPath = path.join(originPath, folder.name)
    const targetFolderPath = path.join(targetPath, folder.name)

    if (!existsSync(targetFolderPath)) {
      mkdirSync(targetFolderPath)
    }
    const promises = folder.images.map((image) =>
      writeCompressedImage(svgoConfig, originFolderPath, targetFolderPath, image)
    )

    return promises
  })
  await Promise.all(promises)
}

export async function compressImages(
  originPath: string,
  targetPath: string
) {
  const svgoConfig = getSvgoConfig(false)
  const folders = getFolders(originPath)
  await writeCompressedImages(svgoConfig, folders, originPath, targetPath)

  return folders
}

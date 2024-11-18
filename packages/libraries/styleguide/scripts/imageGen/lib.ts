import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { type Config, optimize } from 'svgo'

export interface Image {
  name: string
  fileName: string
  extension: string
}

export interface Folder {
  name: string
  images: Image[]
}

export function getFolderImages(folderPath: string, extensions: string[]): Image[] {
  const list = readdirSync(folderPath)

  return list
    .map((fileName) => {
      const lastIndex = fileName.lastIndexOf('.')
      const extension = lastIndex >= 0
        ? fileName.substring(lastIndex + 1)
        : ''
      const name = fileName.substring(0, lastIndex)

      return {
        extension,
        name,
        fileName,
      }
    })
    .filter(({ extension }) => {
      return extensions.includes(extension)
    })
}

export function getFolder(originPath: string, name: string, extensions: string[]): Folder {
  const folderPath = path.join(originPath, name)
  const fileStat = statSync(folderPath)
  const images = fileStat.isDirectory() ? getFolderImages(folderPath, extensions) : []

  return {
    name,
    images,
  }
}

export function getFolders(originPath: string, extensions: string[]): Folder[] {
  const list = readdirSync(originPath)

  const images = list
    .map<Folder>(folder => getFolder(originPath, folder, extensions))
    .filter(({ images }) => images.length > 0)

  return images
}

export async function writeCompressedImage(
  svgoConfig: Config,
  originFolderPath: string,
  targetFolderPath: string,
  image: Image,
) {
  const { extension, fileName: imageFileName } = image

  const originFilePath = path.join(originFolderPath, imageFileName)
  const targetFilePath = path.join(targetFolderPath, imageFileName)

  if (extension !== 'svg') {
    const originalImage = readFileSync(originFilePath)
    writeFileSync(targetFilePath, originalImage)

    return
  }

  const originalSvg = readFileSync(originFilePath, 'utf-8')
  const optimized = await optimize(originalSvg, svgoConfig)
  const { data: optimizedSvg } = optimized

  writeFileSync(targetFilePath, optimizedSvg, 'utf-8')
}

export function getImageList(folders: Folder[]) {
  const images = {}

  folders
    .forEach(({ name: folderName, images: folderImages }) => {
      folderImages
        .forEach(({ name, fileName }) => {
          if (images[name]) {
            throw new Error(`Unmanaged case '${name}' already exists`)
          }
          const filePath = `${folderName}/${fileName}`
          images[name] = filePath

          return images
        })
    })

  return images
}

export function writeImageListFile(imageListPath: string, images: Record<string, string>) {
  const content = JSON.stringify(images, null, 2)

  writeFileSync(imageListPath, content, 'utf8')
}

export function writeImageNameFile(imageNamePath: string, images: Record<string, string>) {
  const imageNames = Object
    .keys(images)
    .map((imageName) => `'${imageName}'`)
    .join(' |\n')
  const content = `export type ImageName =\n${imageNames}\n`

  writeFileSync(imageNamePath , content, 'utf8')
}

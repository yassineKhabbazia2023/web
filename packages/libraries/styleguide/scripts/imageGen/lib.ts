import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { type Config, optimize } from 'svgo'

export interface Folder {
  name: string
  images: string[]
}

export function getFolderImages(folderPath: string): string[] {
  const list = readdirSync(folderPath)

  return list
    .filter((fileName) => /\.svg$/.test(fileName))
    .map<string>((fileName) => fileName.replace('.svg', ''))
}

export function getFolder(originPath: string, name: string): Folder {
  const folderPath = path.join(originPath, name)
  const fileStat = statSync(folderPath)
  const images = fileStat.isDirectory() ? getFolderImages(folderPath) : []

  return {
    name,
    images,
  }
}

export function getFolders(originPath: string): Folder[] {
  const list = readdirSync(originPath)

  const images = list
    .map<Folder>(folder => getFolder(originPath, folder))
    .filter(({ images }) => images.length > 0)

  return images
}

export async function writeCompressedImage(
  svgoConfig: Config,
  originFolderPath: string,
  targetFolderPath: string,
  imageName: string,
) {
  const imageFileName = `${imageName}.svg`
  const originFilePath = path.join(originFolderPath, imageFileName)
  const targetFilePath = path.join(targetFolderPath, imageFileName)

  const originalSvg = readFileSync(originFilePath, 'utf-8')
  const optimized = await optimize(originalSvg, svgoConfig)
  const { data: optimizedSvg } = optimized

  writeFileSync(targetFilePath, optimizedSvg, 'utf-8')
}

export function writeImageListFile(imageListPath: string, folders: Folder[]) {
  const content = folders
    .map((folder) => {
      const images = folder.images
        .map((image) => `      '${image}',`)
        .join('\n')

      return `  {\n    name: '${folder.name}',\n    images: [\n${images}\n    ],\n  },`
    })
    .join('\n')

  writeFileSync(imageListPath, `export default [\n${content}\n]\n`, 'utf8')
}

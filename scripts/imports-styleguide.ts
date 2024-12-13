import path from 'path'
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { logger } from '@pulse/core'

const targetFolderMfe = './packages/libraries'

function getTargetPath(targetFolder: string, folderName: string, subfolder: string = '') {
  return path.join(targetFolder, folderName, subfolder)
}

function doWorkForApplets(libraryNames) {
  libraryNames.forEach((libraryName) => {
    cleanMfe(libraryName, targetFolderMfe)
  })
}

const EXTENSIONS = ['.vue', '.ts']

function cleanFolder(folderName: string, folderPath: string) {
  readdirSync(folderPath).forEach((fileName) => {
    cleanFiles(folderName, path.join(folderPath, fileName))
  })
}

export function getNewContent(filePath: string, content: string) {
  const dirName = path.dirname(filePath)
  const folders = dirName.split('\\')
  const srcIndex = folders.indexOf('src')
  if (srcIndex <= 1) {
    throw new Error('Unmanaged case')
  }
  const parentCount = folders.length - srcIndex
  const fragment = '@styleguide/'
  const blocks = content.split(fragment)

  if (blocks.length < 2) {
    return content
  }
  const newContent = blocks
    .map((content, index) => {
      return index < 1
        ? content
        : replaceImportInBlock(filePath, content, parentCount)
    })
    .join('')

  return newContent
}

export function replaceImportInBlock(
  filePath: string,
  content: string,
  parentCount: number,
) {
  const index = content.indexOf('\'')
  if (index < 0) {
    throw new Error('Unmanaged case')
  }
  const importFragment = content.slice(0, index)
  const rest = content.slice(index)
  const list = importFragment.split('/')
  const newPath = parentCount < 2
    ? ['.', ...list].join('/')
    : Array
      .from(Array(parentCount - 1).keys())
      .reduce((newPath, _) => {
        newPath.unshift('..')

        return newPath
      }, list)
      .join('/')

  const newContent = `${newPath}${rest}`

  return newContent
}

function cleanFile(filePath: string) {
  const extension = path.extname(filePath)
  if (!EXTENSIONS.includes(extension)) {
    return
  }
  const content = readFileSync(filePath, 'utf8')
  const containsImport = content.includes('from \'@styleguide')
  if (!containsImport) {
    return
  }

  const newContent = getNewContent(filePath, content)

  if (newContent === content) {
    return
  }

  writeFileSync(filePath, newContent)
}

function cleanFiles(libraryName: string, filePath: string) {
  const lstat = lstatSync(filePath)
  if (lstat.isDirectory()) {
    cleanFolder(libraryName, filePath)
    return
  }
  cleanFile(filePath)
}

function cleanMfe(libraryName: string, targetFolder: string) {
  const targetFolderPath = getTargetPath(targetFolder, libraryName, 'src')

  if (!existsSync(targetFolderPath)) {
    throw Error(`${targetFolderPath} does not exist`)
  }

  cleanFiles(libraryName, targetFolderPath)
}

const libraryNames = ['styleguide']

doWorkForApplets(libraryNames)
logger.warn('relative imports in Styleguide Done')

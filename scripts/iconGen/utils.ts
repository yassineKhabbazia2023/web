import {
  getIcons, generateComponent, clearFolder, writeComponentIndex, writeComponentConstants
} from './lib'
import type { Icon } from './types'

export function generateComponents(icons: Icon[], outputFolderPath: string) {
  const targetFilePaths = icons.reduce<string[]>((targetFilePaths, { componentName, filePath }) => {
    const targetFilePath = generateComponent(componentName, filePath, outputFolderPath)
    if (targetFilePath) {
      targetFilePaths.push(targetFilePath)
    }
    return targetFilePaths
  }, [] as string [])
  return targetFilePaths
}

export function generateIcons(iconsFolderPath: string, outputFolderPath: string) {
  const icons = getIcons(iconsFolderPath, '')
  const targetFilePaths = generateComponents(icons, outputFolderPath)
  clearFolder(outputFolderPath, targetFilePaths)
  writeComponentIndex(outputFolderPath, icons)
  writeComponentConstants(outputFolderPath, icons)
}

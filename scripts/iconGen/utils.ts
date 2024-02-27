import { clearFolder } from '../common/utils'
import { getIcons, generateComponent, writeComponentIndex, writeComponentConstants } from './lib'
import type { Icon } from './types'

export function generateComponents(icons: Icon[], outputFolderPath: string) {
  icons.forEach(({ componentName, filePath }) => {
    generateComponent(componentName, filePath, outputFolderPath)
  })
}

export function generateIcons(iconsFolderPath: string, outputFolderPath: string) {
  const icons = getIcons(iconsFolderPath, '')
  clearFolder(outputFolderPath)
  generateComponents(icons, outputFolderPath)
  writeComponentIndex(outputFolderPath, icons)
  writeComponentConstants(outputFolderPath, icons)
}

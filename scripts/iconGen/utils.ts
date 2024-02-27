import { type Config } from 'svgo'
import { clearFolder, getSvgoConfig } from '../common/utils'
import {
  getIcons, generateComponent, writeComponentIndex, writeComponentConstants
} from './lib'
import type { Icon } from './types'

export async function generateComponents(icons: Icon[], outputFolderPath: string, svgoConfig: Config) {
  const promises = icons.map(({ componentName, filePath }) =>
    generateComponent(componentName, filePath, outputFolderPath, svgoConfig))
  await Promise.all(promises)
}

export async function generateIcons(iconsFolderPath: string, outputFolderPath: string) {
  const icons = getIcons(iconsFolderPath, '')
  const svgoConfig = getSvgoConfig()
  clearFolder(outputFolderPath)
  await generateComponents(icons, outputFolderPath, svgoConfig)
  writeComponentIndex(outputFolderPath, icons)
  writeComponentConstants(outputFolderPath, icons)
}

import { type Config } from 'svgo'
import { clearFolder, getSvgoConfig } from '../common/utils'
import {
  getIcons,
  generateComponent,
  writeComponentIndex,
  writeComponentConstants,
  generateTypes,
} from './lib'
import type { Icon } from './types'

export async function generateComponents(
  icons: Icon[],
  outputFolderPath: string,
  svgoConfigMonochrome: Config,
  svgoConfigPolychrome: Config,
) {
  const promises = icons.map(({ componentName, filePath, isPolychrome }) => {
    const svgoConfig = isPolychrome ? svgoConfigPolychrome : svgoConfigMonochrome

    return generateComponent(componentName, filePath, outputFolderPath, svgoConfig)
  })

  await Promise.all(promises)
}

export async function generateIcons(
  iconsFolderPath: string,
  outputFolderPath: string,
  outputFileTypePath: string,
) {
  const icons = getIcons(iconsFolderPath, '')
  const svgoConfigMonochrome = getSvgoConfig(true, true)
  const svgoConfigPolychrome = getSvgoConfig(true, false)
  clearFolder(outputFolderPath)
  generateTypes(iconsFolderPath, outputFileTypePath)
  await generateComponents(icons, outputFolderPath, svgoConfigMonochrome, svgoConfigPolychrome)
  writeComponentIndex(outputFolderPath, icons)
  writeComponentConstants(outputFolderPath, icons)
}

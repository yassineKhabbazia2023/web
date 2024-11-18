import { type Config, optimize } from 'svgo'
import path from 'path'
import { writeFileSync, readdirSync, readFileSync, statSync, existsSync, mkdirSync } from 'fs'
import type { Icon } from './types'
import { logger } from '../../src/utils/logger'

export function capitalizeFirstLetter(text: string) {
  if (text.includes('-')) {
    const words = text.split('-')
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function toCamelCase(text: string): string {
  if (text.includes('-')) {
    const words = text.split('-')
    return words[0].toLowerCase() + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }

  return text.charAt(0).toLowerCase() + text.slice(1)
}

export function getPathIcons(fileName: string, folder: string, category: string) {
  const filePath = path.join(folder, fileName)
  const fileStat = statSync(filePath)
  if (fileStat.isDirectory()) {
    const subfolderIcons = getIcons(filePath, capitalizeFirstLetter(fileName))
    return subfolderIcons
  }
  const extension = path.extname(filePath)
  if (fileStat.isFile() && extension === '.svg') {
    const iconName = path.basename(fileName, '.svg')
    const componentName = `PI${capitalizeFirstLetter(iconName)}`
    const name = toCamelCase(iconName)

    const icon: Icon = {
      name,
      componentName,
      fileName,
      filePath,
      category,
    }
    return [icon]
  }
  return [] as Icon[]
}

export function getIcons(folder: string, category: string): Icon[] {
  const list = readdirSync(folder)

  const icons = list.flatMap((fileName) => getPathIcons(fileName, folder, category))

  return icons
}

export function getIconTypeContent(folder: string) {
  const icons = getIcons(folder, '')
  const enumEntries = icons.map(({ name }) => {
    return `'${name}'`
  })
  enumEntries.sort()

  const content = `export type AppIcons =\n${enumEntries.join(' |\n')}\n`

  return content
}

// Each source icon is parsed to create a type according to their camelCased name
export function generateTypes(folder: string, iconsComponentFolderPath: string) {
  const enumContent = getIconTypeContent(folder)

  const outputFile = path.resolve(iconsComponentFolderPath, '../app-icons.types.ts')
  writeFileSync(outputFile, enumContent)
  // eslint-disable-next-line no-console
  console.info(`Enum generated in ${outputFile}`)
}

export async function generateComponent(
  componentName: string,
  filePath: string,
  outputPath: string,
  svgoConfig: Config,
) {
  const originalSvg = readFileSync(filePath, 'utf-8')
  const optimized = await optimize(originalSvg, svgoConfig)
  const { data: optimizedSvg } = optimized

  const {
    viewBox, pathData, componentCode,
  } = getComponentInfo(filePath, originalSvg, optimizedSvg)
  if (viewBox && pathData) {
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath)
    }
    const filePath = path.join(outputPath, `${componentName}.vue`)
    writeFileSync(filePath, componentCode)
  } else {
    logger.error(`${filePath}.svg - Invalid SVG format`)
  }
}

export function getComponentInfo(iconPath: string, svgCode: string, optimizedSvg: string) {
  const iconName = path.basename(iconPath, '.svg')

  const viewBox = svgCode.match(/viewBox="(.*?)"/)
  const pathData = svgCode.match(/<path(.*?)\/>/)
  const optimizedPathData = optimizedSvg.match(/<path(.*?)\/>/)
  const content = optimizedPathData?.input ?? ''
  const componentName = `PI${capitalizeFirstLetter(iconName)}`
  const componentCode = `
<!-- eslint-disable vue/max-attributes-per-line max-len -->
<template>
  ${content}
</template>
<!-- eslint-disable vue/max-attributes-per-line max-len -->
<script lang="ts">
import type { DefineComponent } from 'vue'
export default ({
  name: '${componentName}',
}) as DefineComponent
</script>
`
  return {
    iconName,
    viewBox,
    pathData,
    componentName,
    componentCode,
  }
}

export function getComponentConstantsContent(icons: Icon[]) {
  const list = icons.map(({ name, fileName, componentName, category }) => (`  {
    name: '${name}',
    componentName: '${componentName}',
    fileName: '${fileName}',
    category: '${category}',
  }`))

  return `
import type { AppIcons } from '../app-icons.types'

export const pulseGeneratedIcons: {
  name: AppIcons
  componentName: string
  fileName: string
  category: string
}[] = [\n${list.join(',\n')},\n]\n`
}

export function writeComponentConstants(outputFolderPath: string, icons: Icon[]) {
  const outputPath = path.join(outputFolderPath, 'constants.ts')
  const content = getComponentConstantsContent(icons)
  writeFileSync(outputPath, content)
}

export function getComponentIndexContent(icons: Icon[]) {
  const content = icons
    .map(({ componentName }) => (
      `export { default as ${componentName} } from './${componentName}.vue'`
    ))
    .join('\n')

  return `${content}\n`
}

export function writeComponentIndex(outputFolderPath: string, icons: Icon[]) {
  const outputPath = path.join(outputFolderPath, 'index.ts')
  const content = getComponentIndexContent(icons)
  writeFileSync(outputPath, content)
}

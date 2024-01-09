import path from 'path'
import { writeFileSync, readdirSync, readFileSync, statSync, rmSync, existsSync, mkdirSync } from 'fs'
import type { Icon } from './types'

export function capitalizeFirstLetter(text: string) {
  if (text.includes('-')) {
    const words = text.split('-')
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  }

  return text.charAt(0).toUpperCase() + text.slice(1)
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

    const icon: Icon = {
      componentName,
      fileName,
      filePath,
      category
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

export function generateComponent(componentName: string, filePath: string, outputPath: string) {
  const svgCode = readFileSync(filePath, 'utf-8')
  const {
    viewBox, pathData, componentCode
  } = getComponentInfo(filePath, svgCode)
  if (viewBox && pathData) {
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath)
    }
    const filePath = path.join(outputPath, `${componentName}.vue`)
    writeFileSync(filePath, componentCode)
    return filePath
  } else {
    console.error(`${filePath}.svg - Invalid SVG format`)
    return ''
  }
}

export function getComponentInfo(iconPath: string, svgCode: string) {
  const iconName = path.basename(iconPath, '.svg')

  const viewBox = svgCode.match(/viewBox="(.*?)"/)
  const pathData = svgCode.match(/<path(.*?)\/>/)
  const content = pathData?.input ?? ''
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
  name: '${componentName}'
}) as DefineComponent
</script>
`
  return {
    iconName,
    viewBox,
    pathData,
    componentName,
    componentCode
  }
}

export function clearFolder(folderPath: string, keepFilePaths: string[]) {
  const fileNames = readdirSync(folderPath)
  fileNames.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName)
    if (!keepFilePaths.includes(filePath)) {
      rmSync(filePath, { recursive: true })
    }
  })
}

export function getComponentConstantsContent(icons: Icon[]) {
  const list = icons.map(({ componentName, category }) => (`  {
    name: '${componentName}',
    category: '${category}'
  }`))

  return `export const pulseGeneratedIcons = [\n${list.join(',\n')}\n]\n`
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

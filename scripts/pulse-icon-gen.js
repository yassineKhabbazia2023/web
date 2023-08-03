import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'
// eslint-disable-next-line
import { capitalizeFirstLetter } from '../src/utils/format.js'

function fetchIcons(folderPath) {
  return new Promise((resolve, reject) => {
    const icons = []

    function traverseDirectory(currentPath, directoryName) {
      fs.readdir(currentPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err)
          return
        }

        files.forEach((file) => {
          const filePath = path.join(currentPath, file.name)
          if (file.isFile() && path.extname(file.name) === '.svg') {
            icons.push({
              name: filePath,
              category: capitalizeFirstLetter(directoryName)
            })
          } else if (file.isDirectory()) {
            traverseDirectory(path.join(currentPath, file.name), file.name)
          }
        })

        if (currentPath !== folderPath) {
          resolve(icons)
        }
      })
    }

    traverseDirectory(folderPath)
  })
}

async function generateComponent({ name: iconPath }, outputPath) {
  const iconName = path.basename(iconPath, '.svg')
  const svgCode = await fs.promises.readFile(iconPath, 'utf-8')

  const viewBox = svgCode.match(/viewBox="(.*?)"/)
  const pathData = svgCode.match(/<path(.*?)\/>/)

  if (viewBox && pathData) {
    const componentName = `PI${capitalizeFirstLetter(iconName)}`

    const componentCode = `
<!-- eslint-disable vue/max-attributes-per-line max-len -->
<template>
 ${pathData.input}
</template>
<!-- eslint-disable vue/max-attributes-per-line max-len -->
<script lang="ts">
import type { DefineComponent } from 'vue'
export default ({
  name: '${componentName}'
}) as DefineComponent
</script>
`

    await fs.promises.writeFile(path.join(outputPath, `${componentName}.vue`), componentCode)
  } else {
    console.error(`${iconName}.svg - Invalid SVG format`)
  }
}

async function generateIcons(iconsFolderPath, outputFolderPath) {
  try {
    try {
      const cb = function(error) { if (error) console.log(error) }
      await fs.promises.rm(outputFolderPath, { recursive: true }, cb)
    } catch {
      console.log('no components folder to clean.')
    }
    childProcess.execSync(`mkdir "${outputFolderPath}"`, { stdio: [0, 1, 2] })
    const icons = await fetchIcons(iconsFolderPath)

    for (const iconPath of icons) {
      await generateComponent(iconPath, outputFolderPath)
    }

    await generateEntry(icons, outputFolderPath)

    console.log('PULSEEE! Icons successfully generated !')
  } catch (err) {
    console.error('An error occured:', err)
  }
}

async function generateEntry(icons, outputFolderPath) {
  let code = icons
    .map(({ name: iconPath }) => {
      const iconName = path.basename(iconPath, '.svg')
      const componentName = `PI${capitalizeFirstLetter(iconName)}`
      return `export { default as ${componentName} } from './${componentName}.vue'`
    })
    .join('\n')

  // Add blank line at the end for eslint
  code = code + `
`
  await fs.promises.writeFile(path.resolve(outputFolderPath, 'index.ts'), code, 'utf-8')

  const generatedArray = []
  icons.forEach((icon) => {
    const iconName = path.basename(icon.name, '.svg')
    const componentName = `PI${capitalizeFirstLetter(iconName)}`
    generatedArray.push(
      {
        ...icon,
        componentName
      })
  })

  const constantsFilePath = path.join(outputFolderPath, 'constants.ts')
  const constantsCode = `export const pulseGeneratedIcons = [
  ${generatedArray.map((item) =>
    `{
    name: '${item.componentName}',
    category: '${item.category}'
  }`).join(',\n  ')}
]
`
  await fs.promises.writeFile(constantsFilePath, constantsCode)

}

const [iconsFolderPath, outputFolderPath] = process.argv.slice(2)

generateIcons(iconsFolderPath, outputFolderPath)

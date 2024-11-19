import path from 'path'
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs'

const targetFolderMfe = './packages/applets'

function getTargetPath(targetFolder: string, folderName: string, subfolder: string = '') {
  return path.join(targetFolder, folderName, subfolder)
}

function doWorkForApplets(appletNames) {
  appletNames.forEach((folderName) => {
    cleanMfe(folderName, targetFolderMfe)
  })
}

const EXTENSIONS = ['.vue']

function cleanFolder(folderName: string, folderPath: string) {
  readdirSync(folderPath).forEach((fileName) => {
    cleanFiles(folderName, path.join(folderPath, fileName))
  })
}

function getIconName(componentName: string) {
  const iconName = componentName.slice(2)
  return `${iconName.charAt(0).toLowerCase()}${iconName.slice(1)}`
}

export function getNewContent(filePath: string, content: string) {
  if (!content.includes('<PIcon')) {
    return content
  }
  const componentNames: string[] = []
  const contentWithoutIcons = replaceIconsByPName(filePath, content, componentNames)
  const newContent = removeComponentNameFromImport(contentWithoutIcons, componentNames)

  return newContent
}

export function replaceIconsByPName(filePath, content: string, componentNames: string[]) {
  const startingTag = '<PIcon'
  const blocks = content.split(startingTag)

  return blocks
    .map((block, index) => {
      return index > 0
        ? replaceIconsInBlock(filePath, `${startingTag}${block}`, componentNames)
        : block
    })
    .join('')
}
export function removeComponentNameFromImport(content: string, componentNames: string[]) {
  const newContentWithoutComponents = componentNames
    .reduce((content, componentName) => {
      const regExp1 = new RegExp(`\r\n  ${componentName},`, 'g')
      const regExp2 = new RegExp(` ${componentName},`, 'g')
      const regExp3 = new RegExp(`${componentName},`, 'g')
      const regExp4 = new RegExp(`, ${componentName}`, 'g')
      const regExp5 = new RegExp(` ${componentName} `, 'g')

      return content
        .replace(regExp1, '')
        .replace(regExp2, '')
        .replace(regExp3, '')
        .replace(regExp4, '')
        .replace(regExp5, '')
    }, content)

  return newContentWithoutComponents
}

export function replaceIconsInBlock(filePath: string, content: string, componentNames: string[]) {
  return content
    .replace(/<PIcon([^>]*)>([\s\S]*)<\/PIcon>/gm, (_originalText, $1, $2) => {
      const match = $2.match(/<(\w+)(.*)\/>/)
      const componentName = match?.at(1)
      if (!componentName) {
        console.error({ content })
        throw new Error('componentName not found')
      }
      const needManualIntervention =
        componentName === 'component' ||
        $2.includes('v-if')
      if (needManualIntervention) {
        console.warn(`Need manual intervention in ${filePath}`)
      } else if (!componentNames.includes[componentName]) {
        componentNames.push(componentName)
      }
      const attributes = (match?.at(2) ?? '').trim()
      const formattedAttributes = attributes ? ` ${attributes}` : ''
      const pName = needManualIntervention
        ? '????'
        : getIconName(componentName)

      const newContent = `<PIcon${$1} pName="${pName}"${formattedAttributes} />`

      return newContent
    })
}

function cleanFile(filePath: string) {
  const extension = path.extname(filePath)
  if (!EXTENSIONS.includes(extension)) {
    return
  }
  const content = readFileSync(filePath, 'utf8')
  const containsImport = content.includes('import') || content.includes('export')
  if (!containsImport) {
    return
  }

  const newContent = getNewContent(filePath, content)

  if (newContent === content) {
    return
  }

  writeFileSync(filePath, newContent)
}

function cleanFiles(folderName: string, filePath: string) {
  const lstat = lstatSync(filePath)
  if (lstat.isDirectory()) {
    cleanFolder(folderName, filePath)
    return
  }
  cleanFile(filePath)
}

function cleanMfe(folderName: string, targetFolder: string) {
  const targetFolderPath = getTargetPath(targetFolder, folderName, 'src')

  if (!existsSync(targetFolderPath)) {
    throw Error(`${targetFolderPath} does not exist`)
  }

  cleanFiles(folderName, targetFolderPath)
}

const appletNames = ['login', 'launcher', 'ged', 'entities', 'mandate']
// const appletNames = ['entities']

doWorkForApplets(appletNames)
console.warn('cleanApplets Done')

import path from 'path'
import { existsSync, rmSync, cpSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs'

// can give parent folder as parameter
// eg. `npm run mfe -- ../some/other/folder/`
const folder = process.argv.at(2) ?? '../'

const targetFolderMfe = './packages/applets'
const prefix = 'KPMG.Pulse.Front.'
const domain = '@pulse'

function getMfePath(mfe: string, subfolder: string = '') {
  const suffix = `/${subfolder}`
  return path.join(folder, `${prefix}${mfe}${suffix}`)
}

function getTargetPath(targetFolder: string = '', mfe: string, subfolder: string = '') {
  return path.join(targetFolder, mfe, subfolder)
}

function doWorkForMfe() {
  const mfeList = ['login', 'launcher', 'ged', 'entities', 'mandate']
  mfeList.forEach((mfe) => {
    copyMfe(mfe, targetFolderMfe)
  })
}

const EXTENSIONS = ['.ts', '.vue']

function cleanFolder(mfe: string, folderPath: string) {
  readdirSync(folderPath).forEach((fileName) => {
    cleanFiles(mfe, path.join(folderPath, fileName))
  })
}

function cleanFile(mfe: string, filePath: string) {
  const newFromMfe = `from '@${mfe}/`
  const newMfe = `'@${mfe}/`
  const newFromMfe2 = `from\n  '@${mfe}/`
  const newUseMfe = `@use '@${mfe}/`
  const newImport = `import('@${mfe}/`
  const newImportBackTick = `import(\`@${mfe}/`
  const newFromCommon = `from '${domain}/common`
  const newCommon = `'${domain}/common'`
  const newVitest = `import { createI18n } from 'vue-i18n'
import { config } from '@vue/test-utils'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})

config.global.plugins = [i18n]

setAssetsBaseUrl('https://www.example.pulse')`

  const extension = path.extname(filePath)
  if (!EXTENSIONS.includes(extension)) {
    return
  }
  const content = readFileSync(filePath, 'utf8')
  const containsImport = content.includes('import') || content.includes('export')
  if (!containsImport) {
    return
  }

  const newContent = content
    .replace(/from '@\//g, newFromMfe)
    .replace(/'@\/modules\//g, `'@${mfe}/modules/`)
    .replace(/from\n {2}'@\//g, newFromMfe2)
    .replace(/from '@kpmg\/styleguide\/dist\/types.*'/g, 'from \'@pulse/styleguide\'')
    .replace(/@use '@\//g, newUseMfe)
    .replace(/import\('@\//g, newImport)
    .replace(/import\(`@\//g, newImportBackTick)
    .replace(/from '@kpmg\/common/g, newFromCommon)
    .replace(/'@kpmg\/common'/g, newCommon)
    .replace(/'@\//g, newMfe)
    .replace(/routes.value.push\(/g, 'routes.push(')
    .replace(/commonRoutes.value/g, 'commonRoutes')
    .replace(/SpyInstance/g, 'MockInstance') // migration to vitest 2.x
    .replace(/setAssetsBaseUrl\(\'https:\/\/www.example.pulse\'\)/g, newVitest) // migration from a common config

  return newContent
}

function cleanFiles(mfe: string, filePath: string) {
  const lstat = lstatSync(filePath)
  if (lstat.isDirectory()) {
    cleanFolder(mfe, filePath)
    return
  }
  const file = cleanFile(mfe, filePath)
  if (file) {
    writeFileSync(filePath, file)
  }
}

function copyMfe(mfe: string, targetFolder: string) {
  const BLACK_LIST = ['.husky', '.vscode', '.git', 'main.ts']
  const WHITE_LIST = ['vitest.setup.ts'] as string[]
  const FOLDERS = ['__mocks__', 'tests']

  const originFolderPath = getMfePath(mfe, 'src')
  const targetFolderPath = getTargetPath(targetFolder, mfe, 'src')

  if (!existsSync(originFolderPath)) {
    throw Error(`${originFolderPath} does not exist`)
  }

  console.warn(`copying ${originFolderPath} -> ${targetFolderPath}`)
  cpSync(originFolderPath, targetFolderPath, {
    recursive: true,
    filter: (src: string) => {
      const srcPath = src.split(path.sep)
      const srcLastPath = srcPath.slice(-2).join('/')
      // do not copy router files (we already fixed them)
      if (srcLastPath === 'router/index.ts') {
        return false
      }
      const baseName = path.basename(src)
      const isBlackListed = BLACK_LIST.includes(baseName)
      return !isBlackListed
    },
  })

  // cleanup dist
  const distFolder = getTargetPath(targetFolder, mfe, 'dist')
  if (existsSync(distFolder)) {
    rmSync(distFolder, { recursive: true, force: true })
  }

  FOLDERS.forEach((folderName) => {
    const origin = path.join(getMfePath(mfe), folderName)
    const destination = path.join(getTargetPath(targetFolder, mfe), folderName)
    if (existsSync(origin)) {
      cpSync(origin, destination, { recursive: true })
      cleanFiles(mfe, destination)
    }
  })

  WHITE_LIST.forEach((fileName) => {
    const origin = path.join(getMfePath(mfe), fileName)
    const destination = path.join(getTargetPath(targetFolder, mfe), fileName)
    if (existsSync(destination)) {
      rmSync(destination)
    }
    const file = cleanFile(mfe, origin)
    if (file) {
      writeFileSync(destination, file)
    }
  })
  cleanFiles(mfe, targetFolderPath)
}

doWorkForMfe()
console.warn('Applets Migration Done')

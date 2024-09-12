import path from 'path'
import { existsSync, rmSync, cpSync, lstatSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from 'fs'

// can give parent folder as parameter
// eg. `npm run mfe -- ../some/other/folder/`
const folder = process.argv.at(2) ?? '../'

const targetFolderMfe = './packages/'
const targetFolderApp = 'app'
const prefix = 'KPMG.Pulse.Front.'
const domain = '@pulse'
const appName = 'app'

function getMfePath(mfe: string, subfolder: string = '') {
  const suffix = `/${subfolder}`
  return path.join(folder, `${prefix}${mfe}${suffix}`)
}

function getTargetPath(targetFolder: string = '', mfe: string, subfolder: string = '') {
  return path.join(targetFolder, mfe, subfolder)
}

function doWorkForMfe() {
  const mfeList = ['router']
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
  const newFromMfe = `from '@${appName}/`
  const newMfe = `'@${appName}/`
  const newFromMfe2 = `from\n  '@${appName}/`
  const newUseMfe = `@use '@${appName}/`
  const newImport = `import('@${appName}/`
  const newImportBackTick = `import(\`@${appName}/`
  const newFromCommon = `from '${domain}/Common`
  const newCommon = `'${domain}/Common'`
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
    .replace(/from '@kpmg\/styleguide\/dist\/types.*'/g, 'from \'@kpmg/styleguide\'')
    .replace(/@use '@\//g, newUseMfe)
    .replace(/import\('@\//g, newImport)
    .replace(/import\(`@\//g, newImportBackTick)
    .replace(/from '@kpmg\/common/g, newFromCommon)
    .replace(/'@kpmg\/common'/g, newCommon)
    .replace(/'@\//g, newMfe)
    .replace(/routes.value.push\(/g, 'routes.push(')
    .replace(/commonRoutes.value/g, 'commonRoutes')
    .replace(/SpyInstance/g, 'MockInstance') // migration to vitest 2.x

  if (newContent === content) {
    return
  }

  writeFileSync(filePath, newContent)
}

function cleanFiles(mfe: string, filePath: string) {
  const lstat = lstatSync(filePath)
  if (lstat.isDirectory()) {
    cleanFolder(mfe, filePath)
    return
  }
  cleanFile(mfe, filePath)
}

function copyMfe(mfe: string, targetFolder: string) {
  const BLACK_LIST = ['.husky', '.vscode', '.git', 'main.ts', 'App.vue']
  const WHITE_LIST = [] as string[]

  const originFolderPath = getMfePath(mfe, 'src')
  const targetFolderPath = getTargetPath(targetFolder, targetFolderApp, 'src')

  if (!existsSync(originFolderPath)) {
    throw Error(`${originFolderPath} does not exist`)
  }
  // if (existsSync(targetFolderPath)) {
  //   rmSync(targetFolderPath, { recursive: true, force: true })
  // }
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

  WHITE_LIST.forEach((fileName) => {
    const origin = path.join(getMfePath(mfe), fileName)
    const destination = path.join(getTargetPath(targetFolder, mfe), fileName)
    if (existsSync(destination)) {
      rmSync(destination)
    }
    copyFileSync(origin, destination)
  })
  cleanFiles(mfe, targetFolderPath)
}

doWorkForMfe()
console.warn('Apps Migration Done')
console.warn('Don\'t forget to revert the changes if any')

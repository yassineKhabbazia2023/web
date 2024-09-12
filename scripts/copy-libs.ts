import path from 'path'
import {
  existsSync,
  rmSync,
  cpSync,
  lstatSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  unlinkSync,
  copyFileSync,
} from 'fs'

// can give parent folder as parameter
// eg. `npm run mfe -- ../some/other/folder/`
const folder = process.argv.at(2) ?? '../'

const targetFolderLibs = './packages/libraries'
const prefix = 'KPMG.Pulse.Front.'

function getMfePath(mfe: string, subfolder: string = '') {
  const suffix = `/${subfolder}`
  return path.join(folder, `${prefix}${mfe}${suffix}`)
}

function getTargetPath(targetFolder: string = '', mfe: string, subfolder: string = '') {
  return path.join(targetFolder, mfe, subfolder)
}

function doWorkForLibs() {
  const mfeList = ['common']
  mfeList.forEach((mfe) => {
    copyMfe(mfe, targetFolderLibs)
  })
}

const EXTENSIONS = ['.ts', '.vue']

function cleanFolder(mfe: string, folderPath: string) {
  readdirSync(folderPath).forEach((fileName) => {
    cleanFiles(mfe, path.join(folderPath, fileName))
  })
}

function cleanFile(mfe: string, filePath: string) {
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
    .replace(/'..\/'/g, '\'../main\'')
    // very specific replace to avoid checkout of main.ts
    .replace(/import { shallowRef, ref, reactive } from 'vue'/g, 'import { shallowRef, reactive } from \'vue\'')
    .replace(/SpyInstance/g, 'MockInstance') // migration to vitest 2.x

  if (newContent === content) {
    return
  }
  if (filePath === 'src\\domains\\Common\\main.ts') {
    const targetFilePath = 'src\\domains\\Common\\index.ts'
    writeFileSync(targetFilePath, newContent)
    unlinkSync(filePath)

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
  const BLACK_LIST = [
    '.husky',
    '.vscode',
    '.git',
    'main.ts',
  ]
  const WHITE_LIST = [] as string[]
  const FOLDERS = ['__mocks__']

  const originFolderPath = getMfePath(mfe, 'src')
  const targetFolderPath = getTargetPath(targetFolder, mfe, 'src')

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
    if (existsSync(destination)) {
      rmSync(destination, { recursive: true, force: true })
    }
    cpSync(origin, destination, { recursive: true })
  })

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

doWorkForLibs()
console.warn('Libs Migration Done')

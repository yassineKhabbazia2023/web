import path from 'path'
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs'

const appParentFolder = './packages'
const appletParentFolder = './packages/applets'

const [option] = process.argv.slice(2)

const MOCK_LOGGER = `const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))
`

const MOCK_LOGGER_2 = `const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', async () => {
  const actual = await vi.importActual('@pulse/core')

  return {
    ...actual,
    logger: {
      debug: loggerDebugSpy,
      warn: loggerWarnSpy,
      error: loggerErrorSpy,
    },
  }
})
`

function getTargetPath(targetFolder: string, folderName: string, subfolder: string = '') {
  return path.join(targetFolder, folderName, subfolder)
}

function doWork(folderNames, parentFolderName, isSpecFiles: boolean) {
  folderNames.forEach((folderName) => {
    cleanApplet(folderName, parentFolderName, isSpecFiles)
  })
}

const EXTENSIONS = ['.vue', '.ts']

function cleanFolder(folderName: string, folderPath: string, isSpecFiles: boolean) {
  readdirSync(folderPath).forEach((fileName) => {
    cleanFiles(folderName, path.join(folderPath, fileName), isSpecFiles)
  })
}

function getIconName(componentName: string) {
  const iconName = componentName.slice(2)
  return `${iconName.charAt(0).toLowerCase()}${iconName.slice(1)}`
}

export function getNewContent(filePath: string, content: string, isSpec: boolean) {
  if (!content.includes('console')) {
    return content
  }
  const newContent = isSpec
    ? mockLogger(content, filePath)
    : addImport(content)

  return replaceConsoleByLogger(newContent)
}

export function replaceConsoleByLogger(content: string) {
  return content.replace(/console\./g, 'logger.')
}
export function addImport(content: string) {
  const alreadyImported = content.indexOf('from \'@pulse/core') > 0

  return alreadyImported
    ? content.replace(/import \{([\w, ]+)\} from '@pulse\/core'/, 'import {$1, logger } from \'@pulse/core\'')
    : content.replace(/import/, 'import { logger } from \'@pulse/core\'\nimport')
}
export function replaceConsoleSpy(content: string, filePath: string) {
  const spyConsoleFallback = content.indexOf('spyConsole = vi.spyOn(console, \'error\')') > 0
    ? 'loggerErrorSpy'
    : 'loggerWarnSpy'
  const consoleSpyFallback = content.indexOf('consoleSpy = vi.spyOn(console, \'error\')') > 0
    ? 'loggerErrorSpy'
    : 'loggerWarnSpy'
  const newContent = content
    .replace(/const consoleErrorSpy: MockInstance = vi\.spyOn\(console, 'error'\)/g, '')
    .replace(/let spyConsole: MockInstance\n/g, '')
    .replace(/let console(\w+)Spy: MockInstance\n/g, '')
    .replace(/const (\w+) = vi\.spyOn\(console, '(\w+)'\)/g, '')
    .replace(/(\w+) = vi\.spyOn\(console, '(\w+)'\)/g, '')
    .replace(/spyConsole/g, spyConsoleFallback)
    .replace(/consoleSpy/g, consoleSpyFallback)
    .replace(/consoleWarnSpy/g, 'loggerWarnSpy')
    .replace(/consoleErrorSpy/g, 'loggerErrorSpy')
    .replace(/logErrorSpy/g, 'loggerErrorSpy')

  return newContent
}

export function mockLogger(content: string, filePath: string) {
  const newContent = replaceConsoleSpy(content, filePath)
  const useMockLogger2 = filePath.indexOf('OccurrenceDrawer.spec') > 0
  const mockLogger = useMockLogger2
    ? MOCK_LOGGER_2
    : MOCK_LOGGER

  return newContent.indexOf('vi.mock') > 0
    ? newContent.replace(/vi.mock/, `${ mockLogger }\nvi.mock`)
    : newContent.replace(/describe\(/, `${ mockLogger }\ndescribe(`)
}

function cleanFile(filePath: string, isSpecFiles: boolean) {
  const extension = path.extname(filePath)
  const isSpec = filePath.indexOf('.spec.ts') > 0
  const isOk = EXTENSIONS.includes(extension) && isSpec === isSpecFiles
  if (!isOk) {
    return
  }
  const content = readFileSync(filePath, 'utf8')
  const newContent = getNewContent(filePath, content, isSpec)

  if (newContent === content) {
    return
  }

  writeFileSync(filePath, newContent)
}

function cleanFiles(folderName: string, filePath: string, isSpecFiles: boolean) {
  const lstat = lstatSync(filePath)
  if (lstat.isDirectory()) {
    cleanFolder(folderName, filePath, isSpecFiles)
    return
  }
  cleanFile(filePath, isSpecFiles)
}

function cleanApplet(folderName: string, targetFolder: string, isSpecFiles: boolean) {
  const targetFolderPath = getTargetPath(targetFolder, folderName, 'src')

  if (!existsSync(targetFolderPath)) {
    throw Error(`${targetFolderPath} does not exist`)
  }

  cleanFiles(folderName, targetFolderPath, isSpecFiles)
}

const appletNames = ['login', 'launcher', 'ged', 'entities', 'mandate']
// const appletNames = ['mandate']
const appNames = ['app']

const isSpecFiles = option === 'specFiles'
doWork(appletNames, appletParentFolder, isSpecFiles)
console.warn('cleanApp Done')

doWork(appNames, appParentFolder, isSpecFiles)
console.warn('cleanApplets Done')

import { generateIcons } from './iconGen/utils'
import { logger } from '../src/utils/logger'

const [iconsFolderPath, outputFolderPath] = process.argv.slice(2)

generateIcons(iconsFolderPath, outputFolderPath)
logger.info('PULSEEE! Icons successfully generated !')

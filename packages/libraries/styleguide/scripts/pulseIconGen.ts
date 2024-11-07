import { generateIcons } from './iconGen/utils'
import { logger } from '../src/utils/logger'

const [iconsFolderPath, outputFolderPath] = process.argv.slice(2)

async function run() {
  await generateIcons(iconsFolderPath, outputFolderPath)
  logger.info('PULSEEE! Icons successfully generated !')
}

run()

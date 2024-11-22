import { generateIcons } from './iconGen/utils'
import { logger } from '../src/utils/logger'

const [iconsFolderPath, outputFolderPath, outputFileTypePath] = process.argv.slice(2)

async function run() {
  await generateIcons(iconsFolderPath, outputFolderPath, outputFileTypePath)
  logger.info('PULSEEE! Icons successfully generated !')
}

run()

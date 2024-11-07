import { compressImages } from './imageGen/utils'
import { writeImageListFile } from './imageGen/lib'
import { clearFolder } from './common/utils'
import { logger } from '../src/utils/logger'

const [originFolder, targetFolder, imageListPath] = process.argv.slice(2)

async function run() {
  clearFolder(targetFolder)
  const folders = await compressImages(originFolder, targetFolder)
  writeImageListFile(imageListPath, folders)
  logger.info('Images successfully compressed')
}

run()

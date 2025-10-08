import { compressImages } from './imageGen/utils'
import { getImageList, writeImageListFile, writeImageNameFile } from './imageGen/lib'
import { clearFolder } from './common/utils'
import { logger } from '@pulse/toolbox'

const [originFolder, targetFolder, imageListPath, imageNamePath] = process.argv.slice(2)

async function run() {
  clearFolder(targetFolder)
  const folders = await compressImages(originFolder, targetFolder)
  const images = getImageList(folders)
  writeImageListFile(imageListPath, images)
  writeImageNameFile(imageNamePath, images)
  logger.info('Image files successfully generated')
}

run()

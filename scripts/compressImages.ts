import fs from 'fs'
import { compressImages } from './imageGen/utils'
import { clearFolder } from './common/utils'
import { logger } from '../src/utils/logger'

const [originFolder, targetFolder] = process.argv.slice(2)

async function run() {
  clearFolder(targetFolder)
  const folders = await compressImages(originFolder, targetFolder)
  logger.info('Images successfully compressed')

  // @TOTO refact this (see next PR)
  const content = folders.map((folder) => {
    const fileNames = folder.images.map((imageName) => `${imageName}.svg`)

    return {
      [folder.name]: fileNames
    }
  })
  fs.writeFileSync(
    targetFolder + '/imagesList.json',
    JSON.stringify(content, null, 2) + '\n',
    'utf8'
  )
}

run()

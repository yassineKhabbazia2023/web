// This script will allow to have a list of all images in histoire

import * as fs from 'fs'
import * as path from 'path'

const IMAGES_PATH = process.argv.at(-1)

const getSubFolders = (directory = IMAGES_PATH) =>
  fs
    .readdirSync(directory)
    .filter(folder => fs.statSync(path.join(directory, folder)).isDirectory())

const getSubFoldersWithFiles = (subFolders = getSubFolders()) =>
  subFolders
    .map(folder => ({ [folder]: fs.readdirSync(IMAGES_PATH + '/' + folder) }))

const writeJSONFileImagesList = (content = getSubFoldersWithFiles()) =>
  fs.writeFileSync(
    IMAGES_PATH + '/imagesList.json',
    JSON.stringify(content, null, 2) + '\n',
    'utf8'
  )

writeJSONFileImagesList()

export default writeJSONFileImagesList

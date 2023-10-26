// This script will allow to have a list of all images in histoire

import * as fs from 'fs'
import * as path from 'path'

const IMAGES_PATH = process.argv.at(-1)

const getSubDirectories = (directory = IMAGES_PATH) =>
  fs
    .readdirSync(directory)
    .filter(file => fs.statSync(path.join(directory, file)).isDirectory())

const getSubDirectoriesWithFiles = (subDirectories = getSubDirectories()) =>
  subDirectories
    .map(directory => ({ [directory]: fs.readdirSync(IMAGES_PATH + '/' + directory) }))

const writeJSONFileImagesList = (content = getSubDirectoriesWithFiles()) =>
  fs.writeFileSync(
    IMAGES_PATH + '/imagesList.json',
    JSON.stringify(content, null, 2) + '\n',
    'utf8'
  )

writeJSONFileImagesList()

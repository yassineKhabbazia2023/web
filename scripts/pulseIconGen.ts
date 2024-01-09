import { generateIcons } from './iconGen/utils'

const [iconsFolderPath, outputFolderPath] = process.argv.slice(2)

generateIcons(iconsFolderPath, outputFolderPath)
console.log('PULSEEE! Icons successfully generated !')

import { mutationPublish } from '@kpmg/config-pulse/index'

mutationPublish({
  originFilePath: 'stryker/reports/reports.html',
  mfe: 'ged',
  indexFileName: 'index.html',
  subdir: 'reports',
  targetFolderPath: '../stryker.reports',
})
console.warn('Done')

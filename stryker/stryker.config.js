// eslint-disable-next-line import/extensions
import strykerConfig from '@kpmg/config-pulse/scripts/stryker.config.js'

const htmlReporter = {
  fileName: 'stryker/reports/reports.html',
}

export default {
  ...strykerConfig,
  htmlReporter,
}

import { App } from 'vue'
import { InstallAxeptioParams } from './axeptio.plugin.types'
import { initAxeptio } from './axeptio.plugin'

export default {
  install(_app: App, options: InstallAxeptioParams) {
    if (options.isActive === true) {
      initAxeptio()
    }
  },
}

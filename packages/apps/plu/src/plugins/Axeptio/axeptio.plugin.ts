import { App } from 'vue'
import { VITE_AXEPTIO_KEY } from 'env-vars'
import { logger } from '@pulse/toolbox'
import { InstallAxeptioParams } from './axeptio.plugin.types'

declare let window: {
  axeptioSettings: any // Axeptio
} & Window

export default {
  install(_app: App, options: InstallAxeptioParams) {
    if (options.isActive === true) {
      window.axeptioSettings = {
        clientId: VITE_AXEPTIO_KEY,
      }
      const firstScriptElement = document.getElementsByTagName('script')[0]
      const element = document.createElement('script')
      element.async = true
      element.src = '//static.axept.io/sdk.js'
      firstScriptElement?.parentNode?.insertBefore(element, firstScriptElement)
      logger.trace('Axeptio Plugin - initialized')
    }
  },
}

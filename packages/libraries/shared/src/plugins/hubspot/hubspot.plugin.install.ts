import type { App } from 'vue'
import type { InstallHubSpotParams } from './hubspot.plugin.types'
import { loadHubspotScript } from './hubspot.plugin'
import { hubSpotStatus } from './hubspot.plugin.state'

export default {
  install(_app: App, options: InstallHubSpotParams) {
    hubSpotStatus.isActive = options.isActive

    if (options.isActive === true) {
      loadHubspotScript()
    }
  },
}

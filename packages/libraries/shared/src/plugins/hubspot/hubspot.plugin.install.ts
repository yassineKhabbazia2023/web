import type { App } from 'vue'
import type { InstallHubSpotParams } from './hubspot.plugin.types'
import { hubSpotStatus } from './hubspot.plugin.state'

export default {
  install(_app: App, options: InstallHubSpotParams) {
    hubSpotStatus.isActive = options.isActive
  },
}

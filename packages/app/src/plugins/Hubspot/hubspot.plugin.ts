import { type App } from 'vue'
import { logger } from '@pulse/core'
import type { InitHubspotParams, HubSpotState, InstallHubSpotParams } from './hubspot.plugin.types'

declare let window: {
  HubSpotConversations: {
    on: (_eventName: string, _cb: () => void) => void
    widget: {
      load: ({ widgetOpen }: { widgetOpen: boolean }) => void
      open: () => void
      remove: () => void
    }
  }
} & Window

const hubSpotStatus: HubSpotState = {
  isActive: false,
  isInitialized: false,
}
export const openHubspot = () => {
  if (!hubSpotStatus.isInitialized) {
    logger.error('hubSpot is not initialized')
    return
  }
  window.HubSpotConversations.widget.load({ widgetOpen: true })
  window.HubSpotConversations.widget.open()
}

export const closeHubspot = () => {
  window.HubSpotConversations.widget.remove()
}

export function initHubspot({ onHubspotClose }: InitHubspotParams) {
  if (!hubSpotStatus.isActive) {
    return
  }
  if (!window.HubSpotConversations) {
    logger.error('window.HubSpotConversations does not exist')
    return
  }
  window.HubSpotConversations.on('widgetClosed', () => {
    closeHubspot()
    onHubspotClose()
  })
  hubSpotStatus.isInitialized = true
}

export default {
  install(_app: App, {
    isActive,
  }: InstallHubSpotParams) {
    hubSpotStatus.isActive = isActive
  },
}

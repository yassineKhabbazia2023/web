import { logger } from '@pulse/toolbox'
import type { InitHubspotParams } from './hubspot.plugin.types'
import { hubSpotStatus } from './hubspot.plugin.state'

declare let window: {
  disabledHsPopups?: string[]
  hsConversationsSettings?: {
    loadImmediately: boolean
  }
  HubSpotConversations: {
    on: (_eventName: string, _cb: () => void) => void
    widget: {
      load: ({ widgetOpen }: { widgetOpen: boolean }) => void
      open: () => void
      remove: () => void
    }
  }
} & Window

const HUBSPOT_SCRIPT_ID = 'hs-script-loader'
const HUBSPOT_SCRIPT_SRC = '//js-eu1.hs-scripts.com/143978459.js'

export function loadHubspotScript() {
  if (document.getElementById(HUBSPOT_SCRIPT_ID) !== null) {
    return
  }

  window.disabledHsPopups = ['ADS']
  window.hsConversationsSettings = {
    loadImmediately: false,
  }

  const script = document.createElement('script')
  script.id = HUBSPOT_SCRIPT_ID
  script.type = 'text/javascript'
  script.defer = true
  script.src = HUBSPOT_SCRIPT_SRC

  document.head.appendChild(script)
}

export const openHubspot = () => {
  if (!hubSpotStatus.isInitialized) {
    logger.error('Hubspot Plugin - Hubspot is not initialized')
    return
  }
  window.HubSpotConversations.widget.load({ widgetOpen: true })
  window.HubSpotConversations.widget.open()
  logger.trace('Hubspot Plugin - chat opened')
}

export const closeHubspot = () => {
  window.HubSpotConversations.widget.remove()
  logger.trace('Hubspot Plugin - chat closed')
}

export function initHubspot({ onHubspotClose }: InitHubspotParams) {
  if (!hubSpotStatus.isActive) {
    return
  }
  if (!window.HubSpotConversations) {
    logger.error('Hubspot Plugin - window.HubSpotConversations does not exist')
    return
  }
  if (hubSpotStatus.isInitialized) {
    logger.warn('Hubspot is already initialized')
    return
  }

  window.HubSpotConversations.on('widgetClosed', () => {
    closeHubspot()
    onHubspotClose()
  })
  hubSpotStatus.isInitialized = true
  logger.trace('Hubspot Plugin - initialized')
}

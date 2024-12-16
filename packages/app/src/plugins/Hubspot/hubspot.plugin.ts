import { logger } from '@pulse/core'

declare let window: {
  hsConversationsOnReady: any // HubSpot Conversations API
} & Window

export default {
  install() {
    if (import.meta.env.PROD) {
      /*
        If external API methods are already available, use them.
      */
      if (window.HubSpotConversations) {
        window.HubSpotConversations.on('widgetClosed', () => {
          window.productFruits.api.inAppCenter.show()
          window.productFruits.api.inAppCenter.close()
          window.HubSpotConversations.widget.remove()
        })
      } else {
        /*
          Otherwise, callbacks can be added to the hsConversationsOnReady on the window object.
          These callbacks will be called once the external API has been initialized.
        */
        window.hsConversationsOnReady = () => {
          logger.warn(`HubSpot Conversations API: ${window.HubSpotConversations}`)
        }
      }
    }
  },
}

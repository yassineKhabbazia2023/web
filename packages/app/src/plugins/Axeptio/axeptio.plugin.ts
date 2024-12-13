import { VITE_AXEPTIO_KEY } from 'env-vars'

declare let window: {
  axeptioSettings: any // Axeptio
} & Window

export default {
  install() {
    if (import.meta.env.PROD) {
      window.axeptioSettings = {
        clientId: VITE_AXEPTIO_KEY,
      }
      const firstScriptElement = document.getElementsByTagName('script')[0]
      const element = document.createElement('script')
      element.async = true
      element.src = '//static.axept.io/sdk.js'
      firstScriptElement?.parentNode?.insertBefore(element, firstScriptElement)
    }
  },
}

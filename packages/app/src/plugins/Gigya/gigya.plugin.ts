import { VITE_GIGYA_KEY } from 'env-vars'

export default {
  install() {
    const firstScriptElement = document.getElementsByTagName('script')[0]
    const element = document.createElement('script')
    element.async = true
    element.src = `https://cdns.gigya.com/js/gigya.js?apiKey=${VITE_GIGYA_KEY}`
    firstScriptElement?.parentNode?.insertBefore(element, firstScriptElement)
  },
}

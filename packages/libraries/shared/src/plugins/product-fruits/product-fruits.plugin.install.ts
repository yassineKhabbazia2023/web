import { type App } from 'vue'
import type { InstallProductFruitsParams } from './product-fruits.plugin.types'
import { productFruitStatus } from './product-fruits.plugin.state'

export default {
  install(_app: App, options: InstallProductFruitsParams) {
    productFruitStatus.isActive = options.isActive
    productFruitStatus.isInitialized = false
  },
}

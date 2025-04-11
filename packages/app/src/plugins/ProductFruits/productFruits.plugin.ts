import { type App } from 'vue'
import { logger } from '@pulse/core'
import { getBrowserName } from '@app/helper'
import { productFruits } from 'product-fruits'
import type {
  ProductFruitConfig,
  ProductFruitStatus,
  InitProductFruitsParams,
  ProductFruitUser,
  InstallProductFruitsParams,
  ProductFruitsRole,
} from './productFruits.plugin.types'

import './productFruits.plugin.scss'

declare let window: {
  productFruits: {
    services: {
      destroy: () => void
    },
    api: {
      inAppCenter: {
        show: () => void
        close: () => void
      }
    }
  }
  $productFruits: any
} & Window

const productFruitConfig: ProductFruitConfig = {
  openChat: undefined,
}

const productFruitStatus: ProductFruitStatus = {
  isActive: false,
  isInitialized: false,
}

export function onProductFruitsButtonExtWidgetInit() {
  productFruitConfig.openChat?.()
}

export function stopProductFruits() {
  if (!productFruitStatus.isInitialized) {
    return
  }
  window.productFruits.services.destroy()
  window.removeEventListener(
    'productfruits_button_ext_widget_init',
    onProductFruitsButtonExtWidgetInit,
  )
  productFruitStatus.isInitialized = false
  delete window.$productFruits
}

export function showProductFruits() {
  try {
    window.productFruits.api.inAppCenter.show()
  } catch (error) {
    logger.error(error)
  }
}

export function hideProductFruits() {
  try {
    window.productFruits.api.inAppCenter.close()
  } catch (error) {
    logger.error(error)
  }
}

export function getProductFruitsRole(user: ProductFruitUser): ProductFruitsRole {
  const { isCollab } = user
  return isCollab ? 'Collaborateur' : 'Client'
}

export function getProductFruitsOptions(user?: ProductFruitUser | null) {
  return user ? {
    username: user.id ?? '',
    email: user.email ?? '',
    firstname: user.firstName ?? '',
    lastname: user.lastName ?? '',
    role: getProductFruitsRole(user),
    props: {
      browser: getBrowserName(),
    },
  } : {
    // as discussed with Product Fruit directly, we should not differentiate anonymous users
    // that way we are not billed on thousands of hits on the anonymous pages (login and others)
    // this username: 'anonymous' will make Product Fruit operate on a limited functionalities
    // such as no dismissed banners and no tours
    // but we still are able to display banners (undismissable) and articles
    username: 'anonymous',
  }
}

export function initProductFruits({
  lang,
  key,
  user,
  openChat,
}: InitProductFruitsParams) {
  if (!productFruitStatus.isActive) {
    return
  }
  if (productFruitStatus.isInitialized) {
    logger.error('productFruit is already initialized')
    return
  }

  const productFruitsOptions = getProductFruitsOptions(user)
  productFruitConfig.openChat = openChat

  productFruits.init(
    key,
    lang,
    productFruitsOptions,
  )
  window.addEventListener(
    'productfruits_button_ext_widget_init',
    onProductFruitsButtonExtWidgetInit,
  )
  productFruitStatus.isInitialized = true
}

export default {
  install(_app: App, {
    isActive,
  }: InstallProductFruitsParams) {
    productFruitStatus.isActive = isActive
    productFruitStatus.isInitialized = false
  },
}

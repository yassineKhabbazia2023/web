import { type App } from 'vue'
import { logger } from '@pulse/toolbox'
import { getBrowserName } from '@pulse/toolbox/utils/browser'
import { productFruits } from 'product-fruits'
import dayjs from 'dayjs'
import type {
  ProductFruitConfig,
  ProductFruitStatus,
  InitProductFruitsParams,
  ProductFruitUser,
  InstallProductFruitsParams,
} from './productFruits.plugin.types'
import { initHubspot, openHubspot } from '@app/plugins/Hubspot/hubspot.plugin'
import {
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY,
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT,
  VITE_PRODUCT_FRUITS_KEY,
  VITE_PRODUCT_FRUITS_KEY_CLIENT,
} from 'env-vars'
import { UserInfo } from '@pulse/common/types'

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

enum ProductFruitsUserRoles {
  CLIENT = 'Client',
  COLLAB = 'Collaborateur',
}

// #region Product Fruits initialization
export function initProductFruits({ lang, key, user, openChatCallback }: InitProductFruitsParams) {
  if (!productFruitStatus.isActive) {
    logger.trace('Product Fruit is inactive')
    return
  }
  if (productFruitStatus.isInitialized) {
    logger.warn('productFruit is already initialized')
    return
  }

  const productFruitsOptions = getProductFruitsOptions(user)
  if (typeof openChatCallback === 'function') {
    setupChat(openChatCallback)
    // hubspot exists only if there's a need for a chat
    initHubspotWithProductFruits()
  }

  productFruits.init(key, lang, productFruitsOptions)
  productFruitStatus.isInitialized = true
  logger.trace('Product Fruits Plugin - initialized')
}

export function initProductFruitsAnonymousCustomer() {
  logger.trace('Product Fruits Plugin - initializing for anonymous customer')
  initProductFruits({ lang: 'fr', key: VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT })
}
export function initProductFruitsAnonymousCollab() {
  logger.trace('Product Fruits Plugin - initializing for anonymous collaborator')
  initProductFruits({ lang: 'fr', key: VITE_PRODUCT_FRUITS_ANONYMOUS_KEY })
}

export function initProductFruitsAuthenticatedCustomer(user: ProductFruitUser | undefined) {
  if (!user) {
    logger.error('No user given')
    return
  }
  logger.trace('Product Fruits Plugin - initializing for authenticated customer - username:', user.username)
  initProductFruits({ lang: 'fr', key: VITE_PRODUCT_FRUITS_KEY_CLIENT, user, openChatCallback: openHubspotChat })
}
export function initProductFruitsAuthenticatedCollab(user: ProductFruitUser | undefined) {
  if (!user) {
    return
  }
  logger.trace('Product Fruits Plugin - initializing for authenticated collaborator - username:', user.username)
  initProductFruits({ lang: 'fr', key: VITE_PRODUCT_FRUITS_KEY, user, openChatCallback: openHubspotChat })
}

function getProductFruitsOptions(user?: ProductFruitUser | null) {
  return user ? {
    ...user,
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

export function getProductFruitsUser(user: UserInfo): ProductFruitUser | undefined {
  if (!user) {
    logger.error('No user given')
    return
  }

  return {
    username: user.id.toString(),
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    // for signUpAt, the ISO 8601 datetime format with UTC timezone is highly recommended by Product Fruits
    // we set it to the current date and time in UTC
    // this is not the date when the user signed up, but rather the date when we initialized Product Fruits for this user
    signUpAt: dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
    role: user.isCollab ? ProductFruitsUserRoles.COLLAB : ProductFruitsUserRoles.CLIENT,
  }
}
// #endregion Product Fruits initialization

// #region Product Fruits x Hubspot
function initHubspotWithProductFruits() {
  initHubspot({
    // hubspot and Product Fruits don't exist at the same time so when we close hubspot chat, we show Product Fruits again
    onHubspotClose: () => showProductFruits(),
  })
}

function openHubspotChat() {
  logger.trace('Product Fruits Plugin - open Hubspot chat')
  // hubspot and Product Fruits don't exist at the same time so when we open hubspot chat, we hide Product Fruits
  hideProductFruits()
  openHubspot()
}

function setupChat(openChatCallback: () => void) {
  productFruitConfig.openChat = openChatCallback

  window.addEventListener(
    'productfruits_button_ext_widget_init',
    onProductFruitsButtonExtWidgetInit,
  )
}

function onProductFruitsButtonExtWidgetInit() {
  logger.trace('Product Fruits Plugin - openChat')
  productFruitConfig.openChat?.()
}
// #endregion Product Fruits x Hubspot

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
  productFruitConfig.openChat = undefined
  delete window.$productFruits
  logger.trace('Product Fruits Plugin - stopped')
}

export function showProductFruits() {
  try {
    logger.trace('Product Fruits Plugin - show Product Fruits')
    window.productFruits.api.inAppCenter.show()
  } catch (error) {
    logger.error(error)
  }
}

export function hideProductFruits() {
  try {
    logger.trace('Product Fruits Plugin - hide Product Fruits')
    window.productFruits.api.inAppCenter.close()
  } catch (error) {
    logger.error(error)
  }
}

export default {
  install(_app: App, options: InstallProductFruitsParams) {
    productFruitStatus.isActive = options.isActive
    productFruitStatus.isInitialized = false
  },
}

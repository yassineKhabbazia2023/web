<template>
  <div v-if="!isLoading && defaultEntity" class="common-layout">
    <HomeScheduleDrawer v-if="calendarHasBeenOpened" v-model="showCalendar" />
    <FeedCenterDrawer
      v-if="VITE_FEED_CENTER_ACTIVATED === 'true'"
      v-model="showFeedCenter"
      :unreadNotificationsCount="unreadNotificationsCount"
    />
    <PContainer pDirection="vertical">
      <PCHeader
        class="header-container"
        height="56"
      >
        <Header
          v-model:showCalendar="showCalendar"
          v-model:showFeedCenter="showFeedCenter"
          :unreadNotificationsCount="unreadNotificationsCount"
          @show-user-profile-drawer="handleClick"
        />
      </PCHeader>
      <PContainer class="aside-main-container">
        <PAside class="aside-container">
          <Sidebar class="sidebar-container" />
        </PAside>
        <PContainer
          class="main-container"
          :class="{
            'main-container--no-paddings':
              stylesMetaProperties?.hasPaddings === false
          }"
        >
          <UserProfile
            v-if="hasUserProfileDrawerOpened"
            v-model="hasUserProfileDrawerOpened"
            :hasDrawerOpened="hasUserProfileDrawerOpened"
            data-testid="home-user-profile"
          />
          <router-view />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
  <div
    v-show="isChatFeatureDisplayable"
    ref="chat"
    class="salesforce-chat-wrapper"
    data-testid="salesforce-chat-div"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { productFruits } from 'product-fruits'
import {
  VITE_PRODUCT_FRUITS_KEY,
  VITE_PRODUCT_FRUITS_KEY_CLIENT,
  VITE_FEED_CENTER_ACTIVATED,
  VITE_SALESFORCE_ACTIVATED,
  VITE_HUBSPOT_ACTIVATED,
} from 'env-vars'
import { commonStore as store, dataProvider } from '@pulse/common'
import { PCHeader, PAside, PContainer } from '@pulse/styleguide/components'
import { getBrowserName } from '@app/helper'
import UserProfile from '@app/components/UserProfile'
import HomeScheduleDrawer from '@app/components/HomeScheduleDrawer'
import { ReloadOneTrust } from '@app/plugins/OneTrust'
import Header from './Header'
import Sidebar from './Sidebar'
import { storeToRefs } from 'pinia'
import { fetchEntities } from '@app/services/entities'
import { getDefaultEntity } from './Sidebar/components/SidebarEntity/utils'
import { useSalesforceService } from '@app/plugins/SalesForce/useSalesforceService'
import FeedCenterDrawer from '@app/modules/FeedCenter/components/FeedCenterDrawer'
import { fetchUnreadNotificationsCount } from '@app/modules/FeedCenter/services/notifications.service'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from '@app/constants'

declare global {
  interface Window {
    embedded_svc: any
    productFruits: any
    HubSpotConversations: any
  }
}

// Variables
const router = useRouter()
const { fetchUserData } = dataProvider()
const isLoading = ref<boolean>(true)
const calendarIsOpened = ref(false)
const calendarHasBeenOpened = ref(false)
const isProd = import.meta.env.PROD

const showCalendar = computed({
  get: () => calendarIsOpened.value,
  set: (value: boolean) => {
    calendarIsOpened.value = value
    if (value && !calendarHasBeenOpened.value) {
      // calendar has been opened at least once
      calendarHasBeenOpened.value = true
    }
  },
})

const isFeedCenterOpened = ref(false)
const showFeedCenter = computed({
  get: () => isFeedCenterOpened.value,
  set: (value: boolean) => {
    isFeedCenterOpened.value = value
  },
})

const hasUserProfileDrawerOpened = ref(false)

const handleClick = () => {
  hasUserProfileDrawerOpened.value = true
  ReloadOneTrust()
}

// Computed
const stylesMetaProperties = computed(
  () => router.currentRoute.value.meta.styles,
)

const globalStore = store()
const { user, defaultEntity, isCollab } = storeToRefs(globalStore)
const chat = ref<Element>()
const { isChatDisplayed, salesforceChat } = useSalesforceService()

const isChatFeatureDisplayable = computed(()=> isChatDisplayed.value && VITE_SALESFORCE_ACTIVATED === 'true')

const initChat = () => {
  if (isProd && user.value && defaultEntity.value && chat.value && VITE_SALESFORCE_ACTIVATED === 'true') {
    const firstName: string = user.value?.firstName
    const lastName: string = user.value?.lastName
    const email: string = user.value?.email
    const companyName: string = defaultEntity.value?.legalName
    const accountNumber: string = defaultEntity.value?.accountNumber
    const targetElement: Element = chat.value

    salesforceChat(
      firstName,
      lastName,
      email,
      companyName,
      accountNumber,
      targetElement,
    )
  }
}

watch(defaultEntity, () => {
  initChat()
})

// Hooks
onMounted(async () => {
  try {
    const user = await fetchUserData()
    const entities = await fetchEntities()
    const selectedEntity = getDefaultEntity(entities.items[0])

    globalStore.$patch({
      user: {
        ...user,
        entities: {
          default: selectedEntity,
          favorites: [],
        },
      },
    })

    if (isProd) {
      const productFruitsKey = isCollab.value ? VITE_PRODUCT_FRUITS_KEY : VITE_PRODUCT_FRUITS_KEY_CLIENT
      if (productFruitsKey) {
        productFruits.init(productFruitsKey, 'fr', {
          username: user?.id,
          email: user?.email,
          firstname: user?.firstName,
          lastname: user?.lastName,
          role: user?.isCollab ? 'Collaborateur' : 'Client',
          props: {
            browser: getBrowserName(),
          },
        })

        window.addEventListener(
          'productfruits_button_ext_widget_init',
          () => {
            isChatDisplayed.value = true
            if(VITE_SALESFORCE_ACTIVATED === 'true') {
              nextTick().then(() => {
                const chatElement = document.querySelector(
                  '.helpButtonEnabled',
                ) as HTMLElement
                if (chatElement) {
                  chatElement.click()
                }
              })
            }
            if(VITE_HUBSPOT_ACTIVATED === 'true') {
              (window as any).HubSpotConversations.widget.load({ widgetOpen: true });
              (window as any).HubSpotConversations.widget.open()
            }
          },
        )
      }
    }
  } catch (error) {
    logger.error('Unable to fetch current user information: ', error)
  } finally {
    isLoading.value = false
  }
})

async function setNotificationsCount() {
  if (VITE_FEED_CENTER_ACTIVATED !== 'true') {
    return
  }

  try {
    const { count } = await fetchUnreadNotificationsCount()
    unreadNotificationsCount.value = count
  } catch (error) {
    logger.error('Notifications count fetch failed.', error)
  }
}

const unreadNotificationsCount = ref(0)
const notificationsCountIntervalId = setInterval(async () => {
  await setNotificationsCount()
}, UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)

onMounted(() => {
  setNotificationsCount()
})

onBeforeUnmount(() => {
  clearInterval(notificationsCountIntervalId)
})
</script>
<!-- eslint-disable max-len -->
<!-- eslint-disable vue/enforce-style-attribute -->
<style lang="scss">
.embeddedServiceSidebar .sidebarHeader {
  background-color: var(--el-color-primary) !important;
}

.salesforce-chat-wrapper {
  * {
    font-family: 'Open Sans', 'Roboto', sans-serif !important;
  }

  .formContent.embeddedServiceSidebarForm .fieldList .inputSelect:last-child {
    display: none;
  }

  .embeddedServiceSidebarMinimizedDefaultUI .embeddedServiceSidebarHeader,
  .embeddedServiceSidebarExtendedHeader,
  .embeddedServiceHelpButton .helpButton .uiButton,
  .embeddedServiceSidebarMinimizedDefaultUI.helpButton,
  .embeddedServiceSidebarMinimizedDefaultUI {
    background-color: var(--el-color-primary) !important;
  }
  .embeddedServiceSidebarButton {
    background-color: var(--el-color-primary);
    border-radius: var(--el-border-radius-base);
  }

  .embeddedServiceSidebarButton.uiButton--inverse .label {
    color: white;
  }

  .backgroundImg {
    background-image: url('https://kpmgfrance--c.eu30.content.force.com/sfc/dist/version/renditionDownload?rendition=ORIGINAL_Png&versionId=0683Y00000HHtL5&operationContext=DELIVERY&contentId=05T3Y00000vSCov&page=0&d=/a/3Y000001isRh/mIKQbdMirgmYnJsGzj7szbs7_tArBl_dd3bgE6GpBe4&oid=00D0O000000tM38&dpt=null&viewId=') !important;
    background-size: cover !important;
  }

  .backgroundImgColorMask {
    background: var(--el-color-primary);
  }
  .backgroundPattern {
    background: var(--el-color-primary) !important;
  }

  .embeddedServiceLiveAgentStateChatHeader .message {
    font-size: 0px;
    color: rgba(white, 0);
    &:before {
      display: inline-block;
      font-size: 12px;
      color: white;
      content: 'A votre service';
    }
  }

  .avatar {
    display: block;
    border-radius: none;
  }

  .embeddedServiceSidebarButton:focus,
  .uiButton:focus {
    text-decoration: none;
  }

  .embeddedServiceLiveAgentStateOfflineSupportDefaultUI {
    select.Reason {
      font-size: 10px;
    }
    input {
      font-size: 12px;
    }
  }
}
</style>

<style lang="scss" scoped>
.common-layout {
  .aside-main-container {
    display: flex;
  }

  .aside-container {
    width: inherit;
    overflow: visible;
  }

  .header-container {
    padding: 0;
  }

  .aside-container .sidebar-container {
    height: 100vh;
    padding-right: 52px;
    @media only screen and (min-width: 992px) {
      position: relative;
      z-index: 10;
    }
  }

  .main-container {
    display: block;
    padding: 16px;
    position: relative;
    width: 100%;
    height: calc(100vh - 56px);
    margin-top: 56px;
    overflow: auto;

    @media only screen and (max-width: 991px) {
      height: calc(100vh - 108px);
    }

    &--no-paddings {
      padding: 0;
    }
  }
}
</style>

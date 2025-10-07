<template>
  <div
    v-if="!isLoading"
    class="common-layout"
    data-testid="common-layout"
  >
    <FeedCenterDrawer
      v-if="FeatureFlagManager.isFeedCenterActivated()"
      v-model="showFeedCenter"
      :unreadNotificationsCount="unreadNotificationsCount"
      @notifications-updated="setNotificationsCount"
      @open-notification-settings-drawer="openNotificationSettingsDrawer"
    />

    <NotificationSettings
      v-if="FeatureFlagManager.isNotificationSettingsDrawerActivated() && isNotificationSettingsDrawerOpened"
      v-model="isNotificationSettingsDrawerOpened"
    />

    <UserProfile
      v-if="hasUserProfileDrawerOpened"
      v-model:is-drawer-opened="hasUserProfileDrawerOpened"
      data-testid="home-user-profile"
    />

    <PContainer pDirection="vertical">
      <PCHeader
        class="header-container"
        height="56"
      >
        <Header
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
            'main-container--no-paddings': shouldRemovePadding,
          }"
        >
          <router-view />
        </PContainer>
      </PContainer>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { FeatureFlagManager } from '@pulse/common/managers'
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PCHeader, PAside, PContainer } from '@pulse/styleguide/components'
import UserProfile from './UserProfile'
import FeedCenterDrawer from './FeedCenter/components/FeedCenterDrawer'
import { fetchUnreadNotificationsCount } from './FeedCenter/services/notifications.service'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from './FeedCenter/constants'
import { trackFeedcenterOpened } from './FeedCenter/services/tracking/tracking.service'
import { LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import NotificationSettings from './FeedCenter/components/NotificationSettings/notification-settings.vue'
import Header from './header'
import Sidebar from './Sidebar'

// Variables
const router = useRouter()
const isLoading = ref<boolean>(true)
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
}

const shouldRemovePadding = computed(() => {
  const removePadding = router.currentRoute.value?.meta[LAYOUT_NO_PADDING_META] === true
  return removePadding
})

// Hooks
onMounted(async () => {
  try {
    setNotificationsCount()

  } catch (error) {
    logger.error('Something wrong occurred: ', error)
  } finally {
    isLoading.value = false
  }
})

watch(isFeedCenterOpened, async (value) => {
  if (!value) {
    setTimeout(async () => {
      await setNotificationsCount()
    }, 500)
  } else {
    await setNotificationsCount()
    trackFeedcenterOpened()
  }
})

async function setNotificationsCount() {
  if (!FeatureFlagManager.isFeedCenterActivated()) {
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
  const isPageVisible = document.visibilityState === 'visible'

  if (isPageVisible === true) {
    await setNotificationsCount()
  }
}, UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)

onBeforeUnmount(() => {
  clearInterval(notificationsCountIntervalId)
})

const isNotificationSettingsDrawerOpened = ref(false)
function openNotificationSettingsDrawer() {
  isNotificationSettingsDrawerOpened.value = true
}
</script>

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
    padding-right: 50px;
    position: relative;
    @media only screen and (min-width: 992px) {
      z-index: 10;
    }
  }

  .main-container {
    display: block;
    padding: 24px;
    position: relative;
    width: 100%;
    height: calc(100vh - var(--p-header-height));
    margin-top: var(--p-header-height);
    overflow: auto;

    &--no-paddings {
      padding: 0;
    }
  }
}
</style>

<template>
  <div
    v-if="!isLoading"
    class="common-layout"
    data-testid="common-layout"
  >
    <HomeScheduleDrawer
      v-if="FeatureFlagManager.isScheduleActivated() && calendarHasBeenOpened"
      v-model="showCalendar"
    />
    <FeedCenterDrawer
      v-if="FeatureFlagManager.isFeedCenterActivated()"
      v-model="showFeedCenter"
      :unreadNotificationsCount="unreadNotificationsCount"
      @notifications-updated="setNotificationsCount"
      @favourites-filter-updated="onFavoriteFilterUpdated"
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
</template>

<script setup lang="ts">
import { logger, FeatureFlagManager } from '@pulse/core'
import { computed, ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PCHeader, PAside, PContainer } from '@pulse/styleguide/components'
import UserProfile from '@app/components/UserProfile'
import HomeScheduleDrawer from '@app/components/HomeScheduleDrawer'
import Header from './Header'
import Sidebar from './Sidebar'
import FeedCenterDrawer from '@app/modules/FeedCenter/components/FeedCenterDrawer'
import { fetchUnreadNotificationsCount } from '@app/modules/FeedCenter/services/notifications.service'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from '@app/constants'
import { trackFeedcenterOpened } from '@app/modules/FeedCenter/services/tracking/tracking.service'
import { useUserStore } from '@pulse/common/stores'


// Variables
const router = useRouter()
const isLoading = ref<boolean>(true)
const calendarIsOpened = ref(false)
const calendarHasBeenOpened = ref(false)
const isFavoriteFromLocalStorage = localStorage.getItem('favoriteEnabled')
const isFavoriteEnabled: Ref<boolean> = ref(isFavoriteFromLocalStorage === 'true')
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
}

function onFavoriteFilterUpdated(isEnabled: boolean) {
  isFavoriteEnabled.value = isEnabled
  setNotificationsCount()
}

// Computed
const stylesMetaProperties = computed(
  () => router.currentRoute.value.meta.styles,
)

const userStore = useUserStore()

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
    const { favoriteEntities } = storeToRefs(userStore)
    const accountIds = isFavoriteEnabled.value
      ? favoriteEntities.value.map(e => e.accountId)
      : []

    const { count } = await fetchUnreadNotificationsCount(accountIds)
    unreadNotificationsCount.value = count
  } catch (error) {
    logger.error('Notifications count fetch failed.', error)
  }
}

const unreadNotificationsCount = ref(0)
const notificationsCountIntervalId = setInterval(async () => {
  await setNotificationsCount()
}, UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)

onBeforeUnmount(() => {
  clearInterval(notificationsCountIntervalId)
})
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
    @media only screen and (min-width: 992px) {
      position: relative;
      z-index: 10;
    }
  }

  .main-container {
    display: block;
    padding: 24px;
    position: relative;
    width: 100%;
    height: calc(100vh - 56px);
    margin-top: 56px;
    overflow: auto;

    &--no-paddings {
      padding: 0;
    }
  }
}
</style>

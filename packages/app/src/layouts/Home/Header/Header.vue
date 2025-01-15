<template>
  <div
    class="header-section
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--3
      padding-x--6"
  >
    <router-link to="/">
      <PImage
        class="header-section__logo"
        pType="logos"
        pName="brand-color"
        pFit="fill"
      />
    </router-link>
    <div class="flex">
      <div v-if="FeatureFlagManager.isScheduleActivated()">
        <PButton
          :pType="showCalendar ? 'white' : 'default'"
          pSize="small"
          pIconOnly
          pPlain
          :pIsActive="showCalendar"
          :pRound="false"
          :pDisabled="false"
          :pLoading="false"
          data-testid="header-section-calendar-btn"
          @click="updateCalendarDisplay"
        >
          <PIcon :pName="calendarIconName" />
        </PButton>
      </div>

      <div
        v-if="VITE_FEED_CENTER_ACTIVATED === 'true'"
        class="position--relative padding-left--2"
      >
        <PButton
          pIconOnly
          :pIsActive="showFeedCenter"
          pPlain
          :pRound="false"
          pSize="small"
          :pType="showFeedCenter ? 'white' : 'default'"
          data-testid="feed-center-button"
          @click="updateFeedCenterDisplay"
        >
          <PIcon :pName="feedCenterIconName" />
          <div
            v-if="unreadNotificationsCount > 0"
            class="header-section__feed-center-notification-pastille"
          >
            <PPastille
              v-if="!showFeedCenter"
              pSize="small"
              pType="warning"
            >
              {{ unreadNotificationsCount }}
            </PPastille>
          </div>
        </PButton>
      </div>
      <PDivider
        class="margin-x--4 header-section__divider"
        pDirection="vertical"
        pBorderColor="neutral-gray-100"
      />
      <div
        class="header-section__user-avatar cursor-pointer"
        @click="emit('showUserProfileDrawer')"
      >
        <PAvatar
          pShape="circle"
          pType="small"
          pColor="blue-pulse"
          data-ut="user-initials"
        >
          {{ userInitials }}
        </PAvatar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { commonStore, getInitials } from '@pulse/common'
import { FeatureFlagManager } from '@pulse/core'
import {
  PAvatar,
  PButton,
  PDivider,
  PIcon,
  PImage,
  PPastille,
} from '@pulse/styleguide/components'
import { VITE_FEED_CENTER_ACTIVATED } from 'env-vars'
import type { HeaderProps } from './HeaderTypes'

const props = defineProps<HeaderProps>()

const { user } = storeToRefs(commonStore())

const emit = defineEmits<{
  'update:showCalendar': [boolean]
  'update:showFeedCenter': [boolean]
  'showUserProfileDrawer': []
}>()

onBeforeMount(() => {
  const route = useRoute()
  if(route.redirectedFrom?.path === '/portefeuille') {
    window.location.reload()
  }
})

const userInitials = computed(() =>
  getInitials(user.value?.firstName, user.value?.lastName),
)

const feedCenterIconName = computed(() =>
  props.showFeedCenter ? 'x' : 'bell',
)
const calendarIconName = computed(() =>
  props.showCalendar ? 'x' : 'calendarEvent',
)

function updateCalendarDisplay() {
  emit('update:showCalendar', !props.showCalendar)
}

function updateFeedCenterDisplay() {
  emit('update:showFeedCenter', !props.showFeedCenter)
}
</script>

<style lang="scss" scoped>
.header-section {
  z-index: 21;
  position: fixed;
  box-shadow: 0px 0px 2px 0px rgba(32, 32, 32, 0.10), 0px 1px 2px 0px rgba(32, 32, 32, 0.05), 0px 2px 4px 0px rgba(32, 32, 32, 0.08), 0px 3px 4px 0px rgba(32, 32, 32, 0.10);
  height: 56px;
  width: 100vw;
  background-color: var(--el-color-base-white);

  &__logo {
    margin-top: 5px;
    height: 34px;
  }

  &__divider {
    height: 32px;
  }

  &__feed-center-notification-pastille {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>

<template>
  <div
    class="header-section
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--3
      padding-x--6
      shadow--4"
  >
    <router-link to="/">
      <PImage
        class="header-section__logo"
        pType="logos"
        pName="pulse-color"
        pFit="fill"
      />
    </router-link>
    <div class="flex">
      <PButton
        :pType="showCalendar ? 'white' : 'generic'"
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
          :pType="showFeedCenter ? 'white' : 'generic'"
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
      />
      <div
        class="header-section__user-avatar cursor-pointer"
        @click="emit('showUserProfileDrawer')"
      >
        <PAvatar
          pShape="circle"
          pType="small"
          pColor="persian-gradient"
          data-ut="user-initials"
        >
          {{ userInitials }}
        </PAvatar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { commonStore, getInitials } from '@pulse/common'
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
  top: 0;
  left: 27px;
  border-bottom-left-radius: 24px;
  height: 56px;
  width: calc(100vw - 27px);
  background-color: var(--el-color-base-white);

  &__logo {
    width: 149px;
    height: 20px;
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

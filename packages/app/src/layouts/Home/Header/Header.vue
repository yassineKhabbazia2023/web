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
        @click="updateCalendarDisplay"
        data-testid="header-section-calendar-btn"
      >
        <PIcon>
          <PICalendarEvent v-if="!showCalendar" />
          <PIX v-if="showCalendar" />
        </PIcon>
      </PButton>

      <div class="position--relative padding-left--2">
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
          <PIcon>
            <PIBell v-if="!showFeedCenter"/>
            <PIX v-else />
          </PIcon>
          <div class="header-section__feed-center-notification-pastille">
            <PPastille
              v-if="!showFeedCenter"
              pSize="small"
              pType="warning"
            >
              {{  unreadNotificationsCount }}
            </PPastille>
          </div>
        </PButton>
      </div>
      <PDivider
        class="margin-x--4 header-section__divider"
        pDirection="vertical"
      />
      <div
        @click="emit('showUserProfileDrawer')"
        class="header-section__user-avatar cursor-pointer"
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
  PIBell,
  PIcon,
  PImage,
  PICalendarEvent,
  PIX,
} from '@pulse/styleguide'
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

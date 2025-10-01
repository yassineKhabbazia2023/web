<template>
  <div
    class="header-section
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--3
      padding-x--6"
  >
    <BookingDrawer
      v-if="hasBookingDrawerBeenOpened"
      v-model:isOpened="isBookingDrawerOpened"
    />
    <router-link to="/">
      <PImage
        class="header-section__logo"
        pType="logos"
        pName="brand-color"
        pFit="fill"
      />
    </router-link>
    <div class="flex">
      <PButton
        v-if="showBookingButton"
        pSize="small"
        pIconOnly
        pPlain
        :pDisabled="false"
        :pLoading="false"
        data-testid="booking-button"
        class="position--relative"
        @click="openDrawer"
      >
        <PIcon pName="calendarEvent" />
        <PPastille
          class="
            position--absolute
            header-section__x-small-pastille
          "
          pSize="x-small"
          pType="warning"
        />
      </PButton>

      <div
        v-if="FeatureFlagManager.isFeedCenterActivated()"
        class="position--relative padding-left--2"
      >
        <PButton
          pIconOnly
          :pIsActive="showFeedCenter"
          pPlain
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
        pBorderColor="gray-100"
      />
      <div
        class="header-section__user-avatar cursor-pointer"
        @click="emit('showUserProfileDrawer')"
      >
        <PAvatar
          pShape="circle"
          pType="small"
          :pRole="userRole"
          data-ut="user-initials"
        >
          {{ userInitials }}
        </PAvatar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { getInitials } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
import { Feature } from '@pulse/core/enums'
import { FeatureFlagManager } from '@pulse/core'
import {
  PAvatar,
  PButton,
  PDivider,
  PIcon,
  PImage,
  PPastille,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import type { HeaderProps } from './HeaderTypes'
import BookingDrawer from '../booking/booking-drawer/booking-drawer.vue'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const userStore = useUserStore()

const props = defineProps<HeaderProps>()

const { user } = storeToRefs(userStore)

const hasBookingDrawerBeenOpened = ref(false)
const isBookingDrawerOpened = ref(false)

const emit = defineEmits<{
  'update:showFeedCenter': [boolean]
  'showUserProfileDrawer': []
}>()

const userInitials = computed(() =>
  getInitials(user.value?.firstName, user.value?.lastName),
)

const userRole = computed(() => {
  const isCollab = userStore.isCollab
  return isCollab ? AvatarRoles.COLLAB : AvatarRoles.CLIENT
})

const feedCenterIconName = computed(() =>
  props.showFeedCenter ? 'x' : 'bell',
)

const showBookingButton = computed(() =>
  userStore.isCollab === true &&
  FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true,
)

function updateFeedCenterDisplay() {
  emit('update:showFeedCenter', !props.showFeedCenter)
}

function openDrawer() {
  AmplitudeService.track('Booking Configuration View Started')
  hasBookingDrawerBeenOpened.value = true
  isBookingDrawerOpened.value = true
}
</script>

<style lang="scss" scoped>
.header-section {
  z-index: 21;
  position: fixed;
  box-shadow:
    0px 0px 2px 0px rgba(32, 32, 32, 0.10),
    0px 1px 2px 0px rgba(32, 32, 32, 0.05),
    0px 2px 4px 0px rgba(32, 32, 32, 0.08),
    0px 3px 4px 0px rgba(32, 32, 32, 0.10);
  height: var(--p-header-height);
  width: 100vw;
  background-color: var(--p-white);

  &__logo {
    height: 32px;
  }

  &__divider {
    height: 32px;
  }

  &__feed-center-notification-pastille {
    position: absolute;
    right: 0;
    top: 0;
  }

  &__x-small-pastille {
    right: 1px;
    top: 0px;
  }
}
</style>

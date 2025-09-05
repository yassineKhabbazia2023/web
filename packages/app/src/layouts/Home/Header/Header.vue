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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { getInitials } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
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

const userStore = useUserStore()

const props = defineProps<HeaderProps>()

const { user } = storeToRefs(userStore)

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

function updateFeedCenterDisplay() {
  emit('update:showFeedCenter', !props.showFeedCenter)
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
  height: 56px;
  width: 100vw;
  background-color: var(--p-white);

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

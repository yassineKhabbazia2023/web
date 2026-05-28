<template>
  <div
    class="
      mobile-header
      shadow--2
      flex
      flex--align-items-center
      flex--justify-content-space-between
    "
  >
    <router-link
      :to="{ name: RouteName.LANDING }"
      class="mobile-header__logo-link"
      @click="amplitudeTrack"
    >
      <PImage
        class="mobile-header__logo"
        pType="logos"
        pName="brand-monogram"
        pFit="fill"
      />
    </router-link>

    <div
      class="
        mobile-header__right
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <router-link
        v-if="currentEntity"
        :to="{ name: RouteName.LANDING }"
        class="
          mobile-header__entity
          flex
          flex--direction-column
          flex--align-items-flex-end
          flex-gap--half
        "
        data-testid="mobile-header-entity-link"
      >
        <span class="mobile-header__entity-name font-semibold">{{ currentEntity.legalName }}</span>
        <span class="mobile-header__entity-id font-normal">{{ currentEntity.accountNumber }}</span>
      </router-link>

      <slot name="header-actions" />

      <PDivider
        class="mobile-header__divider"
        pDirection="vertical"
        pBorderColor="gray-100"
      />

      <button
        type="button"
        class="mobile-header__user-menu"
        data-testid="mobile-header-user-menu"
        @click="handleMenuClick"
      >
        <PAvatar
          pShape="circle"
          pType="xsmall"
          :pRole="userRole"
        >
          {{ userInitials }}
        </PAvatar>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { RouteName } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { getInitials } from '@pulse/common/utils'
import { PImage, PAvatar, PDivider } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import type { MobileHeaderProps } from './mobile-header.type'

defineProps<MobileHeaderProps>()

const emit = defineEmits<{
  'showUserProfileDrawer': []
}>()

const route = useRoute()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const userInitials = computed(() =>
  getInitials(user.value?.firstName, user.value?.lastName),
)

const userRole = computed(() => {
  const isCollab = userStore.isCollab
  return isCollab ? AvatarRoles.COLLAB : AvatarRoles.CLIENT
})

function amplitudeTrack() {
  AmplitudeService.track('Brand logo clicked', {
    from_location: route.name,
  })
}

function handleMenuClick() {
  emit('showUserProfileDrawer')
}
</script>

<style lang="scss" scoped>
.mobile-header {
  z-index: 21;
  position: fixed;
  height: var(--p-header-height);
  width: 100%;
  left: 0;
  right: 0;
  padding: 0 16px;
  background-color: var(--p-white);

  &__logo-link {
    line-height: 0;
  }

  &__logo {
    height: 32px;
  }

  &__entity {
    text-decoration: none;
  }

  &__entity-name {
    font-size: 1.4rem;
    color: var(--p-black-rock-900);
    line-height: 1.2;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__entity-id {
    font-size: 1.2rem;
    color: var(--p-gray-500);
    line-height: 1.2;
  }

  &__divider {
    height: 24px;
  }

  &__user-menu {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    line-height: 0;
  }
}
</style>

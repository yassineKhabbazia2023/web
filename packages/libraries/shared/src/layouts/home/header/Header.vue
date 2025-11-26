<template>
  <div
    class="header-section
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-y--3
      padding-x--6"
  >
    <router-link
      :to="{ name: RouteName.LANDING }"
      class="line-height--0"
      @click="amplitudeTrack"
    >
      <PImage
        class="header-section__logo"
        pType="logos"
        pName="brand-color"
        pFit="fill"
      />
    </router-link>
    <div class="flex">
      <slot name="header-top-right-zone" />
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
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { getInitials } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'
import {
  PAvatar,
  PDivider,
  PImage,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'

const userStore = useUserStore()
const route = useRoute()

const { user } = storeToRefs(userStore)

const emit = defineEmits<{
  'showUserProfileDrawer': []
}>()

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
}
</style>

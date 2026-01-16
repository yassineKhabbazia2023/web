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

    <router-link
      v-if="currentEntity"
      :to="{ name: RouteName.HOMEPAGE, params: { entityId: currentEntity.accountId } }"
      class="
        mobile-header__entity
        flex
        flex--align-items-center
        flex-gap--2
      "
      data-testid="mobile-header-entity-link"
    >
      <div
        class="
          mobile-header__entity-info
          flex
          flex--direction-column
          flex--align-items-flex-end
          flex-gap--half
        "
      >
        <span class="mobile-header__entity-name font-semibold">{{ currentEntity.legalName }}</span>
        <span class="mobile-header__entity-id font-normal">{{ currentEntity.accountNumber }}</span>
      </div>
      <PAvatar
        pShape="circle"
        pType="xsmall"
        :pColor="entityAvatarColor"
      >
        <PIcon pName="pulse" />
      </PAvatar>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PImage, PIcon, PAvatar } from '@pulse/styleguide/components'
import { getAvatarColorFromKey } from '@pulse/styleguide'
import type { MobileHeaderProps } from './mobile-header.types'

const props = defineProps<MobileHeaderProps>()

const route = useRoute()

const entityAvatarColor = computed(() =>
  props.currentEntity ? getAvatarColorFromKey(props.currentEntity.accountNumber) : undefined,
)

function amplitudeTrack() {
  AmplitudeService.track('Brand logo clicked', {
    from_location: route.name,
  })
}
</script>

<style lang="scss" scoped>
.mobile-header {
  z-index: 21;
  position: fixed;
  height: var(--p-header-height);
  width: 100vw;
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
}
</style>

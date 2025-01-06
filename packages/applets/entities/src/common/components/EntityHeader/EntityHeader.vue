<template>
  <div
    class="
      entity-header
      flex
      flex--align-items-center
      padding-bottom--6
    "
  >
    <PAvatar
      pShape="circle"
      pType="small"
      :pColor="entityAvatarColor"
    >
      <PIcon pName="pulse" />
    </PAvatar>
    <span
      class="
        entity-header__legal-name
        font-semibold
        margin-left--3
      "
      data-testid="entity-header-name"
    >
      {{ legalName }}
    </span>
    <div
      class="
        entity-header__separator
        margin-x--3
        bg--neutral-gray-100
      "
    />
    <p class="entity-header__account-number text-color--neutral-gray-500" data-testid="entity-header-account-number">
      {{ accountNumber }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import type { EntityHeaderProps } from './entity-header.types'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const props = defineProps<EntityHeaderProps>()
const entityAvatarColor = computed(() => getAvatarColorFromKey(props.accountNumber))
</script>

<style lang="scss">
.entity-header {
  &__legal-name {
    font-size: 2.8rem;
  }

  &__account-number {
    font-size: 1.8rem;
  }

  &__separator {
    width: 1px;
    height: 12px;
  }
}
</style>

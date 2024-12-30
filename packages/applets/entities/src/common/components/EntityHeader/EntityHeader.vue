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
      pColor="green"
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
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import type { EntityHeaderProps } from './entity-header.types'
defineProps<EntityHeaderProps>()
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

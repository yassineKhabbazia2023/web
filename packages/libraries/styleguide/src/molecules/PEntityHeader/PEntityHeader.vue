<template>
  <div
    class="
      p-entity-header
      flex
      flex--align-items-center
    "
    :class="variant"
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
        p-entity-header__legal-name
        font-semibold
        margin-left--3
      "
      data-testid="entity-header-name"
    >
      {{ pLegalName }}
    </span>
    <div
      class="
        p-entity-header__separator
        margin-x--3
        bg--neutral-gray-100
      "
    />
    <p class="p-entity-header__account-number text-color--neutral-gray-500" data-testid="entity-header-account-number">
      {{ pAccountNumber }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import type { PEntityHeaderProps } from './PEntityHeader.types'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const props = defineProps<PEntityHeaderProps>()
const entityAvatarColor = computed(() => getAvatarColorFromKey(props.pAccountNumber))
const variant = computed(() => {
  switch (props.pSize) {
    case 'small':
      return 'p-entity-header-small'
    default:
      return 'p-entity-header-default'
  }
})
</script>

<style lang="scss">
@use '../../assets/scss/pegase/breakpoints';

.p-entity-header {
  @include breakpoints.media(xs) {
    display: none;
  }
}

$entityHeaderVariant:
  "small" 2.1rem 1.4rem 10px,
  "default" 2.8rem 1.8rem 12px;

@each $variant, $legalFontSize, $accountNumberFontSize, $separatorHeight in $entityHeaderVariant {
  .p-entity-header-#{$variant} {
    .p-entity-header__legal-name {
      font-size: $legalFontSize;
    }

    .p-entity-header__account-number {
      font-size: $accountNumberFontSize;
    }

    .p-entity-header__separator {
      width: 1px;
      height: $separatorHeight;
    }
  }
}
</style>

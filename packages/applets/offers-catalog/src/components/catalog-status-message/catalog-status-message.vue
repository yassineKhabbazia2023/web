<template>
  <div
    class="flex
      flex--direction-column
      flex--align-items-center
      padding-top--12
      text-color--base-blue-pulse
    "
  >
    <PIcon
      v-if="iconName !== undefined"
      :pName="iconName"
      pSize="24"
      class="margin-bottom--4"
    />
    <p
      v-if="message !== ''"
      class="font-bold text-center"
    >
      {{ message }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { PIcon } from '@pulse/styleguide/components'
import type { CatalogStatusMessageProps } from './catalog-status-message.types'

defineProps<CatalogStatusMessageProps>()
</script>

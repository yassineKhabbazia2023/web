<template>
  <div
    data-testid="no-appointments-placeholder"
    class="
      flex
      flex--direction-column
      flex--align-items-center
      flex--justify-content-center
      flex--grow-1
      flex-gap--3
      text-color--neutral-gray-500
      margin-y--6
    "
  >
    <PIcon
      pName="calendarNone"
      pSize="28"
    />
    <span class="text-center">
      {{ message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { PIcon } from '@pulse/styleguide/components'

defineProps<{
  message: string
}>()
</script>

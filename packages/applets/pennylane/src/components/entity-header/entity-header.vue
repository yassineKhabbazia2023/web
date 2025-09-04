<template>
  <div
    class="
      entity-header
      flex
      flex--align-items-center
    "
  >
    <PAvatar pType="small" :pColor="entityAvatarColor">
      <PIcon pName="pulse" />
    </PAvatar>
    <h4 class="margin-left--3">
      {{ accountName }}
    </h4>
    <div
      class="
        account-information__fake-pipe
        margin-x--3
      "
    />
    <span
      class="
        text-color--neutral-gray-300
      "
    >
      {{ accountNumber }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import { getAvatarColorFromKey } from '@pulse/styleguide'
import type { EntityHeaderProps } from './entity-header.type'

const props = defineProps<EntityHeaderProps>()

const entityAvatarColor = computed(() => getAvatarColorFromKey(props.accountNumber))
</script>

<style lang="scss" scoped>
.entity-header {
 &__fake-pipe {
    width: 1px;
    height: 12px;
    background: var(--el-color-neutral-gray-300);
 }
}
</style>

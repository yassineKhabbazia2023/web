<template>
  <div
    class="
      account-information
      flex flex--align-items-center
      padding-top--4 padding-left--4
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
import type { AccountInformationProps } from './AccountInformationTypes'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const props = defineProps<AccountInformationProps>()

const entityAvatarColor = computed(() => getAvatarColorFromKey(props.accountNumber))
</script>

<style lang="scss" scoped>
.account-information {
 &__fake-pipe {
    width: 1px;
    height: 12px;
    background: var(--el-color-neutral-gray-300);
 }
}
</style>

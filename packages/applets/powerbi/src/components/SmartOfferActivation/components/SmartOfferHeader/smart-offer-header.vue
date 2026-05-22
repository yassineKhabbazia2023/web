<template>
  <div
    class="smart-offer-activation__header bg--base-white flex flex--align-items-center padding-x--6 padding-y--4"
    role="banner"
  >
    <PEntityAvatar
      aria-label="Entity Avatar"
      pShape="circle"
      pType="small"
      :pAccountType="currentEntity.accountType"
      :pColor="entityAvatarColor"
    />
    <h4
      class="h4 margin-left--2"
    >
      {{ currentEntity.legalName }}
    </h4>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SmartOfferHeaderProps } from './smart-offer-header.type'
import { PEntityAvatar } from '@pulse/styleguide/components'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const props = defineProps<SmartOfferHeaderProps>()

const entityAvatarColor = computed(() => getAvatarColorFromKey(props.currentEntity.accountNumber))
</script>

<style lang="scss" scoped>
.smart-offer-activation__header {
  border-bottom: 1px solid var(--el-border-color);
}
</style>

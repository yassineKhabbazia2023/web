<template>
  <PDrawer
    v-model="internalIsOpened"
    :pShowPreviousStep="false"
    pTitle=""
    pSize="50%"
    pDirection="rtl"
    class="subscription-drawer"
    @close-drawer-button="handleCloseDrawer"
    data-testid="subscription-drawer"
  >
    <template #header-prefix>
      <p class="subscription-drawer__account-name font-base" data-testid="subscription-drawer-title">
        {{ subscriptionDrawerTitle }}
      </p>
    </template>
    <SubscriptionDetailsTabs data-testid="subscription-drawer-tabs"/>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PDrawer } from '@kpmg/styleguide'
import type { SubscriptionDetailsDrawerProps } from './SubscriptionDetailsDrawerTypes'
import SubscriptionDetailsTabs from './components/SubscriptionDetailsTabs'

const props = defineProps<SubscriptionDetailsDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const subscriptionDrawerTitle = computed(() => {
  return `${props.account.accountLabel} - Nº ${props.account.accountNumber}`
})

const handleCloseDrawer = () => {
  internalIsOpened.value = false
}
</script>

<style lang="scss" scoped>
.subscription-drawer {
  &__account-name {
    color: var(--el-text-color-secondary);
  }
}
</style>
